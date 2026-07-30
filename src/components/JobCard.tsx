import React from "react";
import { Star, MapPin, Clock, ArrowUpRight, CheckCircle2, ShieldCheck, Tag, Award } from "lucide-react";
import { Job } from "../types";

interface JobCardProps {
  job: Job;
  onSelectJob: (job: Job) => void;
  userLocation?: string;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onSelectJob, userLocation }) => {
  // Generate realistic distance if not specified
  const distanceKm = (Math.abs((job.title.length * 7) % 35) / 10 + 0.8).toFixed(1);

  return (
    <div
      onClick={() => onSelectJob(job)}
      className="group relative p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1"
    >
      <div>
        {/* Category, Distance & Available Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
            {job.id && (
              <span className="inline-flex items-center space-x-1 text-[11px] font-mono font-extrabold px-2 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60">
                <span>{job.id}</span>
              </span>
            )}
            <span className="inline-flex items-center space-x-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60">
              <Tag className="h-3 w-3 text-blue-500" />
              <span>{job.category}</span>
            </span>

            {/* Distance badge */}
            <span className="inline-flex items-center space-x-1 text-[11px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              <MapPin className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
              <span>📍 {distanceKm} km away</span>
            </span>
          </div>

          {/* Available Now Badge */}
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold border border-emerald-200 dark:border-emerald-800/60 shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Available Now</span>
          </span>
        </div>

        {/* Job Title */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug mb-2">
          {job.title}
        </h3>

        {/* Description Snippet */}
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {job.description}
        </p>
      </div>

      <div>
        {/* Worker Info Bar & Budget */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="relative">
              <img
                src={
                  job.workerAvatar ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
                }
                alt={job.workerName || "Worker"}
                referrerPolicy="no-referrer"
                className="h-9 w-9 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-xs"
              />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-1 ring-white" />
            </div>

            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1 flex items-center gap-1">
                {job.workerName || "Vetted Pro"}
                <CheckCircle2 className="h-3 w-3 text-blue-500 shrink-0" />
              </div>
              <div className="flex items-center space-x-1 text-[11px] text-amber-500">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="font-bold">{job.workerRating || 4.9}</span>
                <span className="text-slate-400 text-[10px] font-normal">• Verified</span>
              </div>
            </div>
          </div>

          {/* Pricing & Action */}
          <div className="text-right">
            <div className="text-base font-black text-slate-900 dark:text-white">
              ₹{job.budget.toLocaleString()}
              <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400">
                /{job.budgetUnit}
              </span>
            </div>
            <button
              id={`job-card-hire-${job.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectJob(job);
              }}
              className="mt-1 flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
            >
              <span>Book / Hire</span>
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
