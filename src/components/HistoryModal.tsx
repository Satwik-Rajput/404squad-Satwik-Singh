import React, { useState } from "react";
import {
  X,
  History,
  ShieldCheck,
  CheckCircle2,
  Clock,
  DollarSign,
  Receipt,
  Star,
  Download,
  Printer,
  Sparkles,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import { HireRecord } from "../types";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  hires: HireRecord[];
  onUpdateHireStatus: (
    hireId: string,
    newStatus: "payment_escrowed" | "in_progress" | "work_completed" | "released_and_finished",
    reviewData?: { rating: number; review: string }
  ) => void;
  onBrowsePros?: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  hires,
  onUpdateHireStatus,
  onBrowsePros,
}) => {
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [selectedInvoice, setSelectedInvoice] = useState<HireRecord | null>(null);
  const [reviewingHireId, setReviewingHireId] = useState<string | null>(null);
  const [starRating, setStarRating] = useState(5);
  const [reviewText, setReviewText] = useState("Outstanding work and prompt completion!");

  if (!isOpen) return null;

  const filteredHires = hires.filter((h) => {
    if (filter === "active") return h.completionStatus !== "released_and_finished";
    if (filter === "completed") return h.completionStatus === "released_and_finished";
    return true;
  });

  const getStatusStep = (status: HireRecord["completionStatus"]) => {
    switch (status) {
      case "payment_escrowed":
        return 1;
      case "in_progress":
        return 2;
      case "work_completed":
        return 3;
      case "released_and_finished":
        return 4;
      default:
        return 1;
    }
  };

  const handleReviewSubmit = (hireId: string) => {
    onUpdateHireStatus(hireId, "released_and_finished", {
      rating: starRating,
      review: reviewText,
    });
    setReviewingHireId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-blue-600/30 border border-blue-400/30 text-cyan-300">
              <History className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">Hire History & Escrow Status</h2>
              <p className="text-xs text-slate-300">
                Track job completion milestones, release payments & download GST invoices
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-slate-200 dark:bg-slate-800">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === "all"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
              }`}
            >
              All Hires ({hires.length})
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === "active"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
              }`}
            >
              Active Escrow ({hires.filter((h) => h.completionStatus !== "released_and_finished").length})
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === "completed"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
              }`}
            >
              Finished ({hires.filter((h) => h.completionStatus === "released_and_finished").length})
            </button>
          </div>

          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Escrow Protected Transactions
          </span>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {filteredHires.length === 0 ? (
            <div className="text-center py-14 px-4 text-slate-400 space-y-4 max-w-md mx-auto">
              <div className="h-16 w-16 mx-auto rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 shadow-inner">
                <History className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-extrabold text-slate-800 dark:text-slate-200">
                  No hires recorded yet
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Only professionals you actively select and successfully hire will appear in your history here.
                </p>
              </div>

              {onBrowsePros && (
                <button
                  onClick={() => {
                    onClose();
                    onBrowsePros();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer inline-flex items-center space-x-2"
                >
                  <UserCheck className="h-4 w-4" />
                  <span>Browse & Hire Professionals</span>
                </button>
              )}
            </div>
          ) : (
            filteredHires.map((hire) => {
              const currentStep = getStatusStep(hire.completionStatus);

              return (
                <div
                  key={hire.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4"
                >
                  {/* Top Bar: Ref ID & Price */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-700/60">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-mono font-extrabold border border-blue-200 dark:border-blue-800">
                        {hire.id}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Txn: {hire.transactionId} • {hire.paymentDate}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-400">Total Investment</span>
                      <div className="text-base font-black text-slate-900 dark:text-white">
                        ₹{hire.totalPrice.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Provider & Job Title */}
                  <div className="flex items-start space-x-3">
                    <img
                      src={hire.workerAvatar}
                      alt={hire.workerName}
                      className="h-12 w-12 rounded-2xl object-cover border-2 border-blue-500/20 shadow-xs shrink-0"
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {hire.jobTitle}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Service Provider: <strong className="text-blue-600 dark:text-blue-400">{hire.workerName}</strong> ({hire.workerTitle})
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Client: {hire.clientName} ({hire.location})
                      </p>
                    </div>
                  </div>

                  {/* Job Completion Status Tracker */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                        Job Completion Status
                      </span>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                          currentStep === 4
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        }`}
                      >
                        {currentStep === 1 && "Payment Escrowed"}
                        {currentStep === 2 && "Service In Progress"}
                        {currentStep === 3 && "Work Completed by Pro"}
                        {currentStep === 4 && "Released & Closed"}
                      </span>
                    </div>

                    {/* Milestone Step Progress Bar */}
                    <div className="grid grid-cols-4 gap-2 pt-1">
                      {[
                        { step: 1, label: "1. Escrow Funded" },
                        { step: 2, label: "2. In Progress" },
                        { step: 3, label: "3. Work Done" },
                        { step: 4, label: "4. Payment Released" },
                      ].map((item) => (
                        <div key={item.step} className="space-y-1">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              currentStep >= item.step
                                ? "bg-gradient-to-r from-blue-600 to-emerald-500"
                                : "bg-slate-200 dark:bg-slate-700"
                            }`}
                          />
                          <span className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                    <button
                      id={`invoice-btn-${hire.id}`}
                      onClick={() => setSelectedInvoice(hire)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      <Receipt className="h-3.5 w-3.5 text-blue-600" />
                      <span>View Tax Invoice</span>
                    </button>

                    <div className="flex items-center space-x-2">
                      {currentStep === 1 && (
                        <button
                          onClick={() => onUpdateHireStatus(hire.id, "in_progress")}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                        >
                          Mark Service Started
                        </button>
                      )}

                      {(currentStep === 1 || currentStep === 2) && (
                        <button
                          onClick={() => onUpdateHireStatus(hire.id, "work_completed")}
                          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                        >
                          Mark Work Completed
                        </button>
                      )}

                      {currentStep === 3 && (
                        <button
                          onClick={() => setReviewingHireId(hire.id)}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md transition-colors cursor-pointer flex items-center space-x-1"
                        >
                          <ShieldCheck className="h-3.5 w-3.5" />
                          <span>Release Escrow Payment to Pro</span>
                        </button>
                      )}

                      {currentStep === 4 && hire.userRating && (
                        <span className="flex items-center text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800">
                          <Star className="h-3.5 w-3.5 fill-amber-400 mr-1" />
                          Rated {hire.userRating}/5
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Inline Rating Review Form if releasing payment */}
                  {reviewingHireId === hire.id && (
                    <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 space-y-3">
                      <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                        Release Escrow & Rate {hire.workerName}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                          Rating:
                        </span>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setStarRating(star)}
                            className="cursor-pointer"
                          >
                            <Star
                              className={`h-5 w-5 ${
                                star <= starRating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>

                      <textarea
                        rows={2}
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Write a brief review of your experience..."
                        className="w-full px-3 py-2 rounded-xl border border-amber-300 dark:border-amber-800 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none"
                      />

                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setReviewingHireId(null)}
                          className="px-3 py-1 rounded-lg text-xs font-bold text-slate-600 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReviewSubmit(hire.id)}
                          className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs cursor-pointer shadow-xs"
                        >
                          Confirm & Release Funds
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Printable Tax Invoice Modal Popup */}
        {selectedInvoice && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
            <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 text-slate-900 shadow-2xl border border-slate-200 space-y-4">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Invoice Header */}
              <div className="border-b pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-blue-700">SkillBridge Tax Invoice</h3>
                  <p className="text-[10px] font-mono text-slate-500">
                    GSTIN: 27AAAAA0000A1Z5 • ISO 9001:2025 Certified
                  </p>
                </div>
                <div className="text-right font-mono text-xs text-slate-500">
                  <div>Inv #: {selectedInvoice.id}</div>
                  <div>Date: {selectedInvoice.paymentDate}</div>
                </div>
              </div>

              {/* Billed To / Pro Info */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded-2xl">
                <div>
                  <span className="font-bold text-slate-400 uppercase text-[10px]">Client (Billed To)</span>
                  <div className="font-bold text-slate-900">{selectedInvoice.clientName}</div>
                  <div className="text-slate-500">{selectedInvoice.clientPhone}</div>
                  <div className="text-slate-500">{selectedInvoice.location}</div>
                </div>

                <div>
                  <span className="font-bold text-slate-400 uppercase text-[10px]">Service Provider</span>
                  <div className="font-bold text-blue-700">{selectedInvoice.workerName}</div>
                  <div className="text-slate-500">{selectedInvoice.workerTitle}</div>
                  <div className="text-slate-500">Category: {selectedInvoice.category}</div>
                </div>
              </div>

              {/* Itemized Table */}
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b text-slate-400 uppercase text-[10px]">
                    <th className="py-2">Description</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2.5 font-semibold">
                      {selectedInvoice.jobTitle} ({selectedInvoice.durationLabel})
                    </td>
                    <td className="py-2.5 text-right font-bold">
                      ₹{selectedInvoice.subtotal.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-slate-500">IGST / CGST+SGST (18%)</td>
                    <td className="py-2.5 text-right font-bold text-slate-600">
                      ₹{selectedInvoice.gstAmount.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-emerald-600 font-bold">Escrow Protection Guarantee</td>
                    <td className="py-2.5 text-right font-bold text-emerald-600">₹0 (FREE)</td>
                  </tr>
                </tbody>
              </table>

              {/* Total & Payment Method */}
              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs font-bold">
                <div>
                  <span className="text-slate-500">Payment Method:</span>
                  <div className="text-blue-800">{selectedInvoice.paymentMethod}</div>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 text-[10px] uppercase block">Total Paid</span>
                  <span className="text-lg font-black text-blue-700">
                    ₹{selectedInvoice.totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Footer print action */}
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print Invoice</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
