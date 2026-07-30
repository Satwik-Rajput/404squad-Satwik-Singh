import os
import json
import math
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder="static", template_folder="templates")
PORT = 5000

# Helper to get Gemini AI client
def get_genai_client():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None
    try:
        from google import genai
        return genai.Client(api_key=api_key)
    except Exception as e:
        print("[Gemini Init Warning]", e)
        return None

@app.route("/")
def index():
    return render_template("index.html")

# API Endpoint: AI Market Rate Suggester
@app.route("/api/suggest-rate", methods=["POST"])
def suggest_rate():
    data = request.get_json() or {}
    category = data.get("category", "Tech & IT")
    title = data.get("title", "General Task")
    description = data.get("description", "Standard work")
    budget_unit = data.get("budgetUnit", "hour")

    fallback_rates = {
        "Home Services": 600,
        "Legal Advice": 2200,
        "Legal": 2200,
        "Education": 850,
        "Tech & IT": 1500,
        "Tech": 1500,
        "Creative": 1200,
        "Wellness": 1000,
    }
    base = fallback_rates.get(category, 1000)

    ai_client = get_genai_client()
    if ai_client:
        prompt = f"""You are a freelance market rate expert for India.
Provide a realistic recommended budget/rate in Indian Rupees (₹ INR) for a job posting on Skill Bridge India.
Job Title: {title}
Category: {category}
Unit: {budget_unit}
Description: {description}

Respond ONLY with a valid JSON object with the following keys:
{{
  "suggestedAmount": number (realistic numeric value in INR, e.g. 1200),
  "unit": "{budget_unit}",
  "reasoning": "A concise 1-2 sentence explanation of why this INR rate is fair.",
  "minRange": number,
  "maxRange": number
}}"""
        try:
            response = ai_client.models.generate_content(
                model="gemini-3.6-flash",
                contents=prompt,
                config={"response_mime_type": "application/json"}
            )
            res_text = response.text or "{}"
            return jsonify(json.loads(res_text))
        except Exception as err:
            print("[Smart Rate AI Error] Using fallback calculation:", err)

    min_val = round(base * 0.8)
    max_val = round(base * 1.3)
    return jsonify({
        "suggestedAmount": base,
        "unit": budget_unit,
        "reasoning": f"Based on current Indian market standards for {category}, typical rates range between ₹{min_val:,} and ₹{max_val:,} per {budget_unit}.",
        "minRange": min_val,
        "maxRange": max_val
    })

# API Endpoint: AI Smart Match Workers
@app.route("/api/smart-match", methods=["POST"])
def smart_match():
    data = request.get_json() or {}
    job_title = data.get("jobTitle", "")
    category = data.get("category", "")
    description = data.get("description", "")
    budget = data.get("budget", 1000)
    budget_unit = data.get("budgetUnit", "hour")
    workers = data.get("workers", [])

    ai_client = get_genai_client()
    if ai_client and len(workers) > 0:
        prompt = f"""You are Skill Bridge India's AI Matching Engine.
Given a job request in Indian local context:
- Title: {job_title}
- Category: {category}
- Description: {description}
- Budget: ₹{budget}/{budget_unit}

Available Workers:
{json.dumps(workers, indent=2)}

Select or analyze up to 3 best worker matches for this job. Return a JSON array of 3 objects with keys:
- workerId: string
- matchPercentage: number (e.g. 96, 91, 88)
- reason: string (1 concise sentence explaining fit)
- highlightSkill: string"""
        try:
            response = ai_client.models.generate_content(
                model="gemini-3.6-flash",
                contents=prompt,
                config={"response_mime_type": "application/json"}
            )
            res_text = response.text or "[]"
            matches = json.loads(res_text)
            return jsonify({"matches": matches})
        except Exception as err:
            print("[Smart Match AI Error] Using fallback algorithm:", err)

    # Rule-based fallback matching engine
    filtered = [
        w for w in workers
        if (w.get("skills") and any(category.lower() in s.lower() for s in w.get("skills", []))) or
           (w.get("title") and category.lower() in w.get("title", "").lower())
    ]
    candidates = filtered if len(filtered) >= 3 else workers
    sorted_workers = sorted(candidates, key=lambda x: x.get("rating", 0), reverse=True)[:3]

    fallback_matches = []
    for idx, w in enumerate(sorted_workers):
        fallback_matches.append({
            "workerId": w.get("id", f"w{idx+1}"),
            "matchPercentage": max(85, 97 - idx * 4),
            "reason": f"Top verified {w.get('title', category or 'expert')} with {w.get('rating', 4.9)}★ rating and verified local service history in {job_title or category or 'Skill Bridge'}.",
            "highlightSkill": (w.get("badges") or ["Top Rated Pro"])[0]
        })

    return jsonify({"matches": fallback_matches})

if __name__ == "__main__":
    print(f"Skill Bridge Python Server running on http://localhost:{PORT}")
    app.run(host="0.0.0.0", port=PORT, debug=True)
