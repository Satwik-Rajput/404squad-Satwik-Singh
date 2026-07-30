import React from "react";
import { Star, MapPin, CheckCircle2, ShieldCheck, Tag, Award, Briefcase, Calendar } from "lucide-react";
import { Worker, Job } from "../types";

interface ProviderCardProps {
  worker: Worker;
  onSelectWorkerToHire: (worker: Worker) => void;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({ worker, onSelectWorkerToHire }) => {
  return (
    <div
      onClick={() => onSelectWorkerToHire(worker)}
      className="group relative p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1"
    >
      <div>
        {/* ID, Category & Verified Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
            <span className="inline-flex items-center space-x-1 text-[11px] font-mono font-extrabold px-2 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800/60">
              <span>{worker.id}</span>
            </span>

            <span className="inline-flex items-center space-x-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60">
              <Tag className="h-3 w-3 text-blue-500" />
              <span>{worker.category}</span>
            </span>

            {worker.subCategory && (
              <span className="inline-flex items-center space-x-1 text-[11px] font-medium px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                <span>{worker.subCategory}</span>
              </span>
            )}
          </div>

          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold border border-emerald-200 dark:border-emerald-800/60 shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{worker.availability || "Available Today"}</span>
          </span>
        </div>

        {/* Worker Header Info */}
        <div className="flex items-start space-x-3 mb-3">
          <div className="relative shrink-0">
            <img
              src={worker.avatar}
              alt={worker.name}
              referrerPolicy="no-referrer"
              className="h-12 w-12 rounded-2xl object-cover border-2 border-blue-500/20 shadow-xs"
            />
            <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-blue-600 text-white">
              <ShieldCheck className="h-3 w-3" />
            </span>
          </div>

          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
              <span>{worker.name}</span>
              <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0" />
            </h3>

            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              {worker.title}
            </p>

            <div className="flex items-center space-x-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              <span className="flex items-center text-amber-500 font-bold">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 mr-1 inline" />
                {worker.rating} ({worker.completedJobs} reviews)
              </span>
              <span>•</span>
              <span className="flex items-center gap-0.5">
                <MapPin className="h-3 w-3 text-cyan-600 dark:text-cyan-400 inline" />
                {worker.location}
              </span>
            </div>
          </div>
        </div>

        {/* Description / Bio */}
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
          {worker.bio}
        </p>

        {/* Badges & Skills */}
        <div className="flex flex-wrap gap-1 mb-3">
          {worker.skills.slice(0, 3).map((skill, i) => (
            <span
              key={i}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Pricing & Booking Footer */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Starting Rate</div>
          <div className="text-base font-black text-slate-900 dark:text-white">
            ₹{worker.hourlyRate.toLocaleString()}
            <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400">/hr</span>
          </div>
        </div>

        <button
          id={`provider-card-book-${worker.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onSelectWorkerToHire(worker);
          }}
          className="flex items-center space-x-1 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
        >
          <span>Book / Hire Pro</span>
        </button>
      </div>
    </div>
  );
};
