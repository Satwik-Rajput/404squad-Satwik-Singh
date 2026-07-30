import { fetchSuggestRate } from "./api.js";

export function initModals(appState) {
  // Modal Backdrop Helpers
  const openModal = (id) => {
    const el = document.getElementById(id);
    if (el) el.classList.add("active");
  };

  const closeModal = (id) => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("active");
  };

  // Close triggers
  document.querySelectorAll("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const modalId = btn.getAttribute("data-close-modal");
      closeModal(modalId);
    });
  });

  // Auth Modal Triggers
  document.getElementById("btn-open-auth")?.addEventListener("click", () => {
    openModal("modal-auth");
  });

  document.getElementById("btn-guest-login")?.addEventListener("click", () => {
    appState.authManager.login("Demo Client", "demo@skillbridge.in");
    closeModal("modal-auth");
    appState.renderUI();
  });

  document.getElementById("form-auth")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("auth-name")?.value || "Client User";
    const email = document.getElementById("auth-email")?.value || "user@skillbridge.in";
    appState.authManager.login(name, email);
    closeModal("modal-auth");
    appState.renderUI();
  });

  // Post Job Modal Triggers
  document.querySelectorAll("[data-open-post-job]").forEach((btn) => {
    btn.addEventListener("click", () => {
      openModal("modal-post-job");
    });
  });

  // AI Suggest Rate Trigger inside Post Job Modal
  document.getElementById("btn-ai-suggest-rate")?.addEventListener("click", async () => {
    const cat = document.getElementById("post-job-category")?.value;
    const title = document.getElementById("post-job-title")?.value;
    const desc = document.getElementById("post-job-desc")?.value;
    const unit = document.getElementById("post-job-unit")?.value;

    const btn = document.getElementById("btn-ai-suggest-rate");
    if (btn) btn.innerText = "Calculating Rate...";

    const res = await fetchSuggestRate({ category: cat, title, description: desc, budgetUnit: unit });

    if (btn) btn.innerText = "🤖 AI Suggest Rate";
    if (res && res.suggestedAmount) {
      document.getElementById("post-job-budget").value = res.suggestedAmount;
      const reasonEl = document.getElementById("post-job-ai-reasoning");
      if (reasonEl) {
        reasonEl.innerText = res.reasoning;
        reasonEl.style.display = "block";
      }
    }
  });

  // Submit Post Job Form
  document.getElementById("form-post-job")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("post-job-title").value;
    const category = document.getElementById("post-job-category").value;
    const desc = document.getElementById("post-job-desc").value;
    const budget = parseFloat(document.getElementById("post-job-budget").value) || 1000;
    const unit = document.getElementById("post-job-unit").value;

    const newJob = {
      id: "job-" + Date.now(),
      title,
      category,
      description: desc,
      budget,
      budgetUnit: unit,
      location: appState.currentLocation,
      workerName: "Open Listing",
      createdAt: new Date().toISOString(),
      status: "open",
    };

    appState.jobs.unshift(newJob);
    closeModal("modal-post-job");
    appState.renderUI();
    alert("🎉 Job requirement posted successfully!");
  });

  // Location Modal
  document.getElementById("btn-open-location")?.addEventListener("click", () => {
    openModal("modal-location");
  });

  document.querySelectorAll(".location-option").forEach((opt) => {
    opt.addEventListener("click", () => {
      const loc = opt.getAttribute("data-location");
      appState.currentLocation = loc;
      document.getElementById("current-location-text").innerText = loc;
      closeModal("modal-location");
      appState.renderUI();
    });
  });

  // History Modal Trigger
  document.querySelectorAll("[data-open-history]").forEach((btn) => {
    btn.addEventListener("click", () => {
      appState.renderHistory();
      openModal("modal-history");
    });
  });
}
