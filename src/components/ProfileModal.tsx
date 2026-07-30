import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Phone,
  FileText,
  MapPin,
  Briefcase,
  BadgeCheck,
  Loader2,
  Award,
  Bell,
  Mail,
} from "lucide-react";
import { UserProfile } from "../types";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [name, setName] = useState(profile.name || "Aarav Sharma");
  const [headline, setHeadline] = useState(
    profile.headline || "Full-Stack Developer & UI/UX Specialist"
  );
  const [bio, setBio] = useState(
    profile.bio ||
      "Experienced freelancer based in Mumbai with 5+ years building web apps, mobile solutions, and assisting local clients with technical projects."
  );
  const [phone, setPhone] = useState(profile.phone || "+91 98765 43210");
  const [location, setLocation] = useState(profile.location || "Andheri West, Mumbai");
  const [isIdVerified, setIsIdVerified] = useState(profile.isIdVerified ?? false);
  const [emailNotifications, setEmailNotifications] = useState(
    profile.emailNotifications ?? true
  );

  const [verifyingId, setVerifyingId] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  if (!isOpen) return null;

  // Simulate Instant Digital Aadhaar / Govt ID Verification
  const handleVerifyId = () => {
    setVerifyingId(true);
    setTimeout(() => {
      setVerifyingId(false);
      setIsIdVerified(true);
      setVerificationSuccess(true);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...profile,
      name,
      headline,
      bio,
      phone,
      location,
      isIdVerified,
      emailNotifications,
    });
    onClose();
  };

  // Compute profile score
  let score = 0;
  if (name && location) score += 25;
  if (bio && bio.trim().length > 10) score += 25;
  if (phone && phone.trim().length >= 10) score += 25;
  if (isIdVerified) score += 25;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-extrabold text-slate-900">
                  Complete Your Profile
                </h2>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  {score}% Score
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Enhance trust, earn the Verified Identity badge, and get more hires
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Aadhaar / Identity Verification Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-purple-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-purple-600 text-white shadow-xs">
                  <BadgeCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Aadhaar / Government ID Verification
                  </h4>
                  <p className="text-xs text-slate-600">
                    Verified profiles get 4x higher trust rating on Skill Bridge
                  </p>
                </div>
              </div>
              {isIdVerified ? (
                <div className="flex items-center space-x-1 text-emerald-600 text-xs font-extrabold bg-emerald-100/90 px-3 py-1 rounded-full border border-emerald-300 shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Verified Identity</span>
                </div>
              ) : (
                <button
                  id="verify-aadhaar-btn"
                  type="button"
                  onClick={handleVerifyId}
                  disabled={verifyingId}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer shrink-0 disabled:opacity-60"
                >
                  {verifyingId ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5 text-purple-200" />
                      <span>Verify Now (+25%)</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {verificationSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center space-x-2">
                <Award className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  Identity verified successfully! The "Verified Identity" badge is now added to your profile.
                </span>
              </div>
            )}
          </div>

          {/* Full Name & Headline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Professional Headline
              </label>
              <input
                type="text"
                placeholder="e.g. Certified Electrician or React Developer"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Phone Number & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Phone Number (WhatsApp)
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Primary Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Andheri West, Mumbai"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Bio & Experience Summary */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Professional Bio & Summary
              </label>
              <span className="text-[11px] font-semibold text-blue-600">
                Increases response rate by 3x
              </span>
            </div>
            <textarea
              rows={3}
              placeholder="Introduce yourself, your key skills, availability, and past project experience..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>

          {/* Email Notifications Toggle Settings */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-blue-100/80 text-blue-600 shrink-0">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Email Notifications
                </h4>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Receive email alerts for job updates, applications, & AI match recommendations
                </p>
              </div>
            </div>

            <button
              id="email-notifications-toggle"
              type="button"
              role="switch"
              aria-checked={emailNotifications}
              onClick={() => setEmailNotifications(!emailNotifications)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                emailNotifications ? "bg-blue-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  emailNotifications ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="save-profile-btn"
              type="submit"
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Save & Update Trust Score</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
