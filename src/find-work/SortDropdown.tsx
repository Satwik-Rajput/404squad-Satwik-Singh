import React, { useState, useRef, useEffect } from "react";
import { ArrowUpDown, Check, ChevronDown } from "lucide-react";

export type SortOption = "default" | "price_asc" | "price_desc" | "rating_desc";

interface SortDropdownProps {
  sortBy: SortOption;
  onChangeSort: (option: SortOption) => void;
  className?: string;
  label?: string;
}

export const SORT_LABELS: Record<SortOption, string> = {
  default: "Featured",
  price_asc: "Price: Low to High",
  price_desc: "Price: High to Low",
  rating_desc: "Highest Rated",
};

export const SortDropdown: React.FC<SortDropdownProps> = ({
  sortBy,
  onChangeSort,
  className = "",
  label = "Sort by",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options: { id: SortOption; label: string; desc: string }[] = [
    { id: "default", label: "Featured", desc: "Recommended listings" },
    { id: "price_asc", label: "Price: Low to High", desc: "Cheapest hourly/budget first" },
    { id: "price_desc", label: "Price: High to Low", desc: "Highest hourly/budget first" },
    { id: "rating_desc", label: "Highest Rated", desc: "Top rated pros/jobs first" },
  ];

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <div className="flex items-center space-x-2">
        {label && (
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
            {label}:
          </span>
        )}
        <button
          type="button"
          id="sort-dropdown-trigger"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span>{SORT_LABELS[sortBy]}</span>
          </div>
          <ChevronDown
            className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-blue-600 dark:text-blue-400" : ""
            }`}
          />
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-700/60 mb-1">
            Sort Options
          </div>
          {options.map((opt) => {
            const isSelected = sortBy === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  onChangeSort(opt.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold"
                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60"
                }`}
              >
                <div className="space-y-0.5">
                  <div className="font-bold">{opt.label}</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                    {opt.desc}
                  </div>
                </div>
                {isSelected && (
                  <Check className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
