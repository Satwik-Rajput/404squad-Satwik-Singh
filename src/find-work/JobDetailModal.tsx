import React, { useState, useMemo } from "react";
import {
  X,
  Star,
  MapPin,
  Clock,
  Shield,
  CheckCircle,
  Award,
  DollarSign,
  Calendar,
  Sparkles,
  Zap,
  Check,
} from "lucide-react";
import { Job, Worker, BudgetUnit } from "../types";

interface JobDetailModalProps {
  job: Job | null;
  worker?: Worker | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmHire: (hireData: {
    job: Job;
    worker: Worker;
    durationLabel: string;
    durationInMinutes: number;
    totalPrice: number;
  }) => void;
}

// Duration options mapping
const DURATION_STEPS = [
  { label: "15 Minutes", minutes: 15, hours: 0.25, days: 0.03, months: 0.001 },
  { label: "30 Minutes", minutes: 30, hours: 0.5, days: 0.06, months: 0.002 },
  { label: "1 Hour", minutes: 60, hours: 1, days: 0.125, months: 0.004 },
  { label: "4 Hours", minutes: 240, hours: 4, days: 0.5, months: 0.016 },
  { label: "1 Day (8 hrs)", minutes: 480, hours: 8, days: 1, months: 0.033 },
  { label: "1 Week (5 days)", minutes: 2400, hours: 40, days: 5, months: 0.16 },
  { label: "1 Month", minutes: 9600, hours: 160, days: 20, months: 1 },
  { label: "3 Months", minutes: 28800, hours: 480, days: 60, months: 3 },
  { label: "6 Months", minutes: 57600, hours: 960, days: 120, months: 6 },
  { label: "12 Months", minutes: 115200, hours: 1920, days: 240, months: 12 },
];

const PRESET_BUTTONS = [
  { label: "15 mins", index: 0 },
  { label: "1 hour", index: 2 },
  { label: "1 day", index: 4 },
  { label: "1 week", index: 5 },
  { label: "1 month", index: 6 },
];

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  worker,
  isOpen,
  onClose,
  onConfirmHire,
}) => {
  const [sliderIndex, setSliderIndex] = useState(2); // default 1 Hour

  const selectedDuration = DURATION_STEPS[sliderIndex] || DURATION_STEPS[2];

  // Dynamic Pricing Calculation (Hook called unconditionally)
  const totalPrice = useMemo(() => {
    if (!job) return 0;
    const rate = job.budget;
    const unit: BudgetUnit = job.budgetUnit || "hour";

    switch (unit) {
      case "minute":
        return Math.round(rate * selectedDuration.minutes);
      case "hour":
        return Math.round(rate * selectedDuration.hours);
      case "day":
        return Math.round(rate * selectedDuration.days);
      case "month":
        return Math.round(rate * selectedDuration.months);
      default:
        return Math.round(rate * selectedDuration.hours);
    }
  }, [job?.budget, job?.budgetUnit, selectedDuration]);

  if (!isOpen || !job) return null;

  // Use provided worker or synthesize worker profile from job details
  const activeWorker: Worker = worker || {
    id: "w-job-assigned",
    name: job.workerName || "Rajesh Kumar",
    avatar:
      job.workerAvatar ||
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
    title: job.workerTitle || `${job.category} Expert`,
    category: job.category,
    rating: job.workerRating || 4.95,
    hourlyRate: job.budget,
    bio: `Top-rated specialist in ${job.category} with a verified track record delivering high quality outcomes on Skill Bridge.`,
    badges: ["Verified Identity", "Top Rated", "Background Checked"],
    completedJobs: 112,
    location: job.location,
    skills: [job.category, "Client Success", "Quality Assured", "Fast Turnaround"],
  };

  const handleHireClick = () => {
    onConfirmHire({
      job,
      worker: activeWorker,
      durationLabel: selectedDuration.label,
      durationInMinutes: selectedDuration.minutes,
      totalPrice,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-blue-200 mb-1">
            <span>{job.category}</span>
            <span>•</span>
            <span className="capitalize">{job.budgetUnit} Rate</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold pr-8 leading-snug">
            {job.title}
          </h2>

          <div className="flex items-center space-x-4 mt-3 text-xs text-blue-100">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-cyan-300" />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-cyan-300" />
              Posted recently
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Job Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
              Job Scope & Details
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Assigned Worker Profile Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-start justify-between">
              <div className="flex space-x-3">
                <img
                  src={activeWorker.avatar}
                  alt={activeWorker.name}
                  referrerPolicy="no-referrer"
                  className="h-14 w-14 rounded-2xl object-cover border-2 border-white dark:border-slate-700 shadow-xs"
                />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    {activeWorker.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {activeWorker.title}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center text-amber-500 text-xs font-bold">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 mr-1" />
                      {activeWorker.rating}
                    </div>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {activeWorker.completedJobs} jobs completed
                    </span>
                  </div>
                </div>
              </div>

              {/* Base Rate */}
              <div className="text-right">
                <div className="text-xs text-slate-400">Base Rate</div>
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  ₹{job.budget.toLocaleString()}
                  <span className="text-xs font-normal text-slate-500">
                    /{job.budgetUnit}
                  </span>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-2">
              {activeWorker.badges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center space-x-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                >
                  {badge === "Verified Identity" && (
                    <CheckCircle className="h-3.5 w-3.5 text-blue-500" />
                  )}
                  {badge === "Top Rated" && (
                    <Award className="h-3.5 w-3.5 text-amber-500" />
                  )}
                  {badge === "Background Checked" && (
                    <Shield className="h-3.5 w-3.5 text-emerald-500" />
                  )}
                  <span>{badge}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Dynamic Pricing & Duration Selector */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50/80 to-purple-50/80 dark:from-slate-800 dark:to-blue-950/40 border border-blue-200 dark:border-blue-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-blue-600 text-white">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    Dynamic Duration Calculator
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Select job timeframe (15 mins to 12 months)
                  </p>
                </div>
              </div>

              {/* Total Calculated Price */}
              <div className="text-right">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Total Investment
                </div>
                <div className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-300 bg-clip-text text-transparent">
                  ₹{totalPrice.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Preset Quick Duration Buttons */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Quick Duration Presets
              </label>
              <div className="flex flex-wrap gap-2">
                {PRESET_BUTTONS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => setSliderIndex(p.index)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      sliderIndex === p.index
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Range Slider Control */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-xs font-bold text-blue-700 dark:text-blue-300">
                <span>Selected: {selectedDuration.label}</span>
                <span>
                  ₹{job.budget.toLocaleString()}/{job.budgetUnit}
                </span>
              </div>

              <input
                id="duration-slider-input"
                type="range"
                min={0}
                max={DURATION_STEPS.length - 1}
                value={sliderIndex}
                onChange={(e) => setSliderIndex(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />

              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>15 min</span>
                <span>1 day</span>
                <span>1 month</span>
                <span>12 months</span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="hire-now-confirm-btn"
              onClick={handleHireClick}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-bold shadow-md shadow-blue-500/20 hover:shadow-lg transition-all cursor-pointer"
            >
              <Zap className="h-4 w-4" />
              <span>Hire Now for ₹{totalPrice.toLocaleString()}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
