import React, { useState, useRef, useEffect } from "react";
import { Search, X, Plus, Sparkles, Filter } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onPostJobClick?: () => void;
  resultCount?: number;
}

const POPULAR_SEARCHES = [
  "Electrician",
  "React Engineer",
  "Legal Advisor",
  "Math Tutor",
  "Figma Designer",
  "Plumber",
];

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onPostJobClick,
  resultCount,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClear = () => {
    onSearchChange("");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    scrollToResults();
  };

  const handleSuggestionClick = (term: string) => {
    onSearchChange(term);
    scrollToResults();
  };

  const scrollToResults = () => {
    const el =
      document.getElementById("local-pros-section") ||
      document.getElementById("tab-toggle-providers");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearchSubmit} className="relative">
        <div
          className={`relative flex items-center p-1.5 rounded-2xl bg-white/10 dark:bg-slate-800/80 backdrop-blur-md border transition-all shadow-xl ${
            isFocused
              ? "border-cyan-400 ring-2 ring-cyan-400/30 bg-white/15 dark:bg-slate-800"
              : "border-white/20 hover:border-white/40"
          }`}
        >
          <Search className="h-5 w-5 text-cyan-300 ml-3.5 shrink-0" />

          <input
            type="text"
            placeholder="Search local jobs, workers, skills or services near you..."
            value={searchQuery}
            onFocus={() => setIsFocused(true)}
            onChange={(e) => {
              onSearchChange(e.target.value);
            }}
            className="w-full px-3 py-2 bg-transparent text-white placeholder-slate-300 text-sm outline-none font-medium"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 rounded-full hover:bg-white/20 text-slate-300 hover:text-white transition-colors mr-1 cursor-pointer"
              title="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <button
            type="submit"
            className="hidden sm:flex items-center space-x-1 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs transition-all shadow-md shadow-cyan-500/20 cursor-pointer shrink-0"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search</span>
          </button>

          {onPostJobClick && (
            <button
              type="button"
              onClick={onPostJobClick}
              className="hidden md:flex items-center space-x-1 ml-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer shrink-0 border border-white/20"
            >
              <Plus className="h-4 w-4 text-cyan-300" />
              <span>Post Job</span>
            </button>
          )}
        </div>
      </form>

      {/* Auto-suggestions & Quick Tags Dropdown when focused */}
      {isFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-2xl backdrop-blur-xl z-50 text-left space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1 text-cyan-400">
              <Sparkles className="h-3.5 w-3.5" /> Popular Searches
            </span>
            {resultCount !== undefined && searchQuery && (
              <span className="text-slate-300 font-medium">
                {resultCount} match{resultCount !== 1 ? "es" : ""} found
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => handleSuggestionClick(term)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  searchQuery.toLowerCase() === term.toLowerCase()
                    ? "bg-cyan-500 text-slate-950 font-bold"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                }`}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
