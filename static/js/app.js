import { AuthManager } from "./auth.js";
import { initModals } from "./modals.js";
import { fetchSmartMatch } from "./api.js";

class App {
  constructor() {
    this.authManager = new AuthManager();
    this.currentLocation = "Andheri West, Mumbai";
    this.selectedCategory = "All";
    this.searchQuery = "";
    this.activeTab = "providers"; // 'providers' | 'jobs'
    this.sortBy = "default";
    this.workers = [];
    this.jobs = [];
    this.hiresHistory = JSON.parse(localStorage.getItem("skill_bridge_hires_history")) || [];
    this.smartMatches = [];
  }

  async init() {
    try {
      const spRes = await fetch("/static/data/service_providers.json");
      const spData = await spRes.json();
      
      const avatars = [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300",
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"
      ];

      this.workers = spData.map((sp, idx) => {
        let cat = sp.category;
        if (cat === "Legal Advice") cat = "Legal";
        if (cat === "Tech & IT") cat = "Tech";

        return {
          id: sp.id,
          name: sp.name,
          avatar: avatars[idx % avatars.length],
          title: `${sp.subCategory} Professional (${sp.experience} Yrs Exp)`,
          category: cat,
          subCategory: sp.subCategory,
          rating: sp.rating,
          hourlyRate: sp.hourlyRate,
          bio: sp.description,
          city: sp.city,
          location: `${sp.city}, India`,
          experience: sp.experience,
          badges: sp.verified ? ["Verified Identity", "Top Rated"] : ["Verified Pro"],
          completedJobs: sp.reviews || Math.floor(sp.rating * 35),
        };
      });

      this.jobs = [
        {
          id: "job-tech-01",
          title: "Build React & Gemini AI Dashboard for E-Commerce App",
          category: "Tech",
          description: "Looking for an experienced full-stack developer to build a real-time analytics dashboard with interactive charts.",
          budget: 1200,
          budgetUnit: "hour",
          location: "Koramangala, Bengaluru",
          workerName: "Rajesh Kumar",
          workerRating: 4.98,
          createdAt: new Date().toISOString(),
          status: "open",
        },
        {
          id: "job-legal-01",
          title: "Draft Startup Founder Agreement & GST Terms",
          category: "Legal",
          description: "Corporate advocate required to review founder equity terms, NDAs, and consumer privacy policies.",
          budget: 2500,
          budgetUnit: "hour",
          location: "Connaught Place, New Delhi",
          workerName: "Adv. Priya Sharma",
          workerRating: 4.95,
          createdAt: new Date().toISOString(),
          status: "open",
        },
      ];

      initModals(this);
      this.bindEvents();
      this.renderUI();
      this.loadSmartMatches();
    } catch (err) {
      console.error("[Init Error]", err);
    }
  }

  async loadSmartMatches() {
    const res = await fetchSmartMatch({
      jobTitle: "React & AI Dashboard",
      category: "Tech",
      description: "Build interactive analytics frontend",
      budget: 1200,
      budgetUnit: "hour",
      workers: this.workers,
    });
    if (res && res.matches) {
      this.smartMatches = res.matches;
      this.renderSmartMatches();
    }
  }

  bindEvents() {
    // Search Bar Input
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value;
        this.renderUI();
      });
    }

    // Category Dropdown Navigation
    document.getElementById("btn-categories-toggle")?.addEventListener("click", () => {
      document.getElementById("dropdown-categories")?.classList.toggle("active");
    });

    document.querySelectorAll(".dropdown-category-opt").forEach((opt) => {
      opt.addEventListener("click", () => {
        const cat = opt.getAttribute("data-category");
        this.selectedCategory = cat;
        document.getElementById("dropdown-categories")?.classList.remove("active");
        this.renderUI();
        document.getElementById("local-pros-section")?.scrollIntoView({ behavior: "smooth" });
      });
    });

    // Category Cards in CategoryGrid
    document.querySelectorAll(".category-card-item").forEach((card) => {
      card.addEventListener("click", () => {
        const cat = card.getAttribute("data-category");
        this.selectedCategory = cat;
        this.renderUI();
        document.getElementById("local-pros-section")?.scrollIntoView({ behavior: "smooth" });
      });
    });

    // Tab Toggle (Verified Pros vs Open Jobs)
    document.getElementById("tab-toggle-providers")?.addEventListener("click", () => {
      this.activeTab = "providers";
      this.renderUI();
    });

    document.getElementById("tab-toggle-jobs")?.addEventListener("click", () => {
      this.activeTab = "jobs";
      this.renderUI();
    });

    // Sort Dropdown
    document.getElementById("sort-select")?.addEventListener("change", (e) => {
      this.sortBy = e.target.value;
      this.renderUI();
    });
  }

  getFilteredWorkers() {
    return this.workers.filter((w) => {
      const matchCat =
        this.selectedCategory === "All" ||
        w.category.toLowerCase().includes(this.selectedCategory.toLowerCase()) ||
        this.selectedCategory.toLowerCase().includes(w.category.toLowerCase());

      const query = this.searchQuery.toLowerCase();
      const matchQuery =
        w.name.toLowerCase().includes(query) ||
        w.title.toLowerCase().includes(query) ||
        w.bio.toLowerCase().includes(query) ||
        w.city.toLowerCase().includes(query);

      return matchCat && matchQuery;
    });
  }

  getFilteredJobs() {
    return this.jobs.filter((j) => {
      const matchCat =
        this.selectedCategory === "All" ||
        j.category.toLowerCase().includes(this.selectedCategory.toLowerCase());

      const query = this.searchQuery.toLowerCase();
      const matchQuery =
        j.title.toLowerCase().includes(query) || j.description.toLowerCase().includes(query);

      return matchCat && matchQuery;
    });
  }

  renderUI() {
    // Render Header Auth & Profile State
    const user = this.authManager.getUser();
    const profile = this.authManager.getProfile();
    const authBox = document.getElementById("header-auth-box");

    if (authBox) {
      if (user) {
        authBox.innerHTML = `
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <div style="width:2rem; height:2rem; border-radius:9999px; background:#dbeafe; color:#1d4ed8; font-weight:800; display:flex; align-items:center; justify-content:center; font-size:0.75rem;">
              ${(user.name || "U")[0].toUpperCase()}
            </div>
            <span style="font-size:0.75rem; font-weight:700; color:#334155;">${user.name}</span>
            <button id="btn-logout" class="btn btn-secondary" style="padding:0.25rem 0.5rem; font-size:0.7rem;">Sign Out</button>
          </div>
        `;
        document.getElementById("btn-logout")?.addEventListener("click", () => {
          this.authManager.logout();
          this.renderUI();
        });
      } else {
        authBox.innerHTML = `
          <button id="btn-open-auth" class="btn btn-secondary">
            👤 Sign In
          </button>
        `;
        document.getElementById("btn-open-auth")?.addEventListener("click", () => {
          document.getElementById("modal-auth")?.classList.add("active");
        });
      }
    }

    // Render Trust Score
    const trustPill = document.getElementById("trust-score-pill");
    if (trustPill) {
      const score = this.authManager.getTrustScore();
      trustPill.innerText = `🛡️ Profile: ${score}%`;
    }

    // Render Category Filter Pills
    const pillsContainer = document.getElementById("category-filter-pills");
    if (pillsContainer) {
      const categories = ["All", "Home Services", "Legal", "Education", "Tech", "Creative", "Wellness"];
      pillsContainer.innerHTML = categories
        .map(
          (cat) => `
        <button class="filter-pill ${this.selectedCategory === cat ? "active" : ""}" data-category="${cat}" style="padding:0.4rem 0.85rem; border-radius:0.75rem; font-size:0.75rem; font-weight:800; cursor:pointer; border:1px solid #e2e8f0; background:${
            this.selectedCategory === cat ? "#2563eb" : "#ffffff"
          }; color:${this.selectedCategory === cat ? "#ffffff" : "#475569"}">
          ${cat}
        </button>
      `
        )
        .join("");

      pillsContainer.querySelectorAll(".filter-pill").forEach((pill) => {
        pill.addEventListener("click", () => {
          this.selectedCategory = pill.getAttribute("data-category");
          this.renderUI();
        });
      });
    }

    // Render Tab Controls
    const btnPros = document.getElementById("tab-toggle-providers");
    const btnJobs = document.getElementById("tab-toggle-jobs");
    const filteredWorkers = this.getFilteredWorkers();
    const filteredJobs = this.getFilteredJobs();

    if (btnPros && btnJobs) {
      btnPros.innerText = `Verified Pros (${filteredWorkers.length})`;
      btnJobs.innerText = `Open Jobs (${filteredJobs.length})`;

      btnPros.style.background = this.activeTab === "providers" ? "#2563eb" : "transparent";
      btnPros.style.color = this.activeTab === "providers" ? "#ffffff" : "#475569";
      btnJobs.style.background = this.activeTab === "jobs" ? "#2563eb" : "transparent";
      btnJobs.style.color = this.activeTab === "jobs" ? "#ffffff" : "#475569";
    }

    // Render Main Grid Content
    const gridContainer = document.getElementById("main-grid-content");
    if (!gridContainer) return;

    if (this.activeTab === "providers") {
      if (filteredWorkers.length === 0) {
        gridContainer.innerHTML = `
          <div style="grid-column: 1/-1; padding: 3rem; text-align: center; background: white; border-radius: 1.5rem; border: 1px solid #e2e8f0;">
            <h3>No verified pros found in "${this.selectedCategory}"</h3>
            <p style="font-size:0.8rem; color:#64748b;">Try clearing your search query or selecting a different category.</p>
          </div>
        `;
      } else {
        gridContainer.innerHTML = filteredWorkers
          .map(
            (w) => `
          <div class="pro-card">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div class="pro-header">
                  <img src="${w.avatar}" alt="${w.name}" class="pro-avatar" />
                  <div>
                    <h3 style="margin:0; font-size:1rem; font-weight:900;">${w.name}</h3>
                    <p style="margin:2px 0 0; font-size:0.75rem; color:#2563eb; font-weight:700;">${w.title}</p>
                    <p style="margin:2px 0 0; font-size:0.7rem; color:#64748b;">📍 ${w.location}</p>
                  </div>
                </div>
                <span class="badge-tag">₹${w.hourlyRate}/hr</span>
              </div>
              <p style="font-size:0.775rem; color:#475569; margin:0.75rem 0; line-height:1.4;">${w.bio}</p>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #f1f5f9; pt-2;">
              <span style="font-size:0.75rem; font-weight:800; color:#059669;">★ ${w.rating} (${w.completedJobs} hires)</span>
              <button class="btn btn-primary btn-hire-pro" data-worker-id="${w.id}" style="padding:0.4rem 0.85rem; font-size:0.75rem;">
                Book Escrow Hire →
              </button>
            </div>
          </div>
        `
          )
          .join("");

        gridContainer.querySelectorAll(".btn-hire-pro").forEach((btn) => {
          btn.addEventListener("click", () => {
            const wId = btn.getAttribute("data-worker-id");
            const worker = this.workers.find((w) => w.id === wId);
            if (worker) {
              this.triggerHireFlow(worker);
            }
          });
        });
      }
    } else {
      if (filteredJobs.length === 0) {
        gridContainer.innerHTML = `
          <div style="grid-column: 1/-1; padding: 3rem; text-align: center; background: white; border-radius: 1.5rem; border: 1px solid #e2e8f0;">
            <h3>No jobs found in "${this.selectedCategory}"</h3>
            <p style="font-size:0.8rem; color:#64748b;">Be the first to post a new job requirement!</p>
          </div>
        `;
      } else {
        gridContainer.innerHTML = filteredJobs
          .map(
            (j) => `
          <div class="pro-card">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                  <span class="badge-tag">${j.category}</span>
                  <h3 style="margin:0.5rem 0 0; font-size:0.95rem; font-weight:900;">${j.title}</h3>
                </div>
                <span style="font-size:1rem; font-weight:900; color:#2563eb;">₹${j.budget}/${j.budgetUnit}</span>
              </div>
              <p style="font-size:0.775rem; color:#475569; margin:0.75rem 0; line-height:1.4;">${j.description}</p>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #f1f5f9; pt-2;">
              <span style="font-size:0.7rem; color:#64748b;">📍 ${j.location}</span>
              <button class="btn btn-secondary" style="padding:0.4rem 0.85rem; font-size:0.75rem;">Proposal Submitted</button>
            </div>
          </div>
        `
          )
          .join("");
      }
    }
  }

  triggerHireFlow(worker) {
    const duration = prompt(`Enter duration commitment for ${worker.name}:\n1 = 1 Hour (₹${worker.hourlyRate})\n2 = 1 Day (₹${worker.hourlyRate * 6})\n3 = 1 Month (₹${worker.hourlyRate * 120})`, "1");
    if (!duration) return;

    let mult = 1;
    let label = "1 Hour";
    if (duration === "2") { mult = 6; label = "1 Day"; }
    if (duration === "3") { mult = 120; label = "1 Month"; }

    const subtotal = worker.hourlyRate * mult;
    const gst = Math.round(subtotal * 0.18);
    const total = subtotal + gst;

    const confirmHire = confirm(`Confirm Escrow Payment for ${worker.name}?\n\nScope: ${label}\nSubtotal: ₹${subtotal}\nGST (18%): ₹${gst}\nTotal Escrow Amount: ₹${total}`);
    if (confirmHire) {
      const record = {
        transactionId: "TXN-" + Date.now(),
        jobTitle: `Direct Engagement with ${worker.name}`,
        category: worker.category,
        workerName: worker.name,
        totalPrice: total,
        paymentDate: new Date().toLocaleDateString(),
        completionStatus: "in_progress",
      };
      this.hiresHistory.unshift(record);
      localStorage.setItem("skill_bridge_hires_history", JSON.stringify(this.hiresHistory));
      alert("🎉 ₹" + total + " held securely in Escrow! Work order activated.");
    }
  }

  renderSmartMatches() {
    const container = document.getElementById("smart-match-content");
    if (!container || this.smartMatches.length === 0) return;

    container.innerHTML = this.smartMatches
      .map(
        (m) => `
      <div style="background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); padding:1rem; border-radius:1rem; color:white;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:0.75rem; font-weight:900; color:#38bdf8;">${m.highlightSkill || "Top Match"}</span>
          <span style="font-size:0.8rem; font-weight:900; color:#4ade80;">${m.matchPercentage}% Match</span>
        </div>
        <p style="font-size:0.75rem; margin:0.5rem 0 0; color:#e2e8f0;">${m.reason}</p>
      </div>
    `
      )
      .join("");
  }

  renderHistory() {
    const list = document.getElementById("history-list-content");
    if (!list) return;
    if (this.hiresHistory.length === 0) {
      list.innerHTML = `<p style="text-align:center; font-size:0.8rem; color:#64748b;">No active escrow bookings found.</p>`;
      return;
    }

    list.innerHTML = this.hiresHistory
      .map(
        (h) => `
      <div style="padding:0.85rem; border-radius:0.75rem; border:1px solid #e2e8f0; margin-bottom:0.5rem; background:#f8fafc;">
        <div style="display:flex; justify-content:space-between;">
          <strong style="font-size:0.85rem;">${h.jobTitle}</strong>
          <span style="font-size:0.85rem; font-weight:900; color:#2563eb;">₹${h.totalPrice}</span>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:#64748b; margin-top:0.35rem;">
          <span>Pro: ${h.workerName}</span>
          <span>Status: 🟢 Escrow Secured (${h.paymentDate})</span>
        </div>
      </div>
    `
      )
      .join("");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.init();
});
