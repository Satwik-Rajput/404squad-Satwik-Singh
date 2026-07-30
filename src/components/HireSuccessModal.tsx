import React from "react";
import { CheckCircle, Calendar, Clock, DollarSign, X } from "lucide-react";
import { Job, Worker } from "../types";

interface HireSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  hireInfo: {
    job: Job;
    worker: Worker;
    durationLabel: string;
    totalPrice: number;
  } | null;
}

export const HireSuccessModal: React.FC<HireSuccessModalProps> = ({
  isOpen,
  onClose,
  hireInfo,
}) => {
  if (!isOpen || !hireInfo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 text-center space-y-4">
        {/* Success Icon */}
        <div className="mx-auto h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
          <CheckCircle className="h-10 w-10" />
        </div>

        <h3 className="text-xl font-black text-slate-900 dark:text-white">
          Contract Confirmed!
        </h3>

        <p className="text-xs text-slate-600 dark:text-slate-300">
          You have successfully hired{" "}
          <strong className="text-blue-600 dark:text-blue-400">
            {hireInfo.worker.name}
          </strong>{" "}
          for "{hireInfo.job.title}".
        </p>

        {/* Breakdown Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2">
          <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
            <span>Engagement Term:</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {hireInfo.durationLabel}
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
            <span>Base Rate:</span>
            <span className="font-bold text-slate-900 dark:text-white">
              ₹{hireInfo.job.budget.toLocaleString()} / {hireInfo.job.budgetUnit}
            </span>
          </div>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center font-bold text-slate-900 dark:text-white text-sm">
            <span>Total Agreed Investment:</span>
            <span className="text-emerald-600 dark:text-emerald-400 text-base">
              ₹{hireInfo.totalPrice.toLocaleString()}
            </span>
          </div>
        </div>

        <button
          id="close-hire-success-btn"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
};
