import React from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Circle,
  ArrowRight,
  UserCheck,
  AlertCircle,
  Sparkles,
  PhoneCall,
  FileText,
  BadgeCheck,
} from "lucide-react";
import { UserProfile } from "../types";

interface ProfileCompletionWidgetProps {
  profile: UserProfile;
  onOpenProfileModal: () => void;
}

export const ProfileCompletionWidget: React.FC<ProfileCompletionWidgetProps> = ({
  profile,
  onOpenProfileModal,
}) => {
  // Calculate completion percentage
  let completedCount = 0;
  const totalTasks = 4;

  const hasBasicInfo = Boolean(profile.name && profile.location);
  if (hasBasicInfo) completedCount++;

  const hasBio = Boolean(profile.bio && profile.bio.trim().length > 10);
  if (hasBio) completedCount++;

  const hasPhone = Boolean(profile.phone && profile.phone.trim().length >= 10);
  if (hasPhone) completedCount++;

  const isVerified = Boolean(profile.isIdVerified);
  if (isVerified) completedCount++;

  const percentage = Math.round((completedCount / totalTasks) * 100);

  // Trust status label
  let trustBadgeLabel = "Basic Account";
  let trustBadgeColor = "bg-amber-100 text-amber-800 border-amber-300";
  if (percentage === 100) {
    trustBadgeLabel = "100% Verified Pro";
    trustBadgeColor = "bg-emerald-100 text-emerald-800 border-emerald-300";
  } else if (percentage >= 50) {
    trustBadgeLabel = "Intermediate Trust";
    trustBadgeColor = "bg-blue-100 text-blue-800 border-blue-300";
  }

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5 relative overflow-hidden">
      {/* Top Banner Accent */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 shrink-0">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-slate-900 leading-tight">
                Profile Completion & Trust Meter
              </h3>
              <span
                className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${trustBadgeColor}`}
              >
                {trustBadgeLabel}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Complete your profile to unlock 3x higher response rates from clients & workers
            </p>
          </div>
        </div>

        {/* Progress Circle / Pill */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="text-right">
            <span className="text-2xl font-black text-slate-900">{percentage}%</span>
            <span className="text-xs font-bold text-slate-400 block">Complete</span>
          </div>
          <button
            id="open-profile-modal-btn"
            onClick={onOpenProfileModal}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            <span>{percentage === 100 ? "Edit Profile" : "Complete Profile"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              percentage === 100
                ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Trust Completion Checklist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
        {/* Item 1: Account Setup */}
        <div
          onClick={onOpenProfileModal}
          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
            hasBasicInfo
              ? "bg-slate-50/80 border-slate-200"
              : "bg-amber-50/50 border-amber-200"
          }`}
        >
          <div className="flex items-center space-x-2">
            {hasBasicInfo ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : (
              <Circle className="h-4 w-4 text-slate-300 shrink-0" />
            )}
            <span className="text-xs font-bold text-slate-800 truncate">
              Name & Location
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
            {profile.location || "Location pending"}
          </p>
        </div>

        {/* Item 2: Bio & Experience */}
        <div
          onClick={onOpenProfileModal}
          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
            hasBio
              ? "bg-slate-50/80 border-slate-200"
              : "bg-blue-50/60 border-blue-200 hover:border-blue-400"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {hasBio ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              ) : (
                <Circle className="h-4 w-4 text-blue-500 shrink-0 animate-pulse" />
              )}
              <span className="text-xs font-bold text-slate-800">
                Bio & Experience
              </span>
            </div>
            {!hasBio && (
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-700">
                +25%
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
            {hasBio ? profile.bio : "Add bio to build client trust"}
          </p>
        </div>

        {/* Item 3: Phone Number */}
        <div
          onClick={onOpenProfileModal}
          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
            hasPhone
              ? "bg-slate-50/80 border-slate-200"
              : "bg-blue-50/60 border-blue-200 hover:border-blue-400"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {hasPhone ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              ) : (
                <Circle className="h-4 w-4 text-blue-500 shrink-0 animate-pulse" />
              )}
              <span className="text-xs font-bold text-slate-800">
                Phone Number
              </span>
            </div>
            {!hasPhone && (
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-700">
                +25%
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
            {hasPhone ? profile.phone : "Enables SMS/WhatsApp updates"}
          </p>
        </div>

        {/* Item 4: Govt ID / Aadhaar */}
        <div
          onClick={onOpenProfileModal}
          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
            isVerified
              ? "bg-emerald-50/80 border-emerald-200"
              : "bg-purple-50/60 border-purple-200 hover:border-purple-400"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isVerified ? (
                <BadgeCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              ) : (
                <Circle className="h-4 w-4 text-purple-600 shrink-0 animate-pulse" />
              )}
              <span className="text-xs font-bold text-slate-800">
                Govt ID / Aadhaar
              </span>
            </div>
            {!isVerified && (
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-700">
                +25%
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
            {isVerified ? "Verified Identity Badge Active" : "Verify ID for Trust Badge"}
          </p>
        </div>
      </div>
    </div>
  );
};
