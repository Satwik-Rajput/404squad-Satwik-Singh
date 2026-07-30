import React from "react";
import {
  X,
  Sparkles,
  Star,
  CheckCircle,
  Shield,
  Award,
  MapPin,
  ArrowRight,
  Check,
  TrendingUp,
} from "lucide-react";
import { Worker, SmartMatchResult } from "../types";

export interface CompareWorkerItem {
  worker: Worker;
  match?: SmartMatchResult;
}

interface WorkerCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  item1: CompareWorkerItem | null;
  item2: CompareWorkerItem | null;
  onSelectWorkerToHire: (worker: Worker) => void;
}

export const WorkerCompareModal: React.FC<WorkerCompareModalProps> = ({
  isOpen,
  onClose,
  item1,
  item2,
  onSelectWorkerToHire,
}) => {
  if (!isOpen || !item1 || !item2) return null;

  const { worker: w1, match: m1 } = item1;
  const { worker: w2, match: m2 } = item2;

  // Highlights comparison
  const w1RateBetter = w1.hourlyRate <= w2.hourlyRate;
  const w2RateBetter = w2.hourlyRate <= w1.hourlyRate;

  const w1RatingBetter = w1.rating >= w2.rating;
  const w2RatingBetter = w2.rating >= w1.rating;

  const w1JobsBetter = w1.completedJobs >= w2.completedJobs;
  const w2JobsBetter = w2.completedJobs >= w1.completedJobs;

  const w1MatchBetter = (m1?.matchPercentage || 0) >= (m2?.matchPercentage || 0);
  const w2MatchBetter = (m2?.matchPercentage || 0) >= (m1?.matchPercentage || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Side-by-Side Candidate Comparison
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                  Smart Match AI
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Compare ratings, hourly rates, match AI reasons, and trust badges
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Comparison Body */}
        <div className="p-6 overflow-x-auto">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 min-w-[500px]">
            {/* Worker 1 Column */}
            <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Header Info */}
                <div className="flex items-start space-x-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                  <img
                    src={w1.avatar}
                    alt={w1.name}
                    referrerPolicy="no-referrer"
                    className="h-14 w-14 rounded-2xl object-cover border-2 border-white dark:border-slate-700 shadow-sm"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {w1.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {w1.title}
                    </p>
                    <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <MapPin className="h-3.5 w-3.5 text-blue-500" />
                      <span>{w1.location}</span>
                    </div>
                  </div>
                </div>

                {/* Match Score */}
                {m1 && (
                  <div
                    className={`p-3 rounded-xl border space-y-1 ${
                      w1MatchBetter
                        ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800"
                        : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
                      <span>Match AI Rating</span>
                      <span className="text-sm font-black">{m1.matchPercentage}%</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {m1.reason}
                    </p>
                  </div>
                )}

                {/* Rates Comparison */}
                <div
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    w1RateBetter
                      ? "bg-blue-50/80 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    Base Rate
                  </span>
                  <div className="text-right">
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      ₹{w1.hourlyRate.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400">/hr</span>
                    {w1RateBetter && (
                      <span className="block text-[10px] font-bold text-blue-600 dark:text-blue-400">
                        Better Rate
                      </span>
                    )}
                  </div>
                </div>

                {/* Ratings & Jobs */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Rating
                    </span>
                    <div className="flex items-center justify-center space-x-1 mt-0.5">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-black text-slate-900 dark:text-white">
                        {w1.rating}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Jobs Done
                    </span>
                    <span className="text-sm font-black text-slate-900 dark:text-white block mt-0.5">
                      {w1.completedJobs}
                    </span>
                  </div>
                </div>

                {/* Badges */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Verification Badges
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {w1.badges.map((b) => (
                      <span
                        key={b}
                        className="inline-flex items-center space-x-1 text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-emerald-100/80 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      >
                        <CheckCircle className="h-3 w-3" />
                        <span>{b}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Skills
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {w1.skills.map((s) => (
                      <span
                        key={s}
                        className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hire Button */}
              <button
                id={`compare-hire-${w1.id}`}
                onClick={() => {
                  onSelectWorkerToHire(w1);
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <span>Hire {w1.name.split(" ")[0]}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Worker 2 Column */}
            <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Header Info */}
                <div className="flex items-start space-x-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                  <img
                    src={w2.avatar}
                    alt={w2.name}
                    referrerPolicy="no-referrer"
                    className="h-14 w-14 rounded-2xl object-cover border-2 border-white dark:border-slate-700 shadow-sm"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {w2.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {w2.title}
                    </p>
                    <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <MapPin className="h-3.5 w-3.5 text-blue-500" />
                      <span>{w2.location}</span>
                    </div>
                  </div>
                </div>

                {/* Match Score */}
                {m2 && (
                  <div
                    className={`p-3 rounded-xl border space-y-1 ${
                      w2MatchBetter
                        ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800"
                        : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
                      <span>Match AI Rating</span>
                      <span className="text-sm font-black">{m2.matchPercentage}%</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {m2.reason}
                    </p>
                  </div>
                )}

                {/* Rates Comparison */}
                <div
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    w2RateBetter
                      ? "bg-blue-50/80 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    Base Rate
                  </span>
                  <div className="text-right">
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      ₹{w2.hourlyRate.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400">/hr</span>
                    {w2RateBetter && (
                      <span className="block text-[10px] font-bold text-blue-600 dark:text-blue-400">
                        Better Rate
                      </span>
                    )}
                  </div>
                </div>

                {/* Ratings & Jobs */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Rating
                    </span>
                    <div className="flex items-center justify-center space-x-1 mt-0.5">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-black text-slate-900 dark:text-white">
                        {w2.rating}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Jobs Done
                    </span>
                    <span className="text-sm font-black text-slate-900 dark:text-white block mt-0.5">
                      {w2.completedJobs}
                    </span>
                  </div>
                </div>

                {/* Badges */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Verification Badges
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {w2.badges.map((b) => (
                      <span
                        key={b}
                        className="inline-flex items-center space-x-1 text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-emerald-100/80 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      >
                        <CheckCircle className="h-3 w-3" />
                        <span>{b}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Skills
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {w2.skills.map((s) => (
                      <span
                        key={s}
                        className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hire Button */}
              <button
                id={`compare-hire-${w2.id}`}
                onClick={() => {
                  onSelectWorkerToHire(w2);
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <span>Hire {w2.name.split(" ")[0]}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
