import React from "react";
import {
  Users,
  Plus,
  History,
  ShieldCheck,
  Zap,
  Briefcase,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface HeroQuickStartProps {
  onSelectHireForJob: () => void;
  onSelectPostAJob: () => void;
  onOpenHistory: () => void;
  activeHiresCount: number;
}

export const HeroQuickStart: React.FC<HeroQuickStartProps> = ({
  onSelectHireForJob,
  onSelectPostAJob,
  onOpenHistory,
  activeHiresCount,
}) => {
  return (
    <div className="w-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800">
      {/* Background Glow Circles */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-extrabold backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-cyan-300" />
            <span>Instant Local Freelance & Service Match Platform</span>
          </div>

          {/* History Button */}
          <button
            id="hero-view-history-btn"
            onClick={onOpenHistory}
            className="flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <History className="h-4 w-4 text-cyan-300" />
            <span>My Hires & History</span>
            {activeHiresCount > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black">
                {activeHiresCount} Active
              </span>
            )}
          </button>
        </div>

        {/* Main Headline */}
        <div className="text-center sm:text-left space-y-2">
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            What would you like to do today?
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-medium">
            Choose whether to hire top verified local professionals directly or post a new job requirement for instant worker proposals with 100% Escrow security.
          </p>
        </div>

        {/* Two Main Hero Feature Option Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Card 1: Hire for a Job */}
          <div
            id="hero-card-hire-job"
            onClick={onSelectHireForJob}
            className="group relative p-6 rounded-2xl bg-gradient-to-br from-blue-900/60 via-indigo-900/40 to-slate-900/80 border border-blue-500/30 hover:border-blue-400 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-blue-600/30 border border-blue-400/30 text-cyan-300 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6" />
                </div>
                <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-200 border border-cyan-400/30">
                  60+ Available Pros
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                  Hire for a Job
                  <Zap className="h-4 w-4 text-amber-400 fill-amber-400" />
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Browse verified local developers, electricians, lawyers, tutors, designers, and wellness experts ready to start immediately.
                </p>
              </div>

              <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-medium pt-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Instant Booking & Direct Escrow Payment</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-cyan-300 group-hover:text-white transition-colors">
              <span>Browse Available Pros</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 2: Post a Job */}
          <div
            id="hero-card-post-job"
            onClick={onSelectPostAJob}
            className="group relative p-6 rounded-2xl bg-gradient-to-br from-purple-900/60 via-indigo-900/40 to-slate-900/80 border border-purple-500/30 hover:border-purple-400 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-purple-600/30 border border-purple-400/30 text-purple-300 group-hover:scale-110 transition-transform">
                  <Plus className="h-6 w-6" />
                </div>
                <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-200 border border-purple-400/30">
                  AI Rate Assisted
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-white group-hover:text-purple-300 transition-colors flex items-center gap-1.5">
                  Post a Job
                  <Briefcase className="h-4 w-4 text-purple-300" />
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Provide your client details, job description, budget, and location. Get smart AI-matched pro proposals in minutes.
                </p>
              </div>

              <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-medium pt-1">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
                <span>Client details required for accurate worker dispatch</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-purple-300 group-hover:text-white transition-colors">
              <span>Create Job Listing Now</span>
              <span>→</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
