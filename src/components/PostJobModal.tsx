import React, { useState } from "react";
import {
  X,
  Sparkles,
  MapPin,
  Tag,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { CategoryType, BudgetUnit, Job } from "../types";

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitJob: (jobData: Omit<Job, "id" | "createdAt">) => Promise<void>;
}

const CATEGORIES: Exclude<CategoryType, "All">[] = [
  "Home Services",
  "Legal",
  "Education",
  "Tech",
  "Creative",
  "Wellness",
];

const BUDGET_UNITS: { label: string; value: BudgetUnit }[] = [
  { label: "Per Minute", value: "minute" },
  { label: "Per Hour", value: "hour" },
  { label: "Per Day", value: "day" },
  { label: "Per Month", value: "month" },
];

export const PostJobModal: React.FC<PostJobModalProps> = ({
  isOpen,
  onClose,
  onSubmitJob,
}) => {
  const [clientName, setClientName] = useState("Ananya Sharma");
  const [clientPhone, setClientPhone] = useState("+91 98765 43210");
  const [clientEmail, setClientEmail] = useState("ananya.sharma@example.com");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Exclude<CategoryType, "All">>("Tech");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState<string>("1200");
  const [budgetUnit, setBudgetUnit] = useState<BudgetUnit>("hour");
  const [location, setLocation] = useState("Andheri West, Mumbai");

  const [aiSuggestLoading, setAiSuggestLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{
    suggestedAmount: number;
    reasoning: string;
    minRange?: number;
    maxRange?: number;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // AI Suggest Rate Handler
  const handleAiSuggestRate = async () => {
    setAiSuggestLoading(true);
    setAiSuggestion(null);

    try {
      const response = await fetch("/api/suggest-rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          title,
          description,
          budgetUnit,
        }),
      });

      if (!response.ok) throw new Error("Failed to get AI recommendation");

      const data = await response.json();
      if (data.suggestedAmount) {
        setBudget(String(data.suggestedAmount));
        setAiSuggestion(data);
      }
    } catch (err) {
      console.error("AI Suggest Rate Error:", err);
      // Indian market benchmark rates fallback
      const defaults: Record<string, number> = {
        "Home Services": 600,
        Legal: 2500,
        Education: 800,
        Tech: 1200,
        Creative: 950,
        Wellness: 1000,
      };
      const fallbackVal = defaults[category] || 1000;
      setBudget(String(fallbackVal));
      setAiSuggestion({
        suggestedAmount: fallbackVal,
        reasoning: `Recommended market rate for ${category} in Indian rupees based on Skill Bridge benchmark data.`,
      });
    } finally {
      setAiSuggestLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !budget) return;

    setIsSubmitting(true);
    try {
      await onSubmitJob({
        title,
        category,
        description,
        budget: Number(budget) || 1000,
        budgetUnit,
        location: location || "Andheri West, Mumbai",
        postedBy: `${clientName} (${clientPhone})`,
        workerName: "Rajesh Kumar",
        workerAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
        workerRating: 4.95,
        workerTitle: `${category} Specialist`,
        status: "open",
      });

      // Reset form
      setTitle("");
      setDescription("");
      setAiSuggestion(null);
      onClose();
    } catch (err) {
      console.error("Error posting job:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Post a Job Listing
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Connect with verified local freelancers & workers instantly
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Client Details Section */}
          <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-slate-800/60 border border-blue-200/80 dark:border-slate-700/80 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-blue-700 dark:text-blue-300">
              Client & Employer Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Sharma"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="client@example.com"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Job Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Job Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Build React Dashboard or Fix Electrical Panel Wiring"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Category & Budget Unit Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as Exclude<CategoryType, "All">)
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Billing Cycle
              </label>
              <select
                value={budgetUnit}
                onChange={(e) => setBudgetUnit(e.target.value as BudgetUnit)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
              >
                {BUDGET_UNITS.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Budget Field & AI Suggest Rate Button */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Budget Rate (₹ INR)
              </label>

              {/* AI Suggest Rate Button */}
              <button
                id="ai-suggest-rate-btn"
                type="button"
                onClick={handleAiSuggestRate}
                disabled={aiSuggestLoading}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-medium shadow-xs transition-colors cursor-pointer disabled:opacity-60"
              >
                {aiSuggestLoading ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3 w-3 text-cyan-200" />
                    <span>AI Suggest Rate</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">
                ₹
              </span>
              <input
                type="number"
                min="10"
                required
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full pl-8 pr-20 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold"
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 uppercase font-semibold">
                / {budgetUnit}
              </span>
            </div>

            {/* AI Suggestion Output Callout */}
            {aiSuggestion && (
              <div className="mt-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 text-xs text-slate-700 dark:text-slate-200 space-y-1">
                <div className="flex items-center space-x-1.5 text-blue-700 dark:text-blue-300 font-bold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>
                    Suggested Rate: ₹{aiSuggestion.suggestedAmount.toLocaleString()} / {budgetUnit}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-snug">
                  {aiSuggestion.reasoning}
                </p>
              </div>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Location
            </label>
            <input
              type="text"
              placeholder="e.g. Andheri West, Mumbai or Koramangala, Bengaluru"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Detailed Description
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe the job responsibilities, required skills, and deliverables..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="submit-job-post-btn"
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <span>Publish Job Post</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
