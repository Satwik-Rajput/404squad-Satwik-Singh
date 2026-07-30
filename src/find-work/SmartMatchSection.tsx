import React, { useState } from "react";
import {
  Sparkles,
  CheckCircle,
  Shield,
  Award,
  Star,
  ArrowRight,
  Scale,
  CheckSquare,
  Square,
  Check,
} from "lucide-react";
import { Worker, SmartMatchResult } from "../types";
import { WorkerCompareModal, CompareWorkerItem } from "./WorkerCompareModal";

interface SmartMatchSectionProps {
  jobTitle: string;
  category: string;
  matches: SmartMatchResult[];
  allWorkers: Worker[];
  onSelectWorkerToHire: (worker: Worker) => void;
  isLoading?: boolean;
}

export const SmartMatchSection: React.FC<SmartMatchSectionProps> = ({
  jobTitle,
  category,
  matches,
  allWorkers,
  onSelectWorkerToHire,
  isLoading,
}) => {
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800/80 dark:to-blue-950/40 border border-blue-200/80 dark:border-blue-800/50 my-6 animate-pulse">
        <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-semibold mb-3">
          <Sparkles className="h-5 w-5 animate-spin" />
          <span>Skill Bridge Smart Match AI is analyzing top workers...</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-white/60 dark:bg-slate-800/60 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!matches || matches.length === 0) {
    return null;
  }

  // Get full list of available items with worker + match
  const items: CompareWorkerItem[] = matches
    .map((match, index) => {
      const worker =
        allWorkers.find((w) => w.id === match.workerId) ||
        allWorkers[index % allWorkers.length];
      if (!worker) return null;
      return { worker, match };
    })
    .filter((x): x is CompareWorkerItem => x !== null);

  const toggleSelectForCompare = (workerId: string) => {
    if (selectedCompareIds.includes(workerId)) {
      setSelectedCompareIds(selectedCompareIds.filter((id) => id !== workerId));
    } else {
      if (selectedCompareIds.length >= 2) {
        // Keep the latest 2
        setSelectedCompareIds([selectedCompareIds[1], workerId]);
      } else {
        setSelectedCompareIds([...selectedCompareIds, workerId]);
      }
    }
  };

  // Get items to compare
  let compareItem1: CompareWorkerItem | null = null;
  let compareItem2: CompareWorkerItem | null = null;

  if (selectedCompareIds.length >= 2) {
    compareItem1 = items.find((i) => i.worker.id === selectedCompareIds[0]) || items[0] || null;
    compareItem2 = items.find((i) => i.worker.id === selectedCompareIds[1]) || items[1] || null;
  } else if (items.length >= 2) {
    // Default top 2 if user clicks compare button without specific selection
    compareItem1 = items[0];
    compareItem2 = items[1];
  }

  const handleOpenCompare = () => {
    if (items.length < 2) return;
    if (selectedCompareIds.length < 2) {
      // Auto select top 2
      const topTwo = items.slice(0, 2).map((i) => i.worker.id);
      setSelectedCompareIds(topTwo);
    }
    setIsCompareModalOpen(true);
  };

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50/90 via-indigo-50/50 to-slate-50 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-900 border border-blue-200/80 dark:border-blue-800/60 shadow-sm my-6">
      {/* Header with Compare Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-blue-600 text-white shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              Smart Match AI Recommendations
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                AI Powered
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Top 3 verified experts recommended specifically for "{jobTitle}"
            </p>
          </div>
        </div>

        {/* Compare Button */}
        {items.length >= 2 && (
          <button
            id="smart-match-compare-btn"
            onClick={handleOpenCompare}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer shrink-0"
          >
            <Scale className="h-4 w-4" />
            <span>
              {selectedCompareIds.length === 2
                ? "Compare 2 Selected Pros"
                : "Compare Candidates"}
            </span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map(({ worker, match }) => {
          const isSelectedForCompare = selectedCompareIds.includes(worker.id);

          return (
            <div
              key={worker.id}
              className={`relative p-4 rounded-xl bg-white dark:bg-slate-800/90 border shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group ${
                isSelectedForCompare
                  ? "border-indigo-500 ring-2 ring-indigo-500/20"
                  : "border-slate-200 dark:border-slate-700/80"
              }`}
            >
              {/* Match Percentage Badge */}
              <div className="absolute top-3 right-3 flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                <span>{match.matchPercentage}% Match</span>
              </div>

              <div>
                {/* Worker Avatar & Name */}
                <div className="flex items-start space-x-3 mb-3 pr-16">
                  <img
                    src={worker.avatar}
                    alt={worker.name}
                    referrerPolicy="no-referrer"
                    className="h-12 w-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {worker.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {worker.title}
                    </p>
                    <div className="flex items-center space-x-1 mt-1 text-xs text-amber-500 font-semibold">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>{worker.rating}</span>
                      <span className="text-slate-400 font-normal">
                        ({worker.completedJobs} jobs)
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI Reason */}
                <div className="p-2.5 rounded-lg bg-blue-50/60 dark:bg-blue-950/40 text-xs text-slate-700 dark:text-slate-300 border border-blue-100 dark:border-blue-900/50 mb-3">
                  <span className="font-semibold text-blue-700 dark:text-blue-300 block mb-0.5">
                    Why matched:
                  </span>
                  {match.reason}
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {worker.badges.map((badge) => (
                    <span
                      key={badge}
                      className="inline-flex items-center space-x-1 text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300"
                    >
                      {badge === "Verified Identity" && (
                        <CheckCircle className="h-2.5 w-2.5 text-blue-500" />
                      )}
                      {badge === "Top Rated" && (
                        <Award className="h-2.5 w-2.5 text-amber-500" />
                      )}
                      {badge === "Background Checked" && (
                        <Shield className="h-2.5 w-2.5 text-emerald-500" />
                      )}
                      <span>{badge}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center space-x-2">
                {/* Checkbox / Compare Select Toggle */}
                <button
                  id={`compare-toggle-${worker.id}`}
                  onClick={() => toggleSelectForCompare(worker.id)}
                  className={`flex items-center justify-center space-x-1 px-2.5 py-2 rounded-lg border text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                    isSelectedForCompare
                      ? "bg-indigo-50 dark:bg-indigo-950 border-indigo-400 text-indigo-700 dark:text-indigo-300"
                      : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                  }`}
                  title="Select for side-by-side comparison"
                >
                  {isSelectedForCompare ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-indigo-600" />
                      <span className="hidden sm:inline">Comparing</span>
                    </>
                  ) : (
                    <>
                      <Scale className="h-3.5 w-3.5 text-slate-400" />
                      <span>Compare</span>
                    </>
                  )}
                </button>

                {/* Hire Worker Button */}
                <button
                  id={`smart-match-hire-${worker.id}`}
                  onClick={() => onSelectWorkerToHire(worker)}
                  className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors cursor-pointer"
                >
                  <span>Hire {worker.name.split(" ")[0]}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Worker Compare Modal */}
      <WorkerCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        item1={compareItem1}
        item2={compareItem2}
        onSelectWorkerToHire={onSelectWorkerToHire}
      />
    </div>
  );
};
