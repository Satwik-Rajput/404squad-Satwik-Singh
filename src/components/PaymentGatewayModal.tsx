import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  Lock,
  CreditCard,
  QrCode,
  Building2,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Receipt,
  Smartphone,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Job, Worker, HireRecord } from "../types";

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job;
  worker: Worker;
  durationLabel: string;
  totalPrice: number;
  onPaymentSuccess: (hireRecord: HireRecord) => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  job,
  worker,
  durationLabel,
  totalPrice,
  onPaymentSuccess,
}) => {
  const [paymentTab, setPaymentTab] = useState<"upi" | "card" | "netbanking">("upi");

  // UPI Form state
  const [upiId, setUpiId] = useState("user@okaxis");
  const [upiMethod, setUpiMethod] = useState<"id" | "qr">("id");

  // Card Form state
  const [cardNumber, setCardNumber] = useState("4532 8912 3456 7890");
  const [cardExpiry, setCardExpiry] = useState("08/28");
  const [cardCvv, setCardCvv] = useState("892");
  const [cardName, setCardName] = useState("Ananya Sharma");

  // Netbanking State
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");

  // Processing & OTP state
  const [step, setStep] = useState<"method" | "otp" | "success">("method");
  const [otpCode, setOtpCode] = useState("7492");
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdRecord, setCreatedRecord] = useState<HireRecord | null>(null);

  if (!isOpen) return null;

  const subtotal = Math.round(totalPrice / 1.18);
  const gstAmount = totalPrice - subtotal;

  const resetGatewayState = () => {
    setStep("method");
    setIsProcessing(false);
    setCreatedRecord(null);
  };

  const handleCloseGateway = () => {
    if (step === "success" && createdRecord) {
      onPaymentSuccess(createdRecord);
    }
    resetGatewayState();
    onClose();
  };

  // Process payment initialization
  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setStep("otp");
    }, 1000);
  };

  // Process OTP verification & confirm transaction
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const txId = `TXN_SB${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      const newRecord: HireRecord = {
        id: `HIRE-${Math.floor(10000 + Math.random() * 90000)}`,
        transactionId: txId,
        jobTitle: job.title,
        category: job.category,
        workerName: worker.name,
        workerAvatar: worker.avatar,
        workerTitle: worker.title,
        workerId: worker.id,
        clientName: "Ananya Sharma",
        clientPhone: "+91 98765 43210",
        clientEmail: "ananya.sharma@example.com",
        location: job.location,
        durationLabel,
        subtotal,
        gstAmount,
        totalPrice,
        paymentMethod:
          paymentTab === "upi"
            ? `UPI (${upiId})`
            : paymentTab === "card"
            ? `Card (ending ${cardNumber.slice(-4)})`
            : `NetBanking (${selectedBank})`,
        paymentDate: new Date().toLocaleString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        completionStatus: "payment_escrowed",
      };

      setCreatedRecord(newRecord);
      setIsProcessing(false);
      setStep("success");
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        {/* Gateway Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
              <Lock className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5 text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>SkillBridge Escrow Gateway (100% Secure)</span>
              </div>
              <h2 className="text-base font-extrabold">Complete Booking Payment</h2>
            </div>
          </div>

          <button
            onClick={handleCloseGateway}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Escrow Banner Notice */}
        <div className="px-5 py-2.5 bg-emerald-50 dark:bg-emerald-950/60 border-b border-emerald-200 dark:border-emerald-800/80 flex items-center space-x-2 text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
          <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            Payment is held safely in Escrow until you inspect and mark the service completed.
          </span>
        </div>

        {step === "method" && (
          <div className="p-6 space-y-5">
            {/* Order Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {job.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Pro: <strong className="text-blue-600 dark:text-blue-400">{worker.name}</strong> ({durationLabel})
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400 uppercase">Total Amount</span>
                  <div className="text-lg font-black text-slate-900 dark:text-white">
                    ₹{totalPrice.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700/80 text-[11px] text-slate-500 dark:text-slate-400 flex justify-between">
                <span>Base Service Charges: ₹{subtotal.toLocaleString()}</span>
                <span>GST (18%): ₹{gstAmount.toLocaleString()}</span>
                <span className="text-emerald-600 font-bold">Escrow Fee: FREE</span>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Select Payment Method
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentTab("upi")}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentTab === "upi"
                      ? "bg-blue-50 dark:bg-blue-950/80 border-blue-600 text-blue-700 dark:text-blue-300 shadow-xs"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <Smartphone className="h-5 w-5 text-blue-600" />
                  <span>UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentTab("card")}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentTab === "card"
                      ? "bg-blue-50 dark:bg-blue-950/80 border-blue-600 text-blue-700 dark:text-blue-300 shadow-xs"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <CreditCard className="h-5 w-5 text-purple-600" />
                  <span>Debit / Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentTab("netbanking")}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentTab === "netbanking"
                      ? "bg-blue-50 dark:bg-blue-950/80 border-blue-600 text-blue-700 dark:text-blue-300 shadow-xs"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <Building2 className="h-5 w-5 text-indigo-600" />
                  <span>Net Banking</span>
                </button>
              </div>
            </div>

            {/* Payment Method Details Form */}
            <form onSubmit={handleInitiatePayment} className="space-y-4 pt-1">
              {paymentTab === "upi" && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-xs font-semibold">
                    <label className="flex items-center space-x-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={upiMethod === "id"}
                        onChange={() => setUpiMethod("id")}
                        className="accent-blue-600"
                      />
                      <span>UPI ID / VPA</span>
                    </label>
                    <label className="flex items-center space-x-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={upiMethod === "qr"}
                        onChange={() => setUpiMethod("qr")}
                        className="accent-blue-600"
                      />
                      <span>Scan QR Code</span>
                    </label>
                  </div>

                  {upiMethod === "id" ? (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Enter UPI VPA (Google Pay / PhonePe / Paytm / BHIM)
                      </label>
                      <input
                        type="text"
                        required
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="e.g. mobile@upi or username@okicici"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                      />
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-center space-y-2">
                      <QrCode className="h-28 w-28 mx-auto text-slate-800 dark:text-slate-100 bg-white p-2 rounded-xl shadow-inner" />
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Scan with any UPI App (GPay, PhonePe, Paytm)
                      </p>
                      <div className="text-[11px] text-amber-600 font-semibold animate-pulse">
                        Auto-detecting payment stream...
                      </div>
                    </div>
                  )}
                </div>
              )}

              {paymentTab === "card" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4532 0000 0000 0000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="08/28"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        maxLength={3}
                        required
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="123"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Ananya Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              )}

              {paymentTab === "netbanking" && (
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Select Popular Indian Bank
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank", "Kotak Bank", "Punjab National Bank"].map(
                      (bank) => (
                        <button
                          key={bank}
                          type="button"
                          onClick={() => setSelectedBank(bank)}
                          className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                            selectedBank === bank
                              ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                              : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {bank}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              <button
                id="pay-gateway-submit-btn"
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-black shadow-lg shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-60 mt-4"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Connecting to Bank Gateway...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 text-emerald-300" />
                    <span>Pay ₹{totalPrice.toLocaleString()} via SkillBridge Escrow</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* OTP Verification Step */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="p-6 space-y-5 text-center">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner">
              <Smartphone className="h-8 w-8" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Authorize Payment OTP / PIN
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter the 4-digit security code sent to your registered mobile number for ₹
                {totalPrice.toLocaleString()}.
              </p>
            </div>

            <div className="max-w-xs mx-auto">
              <input
                type="text"
                maxLength={4}
                required
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full text-center tracking-widest text-2xl font-black px-4 py-3 rounded-2xl border-2 border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/20"
              />
              <p className="text-[11px] text-slate-400 mt-2">
                Simulated Demo OTP: <strong className="text-blue-600">7492</strong>
              </p>
            </div>

            <button
              id="confirm-otp-submit-btn"
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Verifying Escrow Authorisation...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Authorize Escrow Lock (₹{totalPrice.toLocaleString()})</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Payment Success Confirmation Screen */}
        {step === "success" && createdRecord && (
          <div className="p-6 text-center space-y-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-lg">
              <CheckCircle2 className="h-10 w-10 animate-bounce" />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Payment Escrowed Successfully!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Transaction ID: <strong className="font-mono text-blue-600">{createdRecord.transactionId}</strong>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Hired Professional:</span>
                <strong className="text-slate-900 dark:text-white">{createdRecord.workerName}</strong>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Service Job:</span>
                <span className="font-bold text-slate-900 dark:text-white truncate max-w-[180px]">
                  {createdRecord.jobTitle}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Escrow Locked Amount:</span>
                <strong className="text-emerald-600 dark:text-emerald-400">
                  ₹{createdRecord.totalPrice.toLocaleString()}
                </strong>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Status:</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                  Funds Held in Escrow
                </span>
              </div>
            </div>

            <button
              id="payment-success-close-btn"
              onClick={handleCloseGateway}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-extrabold text-sm shadow-md transition-colors cursor-pointer flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="h-5 w-5 text-emerald-300" />
              <span>Go to My Hires & History</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
