import React, { useState } from "react";
import {
  Briefcase,
  Plus,
  UserCheck,
  LogOut,
  MapPin,
  ChevronDown,
  ShieldCheck,
  BadgeCheck,
  History,
  Grid,
} from "lucide-react";
import { User, googleProvider, signInWithPopup, signOut, auth } from "../lib/firebase";
import { UserProfile, CategoryType } from "../types";

interface HeaderProps {
  user: User | null;
  onOpenPostJob: () => void;
  currentLocation: string;
  onOpenLocationModal: () => void;
  profile?: UserProfile;
  onOpenProfileModal?: () => void;
  onOpenHistory?: () => void;
  activeHiresCount?: number;
  onSelectCategory?: (category: CategoryType) => void;
  onOpenAuthModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenPostJob,
  currentLocation,
  onOpenLocationModal,
  profile,
  onOpenProfileModal,
  onOpenHistory,
  activeHiresCount,
  onSelectCategory,
  onOpenAuthModal,
}) => {
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  const handleCategoryClick = (cat: CategoryType) => {
    setIsCategoryMenuOpen(false);
    if (onSelectCategory) {
      onSelectCategory(cat);
    }
    const el = document.getElementById("category-grid-section") || document.getElementById("local-pros-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Google Auth failed:", err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  // Calculate quick completion score
  let score = 0;
  if (profile) {
    if (profile.name && profile.location) score += 25;
    if (profile.bio && profile.bio.trim().length > 10) score += 25;
    if (profile.phone && profile.phone.trim().length >= 10) score += 25;
    if (profile.isIdVerified) score += 25;
  } else {
    score = 50;
  }

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md border-b bg-white/95 border-slate-200 transition-colors duration-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Location Bar */}
        <div className="flex items-center space-x-3 sm:space-x-6">
          <div className="flex items-center space-x-2.5 cursor-pointer">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Skill Bridge
              </span>
              <span className="hidden lg:inline-block ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                Urban Freelance
              </span>
            </div>
          </div>

          {/* Location Selector (Urban Company Style) */}
          <button
            id="header-location-selector"
            onClick={onOpenLocationModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-800 border border-slate-200/80 transition-colors cursor-pointer"
          >
            <MapPin className="h-4 w-4 text-blue-600 shrink-0" />
            <span className="text-xs font-bold max-w-[120px] sm:max-w-[160px] truncate">
              {currentLocation || "Select Location"}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          </button>

          {/* Categories Dropdown with Smooth Slide-Down Scroll */}
          <div className="relative">
            <button
              id="header-categories-dropdown-btn"
              onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-800 border border-slate-200/80 transition-colors cursor-pointer text-xs font-bold"
            >
              <Grid className="h-4 w-4 text-blue-600 shrink-0" />
              <span className="hidden sm:inline">Categories</span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
                  isCategoryMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isCategoryMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
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
                    onClick={() => handleCategoryClick(cat)}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>{cat}</span>
                    <span className="text-[10px] text-slate-400 font-normal">Slide down ↓</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Profile Completion Indicator Pill in Nav */}
          {onOpenProfileModal && (
            <button
              id="header-profile-trust-pill"
              onClick={onOpenProfileModal}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                score === 100
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100"
                  : "bg-blue-50/80 border-blue-200 text-blue-700 hover:bg-blue-100"
              }`}
            >
              {profile?.isIdVerified ? (
                <BadgeCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              ) : (
                <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
              )}
              <span className="hidden sm:inline">
                {score === 100 ? "100% Verified" : `Profile: ${score}%`}
              </span>
              <span className="sm:hidden">{score}%</span>
            </button>
          )}

          {/* History Button */}
          {onOpenHistory && (
            <button
              id="header-history-btn"
              onClick={onOpenHistory}
              className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer relative"
              title="View My Hires & Escrow Status"
            >
              <History className="h-4 w-4 text-blue-600 shrink-0" />
              <span className="hidden md:inline">My Hires</span>
              {activeHiresCount !== undefined && activeHiresCount > 0 && (
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>
          )}

          {/* Post Job Button */}
          <button
            id="post-job-header-btn"
            onClick={onOpenPostJob}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-xs shadow-sm transition-all duration-150 hover:shadow-md cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Post a Job</span>
            <span className="sm:hidden">Post</span>
          </button>

          {/* User Auth Profile / Login */}
          {user ? (
            <div className="flex items-center space-x-2 pl-1 border-l border-slate-200">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  referrerPolicy="no-referrer"
                  className="h-8 w-8 rounded-full border border-blue-500/30 object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  {user.displayName?.[0] || user.email?.[0] || "U"}
                </div>
              )}
              <span className="hidden md:inline-block text-xs font-semibold text-slate-700 max-w-[120px] truncate">
                {user.displayName || user.email || "Account"}
              </span>
              <button
                id="sign-out-btn"
                onClick={handleSignOut}
                title="Sign Out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              id="google-signin-btn"
              onClick={onOpenAuthModal || handleGoogleSignIn}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <UserCheck className="h-3.5 w-3.5 text-blue-600" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
