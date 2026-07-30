import React from "react";
import { History, MapPin, ArrowRight, Clock, Trash2, Sparkles } from "lucide-react";
import { Job } from "../types";

interface RecentlyViewedSectionProps {
  jobs: Job[];
  onSelectJob: (job: Job) => void;
  onClearHistory: () => void;
}

export const RecentlyViewedSection: React.FC<RecentlyViewedSectionProps> = ({
  jobs,
  onSelectJob,
  onClearHistory,
}) => {
  if (!jobs || jobs.length === 0) {
    return null; // Don't show if user hasn't clicked any jobs yet
  }

  return (
    <section id="recently-viewed-section" className="space-y-4 pt-4 border-t border-slate-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
            <History className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
              Recently Viewed Jobs
            </h3>
            <p className="text-xs text-slate-500">
              Quickly jump back to the last {jobs.length} {jobs.length === 1 ? "job" : "jobs"} you explored
            </p>
          </div>
        </div>

        <button
          id="clear-recently-viewed-btn"
          onClick={onClearHistory}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 text-xs font-semibold transition-colors cursor-pointer"
          title="Clear recently viewed jobs history"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Clear History</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <div
            key={`recent-${job.id || job.title}`}
            onClick={() => onSelectJob(job)}
            className="group relative p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-400/80 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Category & Budget Tag */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80">
                  {job.category}
                </span>
                <span className="text-xs font-black text-slate-900">
                  ₹{job.budget.toLocaleString()}
                  <span className="text-[10px] font-normal text-slate-500">
                    /{job.budgetUnit}
                  </span>
                </span>
              </div>

              {/* Title */}
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                {job.title}
              </h4>

              {/* Location & Worker preview */}
              <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-2">
                <MapPin className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                <span className="truncate">{job.location}</span>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform">
              <div className="flex items-center space-x-1.5 text-slate-600 font-medium text-[11px]">
                {job.workerAvatar && (
                  <img
                    src={job.workerAvatar}
                    alt={job.workerName || "Worker"}
                    className="h-4 w-4 rounded-full object-cover"
                  />
                )}
                <span className="truncate max-w-[120px]">{job.workerName || "Available Pro"}</span>
              </div>
              <span className="flex items-center space-x-1 text-blue-600">
                <span>View</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
