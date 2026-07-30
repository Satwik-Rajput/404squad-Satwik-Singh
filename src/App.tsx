import React, { useEffect, useState } from "react";
import {
  Briefcase,
  Search,
  Plus,
  Sparkles,
  Star,
  SlidersHorizontal,
  MapPin,
  CheckCircle2,
  Building2,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  db,
  auth,
  onAuthStateChanged,
  User,
} from "./lib/firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  query,
  orderBy,
} from "firebase/firestore";

import { CategoryType, Job, Worker, SmartMatchResult, UserProfile, HireRecord } from "./types";
import { INITIAL_JOBS, INITIAL_WORKERS } from "./data/seedData";

import { Header } from "./components/Header";
import { LocationModal } from "./components/LocationModal";
import { CategoryGrid } from "./components/CategoryGrid";
import { AnimatedCounter } from "./components/AnimatedCounter";
import { JobCard } from "./components/JobCard";
import { ProviderCard } from "./components/ProviderCard";
import { JobDetailModal } from "./components/JobDetailModal";
import { PostJobModal } from "./components/PostJobModal";
import { SmartMatchSection } from "./components/SmartMatchSection";
import { TestimonialsSection } from "./components/Testimonials";
import { FloatingChat } from "./components/FloatingChat";
import { HireSuccessModal } from "./components/HireSuccessModal";
import { ProfileCompletionWidget } from "./components/ProfileCompletionWidget";
import { ProfileModal } from "./components/ProfileModal";
import { RecentlyViewedSection } from "./components/RecentlyViewedSection";
import { HeroQuickStart } from "./components/HeroQuickStart";
import { PaymentGatewayModal } from "./components/PaymentGatewayModal";
import { HistoryModal } from "./components/HistoryModal";
import { SortDropdown, SortOption } from "./components/SortDropdown";
import { AuthModal } from "./components/AuthModal";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Location State (Urban Company / NoBroker style)
  const [currentLocation, setCurrentLocation] = useState("Andheri West, Mumbai");
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(true); // Open on first load

  // Firestore Jobs state
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isPostOpen, setIsPostOpen] = useState(false);

  // Hire Confirmation & Payment Gateway state
  const [isHireSuccessOpen, setIsHireSuccessOpen] = useState(false);
  const [hireInfo, setHireInfo] = useState<{
    job: Job;
    worker: Worker;
    durationLabel: string;
    totalPrice: number;
  } | null>(null);

  // Hires History & Payment Gateway State
  const [hiresHistory, setHiresHistory] = useState<HireRecord[]>(() => {
    const saved = localStorage.getItem("skill_bridge_hires_history");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [];
  });

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentPayload, setPaymentPayload] = useState<{
    job: Job;
    worker: Worker;
    durationLabel: string;
    totalPrice: number;
  } | null>(null);

  const handleUpdateHireStatus = async (
    hireId: string,
    newStatus: HireRecord["completionStatus"],
    reviewData?: { rating: number; review: string }
  ) => {
    setHiresHistory((prev) => {
      const updated = prev.map((h) => {
        if (h.id === hireId) {
          return {
            ...h,
            completionStatus: newStatus,
            ...(reviewData ? { userRating: reviewData.rating, userReview: reviewData.review } : {}),
          };
        }
        return h;
      });
      localStorage.setItem("skill_bridge_hires_history", JSON.stringify(updated));
      return updated;
    });

    try {
      const hireRef = doc(db, "hires", hireId);
      const updatePayload: Record<string, any> = { completionStatus: newStatus };
      if (reviewData) {
        updatePayload.userRating = reviewData.rating;
        updatePayload.userReview = reviewData.review;
      }
      await updateDoc(hireRef, updatePayload);
    } catch (err) {
      console.warn("Firestore update hire status error:", err);
    }
  };

  // Smart Match state
  const [smartMatches, setSmartMatches] = useState<SmartMatchResult[]>([]);
  const [isSmartMatchLoading, setIsSmartMatchLoading] = useState(false);
  const [activeMatchJobTitle, setActiveMatchJobTitle] = useState("React & Gemini AI Integration");

  // User Profile & Profile Completion State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("skill_bridge_user_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      name: "Aarav Sharma",
      email: "aarav.sharma@example.com",
      phone: "+91 98765 43210",
      bio: "Local technology enthusiast and small business owner looking for verified professionals.",
      headline: "Verified Client & Tech Advocate",
      location: "Andheri West, Mumbai",
      isIdVerified: false,
      skills: ["React", "UI Design"],
      emailNotifications: true,
    };
  });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Recently Viewed Jobs State (Tracks last 3 viewed jobs)
  const [recentlyViewedJobs, setRecentlyViewedJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem("skill_bridge_recently_viewed");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [];
  });

  const handleClearRecentlyViewed = () => {
    setRecentlyViewedJobs([]);
    localStorage.removeItem("skill_bridge_recently_viewed");
  };

  const handleSaveProfile = async (updated: UserProfile) => {
    setUserProfile(updated);
    localStorage.setItem("skill_bridge_user_profile", JSON.stringify(updated));
    if (user?.uid) {
      try {
        await setDoc(doc(db, "users", user.uid), updated, { merge: true });
      } catch (err) {
        console.warn("Firestore save user profile error:", err);
      }
    }
  };

  // Listen to Auth State & sync user profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setUserProfile((prev) => ({
          ...prev,
          name: currentUser.displayName || prev.name,
          email: currentUser.email || prev.email,
          photoURL: currentUser.photoURL || prev.photoURL,
        }));

        // Fetch user profile from Firestore if exists
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUserProfile((prev) => ({
              ...prev,
              ...(userDoc.data() as UserProfile),
            }));
          }
        } catch (err) {
          console.warn("Error loading user profile from Firestore:", err);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync Jobs from Firestore real-time
  useEffect(() => {
    try {
      const q = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const fetchedJobs: Job[] = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...(doc.data() as Omit<Job, "id">),
            }));
            setJobs(fetchedJobs);
          }
        },
        (error) => {
          console.warn("Firestore snapshot fallback to initial jobs:", error);
        }
      );
      return () => unsubscribe();
    } catch (err) {
      console.warn("Firestore listener initialization failed:", err);
    }
  }, []);

  // Sync Hires from Firestore real-time
  useEffect(() => {
    try {
      const q = query(collection(db, "hires"), orderBy("paymentDate", "desc"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const fetchedHires: HireRecord[] = snapshot.docs.map((d) => ({
              id: d.id,
              ...(d.data() as Omit<HireRecord, "id">),
            }));
            setHiresHistory(fetchedHires);
            localStorage.setItem("skill_bridge_hires_history", JSON.stringify(fetchedHires));
          }
        },
        (error) => {
          console.warn("Firestore hires snapshot error:", error);
        }
      );
      return () => unsubscribe();
    } catch (err) {
      console.warn("Firestore hires listener initialization failed:", err);
    }
  }, []);

  // Fetch initial Smart Match AI recommendations
  const fetchSmartMatches = async (jobTitle: string, category: string, description: string) => {
    setIsSmartMatchLoading(true);
    try {
      const response = await fetch("/api/smart-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle,
          category,
          description,
          budget: 65,
          budgetUnit: "hour",
          workers: INITIAL_WORKERS,
        }),
      });

      if (!response.ok) throw new Error("Smart match request failed");

      const data = await response.json();
      if (data.matches && data.matches.length > 0) {
        setSmartMatches(data.matches);
      } else {
        // Fallback recommendations if API fails
        setSmartMatches([
          {
            workerId: "w1",
            matchPercentage: 98,
            reason: "Top-ranked full stack architect with extensive experience in React and Gemini AI SDK.",
            highlightSkill: "Top Rated Expert",
          },
          {
            workerId: "w4",
            matchPercentage: 93,
            reason: "Expert UI/UX designer capable of designing slick dashboards and design systems.",
            highlightSkill: "Design Specialist",
          },
          {
            workerId: "w2",
            matchPercentage: 89,
            reason: "Strong analytical background for complex technical specification and legal compliance.",
            highlightSkill: "Verified Specialist",
          },
        ]);
      }
    } catch (err) {
      console.error("Smart match fetch error:", err);
      // Default fallback
      setSmartMatches([
        {
          workerId: "w1",
          matchPercentage: 98,
          reason: "Top-ranked full stack architect with extensive experience in React and Gemini AI SDK.",
          highlightSkill: "Top Rated Expert",
        },
        {
          workerId: "w4",
          matchPercentage: 93,
          reason: "Expert UI/UX designer capable of designing slick dashboards and design systems.",
          highlightSkill: "Design Specialist",
        },
        {
          workerId: "w2",
          matchPercentage: 89,
          reason: "Strong analytical background for complex technical specification and legal compliance.",
          highlightSkill: "Verified Specialist",
        },
      ]);
    } finally {
      setIsSmartMatchLoading(false);
    }
  };

  useEffect(() => {
    fetchSmartMatches("React & Gemini AI Dashboard", "Tech", "Build a responsive frontend web app.");
  }, []);

  // Create Job Handler
  const handlePostJobSubmit = async (jobData: Omit<Job, "id" | "createdAt">) => {
    const newJobPayload = {
      ...jobData,
      location: jobData.location || currentLocation,
      createdAt: new Date().toISOString(),
    };

    // Try saving to Firestore
    try {
      await addDoc(collection(db, "jobs"), newJobPayload);
    } catch (err) {
      console.warn("Firestore write failed, updating local state:", err);
      // Local fallback
      const localJob: Job = {
        id: `job-${Date.now()}`,
        ...newJobPayload,
      };
      setJobs((prev) => [localJob, ...prev]);
    }

    // Trigger Smart Match for new job
    setActiveMatchJobTitle(newJobPayload.title);
    fetchSmartMatches(newJobPayload.title, newJobPayload.category, newJobPayload.description);
  };

  const [activeTab, setActiveTab] = useState<"providers" | "jobs">("providers");
  const [providerSortBy, setProviderSortBy] = useState<SortOption>("default");
  const [jobSortBy, setJobSortBy] = useState<SortOption>("default");

  const isCategoryMatch = (itemCategory: string, selected: string) => {
    if (selected === "All") return true;
    if (itemCategory === selected) return true;
    const catA = (itemCategory || "").toLowerCase();
    const catB = (selected || "").toLowerCase();
    if (catA.includes(catB) || catB.includes(catA)) return true;
    return false;
  };

  // Filter Service Providers / Workers
  const filteredWorkers = INITIAL_WORKERS.filter((worker) => {
    const matchesCategory = isCategoryMatch(worker.category, selectedCategory);
    const matchesQuery =
      worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (worker.subCategory && worker.subCategory.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (worker.city && worker.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
      worker.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  // Sort Service Providers
  const sortedWorkers = [...filteredWorkers].sort((a, b) => {
    if (providerSortBy === "price_asc") {
      return a.hourlyRate - b.hourlyRate;
    }
    if (providerSortBy === "price_desc") {
      return b.hourlyRate - a.hourlyRate;
    }
    if (providerSortBy === "rating_desc") {
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      return b.completedJobs - a.completedJobs;
    }
    return 0;
  });

  // Filter Jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesCategory = isCategoryMatch(job.category, selectedCategory);
    const matchesQuery =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  // Sort Jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (jobSortBy === "price_asc") {
      return a.budget - b.budget;
    }
    if (jobSortBy === "price_desc") {
      return b.budget - a.budget;
    }
    if (jobSortBy === "rating_desc") {
      const ratingA = a.workerRating || 0;
      const ratingB = b.workerRating || 0;
      return ratingB - ratingA;
    }
    return 0;
  });

  const handleSelectJobToView = (job: Job) => {
    setSelectedJob(job);
    setIsDetailOpen(true);

    // Add job to Recently Viewed (last 3 unique jobs clicked)
    setRecentlyViewedJobs((prev) => {
      const filtered = prev.filter(
        (j) => (j.id && job.id ? j.id !== job.id : j.title !== job.title)
      );
      const updated = [job, ...filtered].slice(0, 3);
      localStorage.setItem("skill_bridge_recently_viewed", JSON.stringify(updated));
      return updated;
    });
  };

  const handleConfirmHire = (hireData: {
    job: Job;
    worker: Worker;
    durationLabel: string;
    durationInMinutes: number;
    totalPrice: number;
  }) => {
    setIsDetailOpen(false);
    setPaymentPayload({
      job: hireData.job,
      worker: hireData.worker,
      durationLabel: hireData.durationLabel,
      totalPrice: hireData.totalPrice,
    });
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = async (newRecord: HireRecord) => {
    setHiresHistory((prev) => {
      const updated = [newRecord, ...prev.filter((h) => h.id !== newRecord.id)];
      localStorage.setItem("skill_bridge_hires_history", JSON.stringify(updated));
      return updated;
    });

    try {
      await setDoc(doc(db, "hires", newRecord.id), newRecord);
    } catch (err) {
      console.warn("Firestore save hire record error:", err);
    }

    setIsPaymentOpen(false);
    setIsHistoryOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans transition-colors duration-200">
      {/* Header */}
      <Header
        user={user}
        onOpenPostJob={() => setIsPostOpen(true)}
        currentLocation={currentLocation}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        profile={userProfile}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        activeHiresCount={
          hiresHistory.filter((h) => h.completionStatus !== "released_and_finished").length
        }
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          const el = document.getElementById("local-pros-section") || document.getElementById("category-grid-section");
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-900 to-slate-900 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8">
          {/* Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-cyan-500/15 via-blue-500/10 to-transparent pointer-events-none" />

          <div className="relative max-w-5xl mx-auto text-center space-y-6">
            {/* Location Badge Indicator */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 backdrop-blur-sm text-cyan-300 text-xs font-bold tracking-wide">
              <MapPin className="h-4 w-4 text-cyan-300 animate-bounce" />
              <span>Showing Local Pros Near: {currentLocation}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Hire Verified Talent Near You for{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-200 bg-clip-text text-transparent">
                Minutes to Months
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Urban Company & NoBroker inspired freelance platform. Book electricians, legal advisors, STEM tutors, React engineers & coaches instantly with real-time duration pricing.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto pt-2">
              <div className="relative flex items-center p-1.5 rounded-2xl bg-white/10 dark:bg-slate-800/80 backdrop-blur-md border border-white/20 shadow-xl">
                <Search className="h-5 w-5 text-slate-300 ml-3.5" />
                <input
                  type="text"
                  placeholder="Search local jobs, workers or services near you..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent text-white placeholder-slate-300 text-sm outline-none"
                />
                <button
                  onClick={() => setIsPostOpen(true)}
                  className="hidden sm:flex items-center space-x-1 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs transition-colors cursor-pointer shrink-0"
                >
                  <Plus className="h-4 w-4" />
                  <span>Post Job</span>
                </button>
              </div>
            </div>

            {/* Live Stats Section */}
            <div className="pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="text-2xl sm:text-3xl font-black text-cyan-300">
                  <AnimatedCounter end={12847} suffix="+" duration={2200} />
                </div>
                <div className="text-xs font-semibold text-slate-300 mt-1">
                  Jobs Completed
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="text-2xl sm:text-3xl font-black text-blue-300">
                  <AnimatedCounter end={4921} suffix="+" duration={2200} />
                </div>
                <div className="text-xs font-semibold text-slate-300 mt-1">
                  Active Local Workers
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex flex-col items-center justify-center">
                <div className="text-2xl sm:text-3xl font-black text-amber-300 flex items-center gap-1">
                  <Star className="h-6 w-6 fill-amber-300 text-amber-300 inline" />
                  <AnimatedCounter end={4.9} decimals={1} suffix="★" duration={2200} />
                </div>
                <div className="text-xs font-semibold text-slate-300 mt-1">
                  Average Rating
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Workspace Container */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
          {/* Quick Start Hero Options: Hire for a Job vs Post a Job */}
          <HeroQuickStart
            onSelectHireForJob={() => {
              setActiveTab("providers");
              const el = document.getElementById("tab-toggle-providers");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            onSelectPostAJob={() => setIsPostOpen(true)}
            onOpenHistory={() => setIsHistoryOpen(true)}
            activeHiresCount={
              hiresHistory.filter((h) => h.completionStatus !== "released_and_finished").length
            }
          />
          {/* User Profile Completion & Trust Dashboard Widget */}
          <ProfileCompletionWidget
            profile={userProfile}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
          />

          {/* Urban Company Style Category Grid */}
          <CategoryGrid
            activeCategory={selectedCategory}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
          />

          {/* Smart Match AI Feature Widget */}
          <SmartMatchSection
            jobTitle={activeMatchJobTitle}
            category={selectedCategory}
            matches={smartMatches}
            allWorkers={INITIAL_WORKERS}
            onSelectWorkerToHire={(worker) => {
              const tempJob: Job = {
                title: `Engagement with ${worker.name}`,
                category: worker.category,
                description: worker.bio,
                budget: worker.hourlyRate,
                budgetUnit: "hour",
                location: worker.location,
                workerName: worker.name,
                workerAvatar: worker.avatar,
                workerRating: worker.rating,
                workerTitle: worker.title,
                createdAt: new Date().toISOString(),
                status: "open",
              };
              setSelectedJob(tempJob);
              setIsDetailOpen(true);
            }}
            isLoading={isSmartMatchLoading}
          />

          {/* Section Header & View Toggle Tabs */}
          <div id="local-pros-section" className="space-y-4 scroll-mt-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Local Pros & Freelance Jobs
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Verified pros and active job postings near {currentLocation}
                </p>
              </div>

              {/* Tab Toggle */}
              <div className="flex items-center space-x-1 p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-800 border border-slate-300/60 dark:border-slate-700/80">
                <button
                  id="tab-toggle-providers"
                  onClick={() => setActiveTab("providers")}
                  className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    activeTab === "providers"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Users className="h-3.5 w-3.5" />
                  <span>Verified Pros ({filteredWorkers.length})</span>
                </button>

                <button
                  id="tab-toggle-jobs"
                  onClick={() => setActiveTab("jobs")}
                  className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    activeTab === "jobs"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>Open Jobs ({filteredJobs.length})</span>
                </button>
              </div>
            </div>

            {/* Category Filter Pills & Sort Dropdown Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none flex-1">
                {(
                  [
                    "All",
                    "Home Services",
                    "Legal",
                    "Education",
                    "Tech",
                    "Creative",
                    "Wellness",
                  ] as CategoryType[]
                ).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      const target = document.getElementById("local-pros-section");
                      if (target) {
                        target.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Sorting Dropdown Component */}
              <div className="flex items-center justify-between sm:justify-end shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium sm:hidden">
                  {activeTab === "providers" ? sortedWorkers.length : sortedJobs.length}{" "}
                  {activeTab === "providers" ? "pros" : "jobs"} available
                </span>
                <SortDropdown
                  sortBy={activeTab === "providers" ? providerSortBy : jobSortBy}
                  onChangeSort={(option) => {
                    if (activeTab === "providers") {
                      setProviderSortBy(option);
                    } else {
                      setJobSortBy(option);
                    }
                  }}
                  label="Sort by"
                />
              </div>
            </div>
          </div>

          {/* Conditional Grid Display */}
          {activeTab === "providers" ? (
            /* Service Providers Grid */
            sortedWorkers.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <Users className="h-12 w-12 mx-auto text-slate-400 mb-3" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  No verified pros found in "{selectedCategory}"
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Try clearing your search query or selecting a different category.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSearchQuery("");
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedWorkers.map((worker) => (
                  <ProviderCard
                    key={worker.id}
                    worker={worker}
                    onSelectWorkerToHire={(w) => {
                      const tempJob: Job = {
                        id: `hire-${w.id}`,
                        title: `Direct Engagement with ${w.name}`,
                        category: w.category,
                        description: w.bio,
                        budget: w.hourlyRate,
                        budgetUnit: "hour",
                        location: w.location,
                        workerName: w.name,
                        workerAvatar: w.avatar,
                        workerRating: w.rating,
                        workerTitle: w.title,
                        createdAt: new Date().toISOString(),
                        status: "open",
                      };
                      setSelectedJob(tempJob);
                      setIsDetailOpen(true);
                    }}
                  />
                ))}
              </div>
            )
          ) : (
            /* Open Jobs Grid */
            sortedJobs.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <Briefcase className="h-12 w-12 mx-auto text-slate-400 mb-3" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  No jobs found in "{selectedCategory}"
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Be the first to post a new listing in this category!
                </p>
                <button
                  onClick={() => setIsPostOpen(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
                >
                  Post Job Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedJobs.map((job) => (
                  <JobCard
                    key={job.id || job.title}
                    job={job}
                    userLocation={currentLocation}
                    onSelectJob={handleSelectJobToView}
                  />
                ))}
              </div>
            )
          )}

          {/* Recently Viewed Jobs Section */}
          <RecentlyViewedSection
            jobs={recentlyViewedJobs}
            onSelectJob={handleSelectJobToView}
            onClearHistory={handleClearRecentlyViewed}
          />

          {/* Testimonials */}
          <TestimonialsSection />
        </main>

        {/* Location First Modal Popup */}
        <LocationModal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          currentLocation={currentLocation}
          onSelectLocation={(loc) => setCurrentLocation(loc)}
        />

        {/* Modals & Floating Components */}
        <JobDetailModal
          job={selectedJob}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          onConfirmHire={handleConfirmHire}
        />

        <PostJobModal
          isOpen={isPostOpen}
          onClose={() => setIsPostOpen(false)}
          onSubmitJob={handlePostJobSubmit}
        />

        <HireSuccessModal
          isOpen={isHireSuccessOpen}
          onClose={() => setIsHireSuccessOpen(false)}
          hireInfo={hireInfo}
        />

        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          profile={userProfile}
          onSaveProfile={handleSaveProfile}
        />

        {/* Fake Payment Gateway Modal */}
        {paymentPayload && (
          <PaymentGatewayModal
            isOpen={isPaymentOpen}
            onClose={() => setIsPaymentOpen(false)}
            job={paymentPayload.job}
            worker={paymentPayload.worker}
            durationLabel={paymentPayload.durationLabel}
            totalPrice={paymentPayload.totalPrice}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}

        {/* Hire History & Job Completion Status Modal */}
        <HistoryModal
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          hires={hiresHistory}
          onUpdateHireStatus={handleUpdateHireStatus}
          onBrowsePros={() => {
            setActiveTab("providers");
            const el = document.getElementById("tab-toggle-providers");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccessLogin={(displayName, email) => {
            setUserProfile((prev) => ({
              ...prev,
              name: displayName,
              email: email,
            }));
            setUser({
              displayName,
              email,
              uid: `user-${Date.now()}`,
            } as any);
          }}
        />

        <FloatingChat />
      </div>
  );
}
