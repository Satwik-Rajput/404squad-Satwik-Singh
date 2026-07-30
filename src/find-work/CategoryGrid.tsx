import React from "react";
import {
  Home,
  Scale,
  GraduationCap,
  Laptop,
  Palette,
  HeartPulse,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { CategoryType } from "../types";

interface CategoryGridProps {
  activeCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
}

interface CategoryCardItem {
  id: Exclude<CategoryType, "All">;
  title: string;
  icon: React.ReactNode;
  tagline: string;
  image: string;
  workerCount: number;
  popularTasks: string[];
}

const CATEGORY_CARDS: CategoryCardItem[] = [
  {
    id: "Home Services",
    title: "Home Services",
    icon: <Home className="h-5 w-5 text-blue-600" />,
    tagline: "Electricians, Plumbers & Repairs",
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=500",
    workerCount: 320,
    popularTasks: ["Electrical Wiring", "EV Charger", "Plumbing", "HVAC"],
  },
  {
    id: "Legal",
    title: "Legal Advice",
    icon: <Scale className="h-5 w-5 text-purple-600" />,
    tagline: "Corporate Lawyers & Contracts",
    image:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=500",
    workerCount: 145,
    popularTasks: ["Contract Review", "Trademarks", "NDAs", "SaaS Legal"],
  },
  {
    id: "Education",
    title: "Education & Tutors",
    icon: <GraduationCap className="h-5 w-5 text-emerald-600" />,
    tagline: "1-on-1 Tutors & STEM Coaches",
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=500",
    workerCount: 280,
    popularTasks: ["Math Tutors", "Physics", "Coding Prep", "Languages"],
  },
  {
    id: "Tech",
    title: "Tech & IT Help",
    icon: <Laptop className="h-5 w-5 text-cyan-600" />,
    tagline: "Web Developers & AI Engineers",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=500",
    workerCount: 510,
    popularTasks: ["React & Web", "AI Chatbots", "Python", "Mobile Apps"],
  },
  {
    id: "Creative",
    title: "Creative & Design",
    icon: <Palette className="h-5 w-5 text-amber-600" />,
    tagline: "UI/UX Designers & Animators",
    image:
      "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&q=80&w=500",
    workerCount: 240,
    popularTasks: ["Figma UI", "Logo Branding", "Video Editing", "3D Art"],
  },
  {
    id: "Wellness",
    title: "Wellness & Fitness",
    icon: <HeartPulse className="h-5 w-5 text-rose-600" />,
    tagline: "Yoga Coaches & Ergonomics",
    image:
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=500",
    workerCount: 190,
    popularTasks: ["Personal Trainer", "Yoga Coach", "Nutrition", "Posture"],
  },
];

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const handleCardClick = (cat: CategoryType) => {
    onSelectCategory(cat);
    const target = document.getElementById("local-pros-section");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="category-grid-section" className="space-y-4 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Urban & Local On-Demand Services
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Explore Service Categories
          </h2>
        </div>

        {activeCategory !== "All" && (
          <button
            onClick={() => handleCardClick("All")}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            Show All Categories
          </button>
        )}
      </div>

      {/* Urban Company Style Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {CATEGORY_CARDS.map((card) => {
          const isSelected = activeCategory === card.id;

          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer ${
                isSelected
                  ? "ring-2 ring-blue-600 border-blue-600 shadow-lg scale-[1.01]"
                  : "bg-white dark:bg-slate-800 border-slate-200/90 dark:border-slate-700/80 shadow-xs hover:shadow-md hover:-translate-y-1"
              }`}
            >
              {/* Image Banner Container */}
              <div className="relative h-40 w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                <img
                  src={card.image}
                  alt={card.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

                {/* Worker Count Badge */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs text-[11px] font-bold text-slate-800 dark:text-slate-200 shadow-sm flex items-center space-x-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{card.workerCount}+ Pros Nearby</span>
                </div>

                {/* Title & Icon Overlay */}
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs shadow-xs">
                      {card.icon}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base leading-tight">
                        {card.title}
                      </h3>
                      <p className="text-[11px] text-slate-200 line-clamp-1">
                        {card.tagline}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Tasks */}
              <div className="p-3.5 bg-white dark:bg-slate-800 flex items-center justify-between text-xs">
                <div className="flex flex-wrap gap-1">
                  {card.popularTasks.slice(0, 3).map((task) => (
                    <span
                      key={task}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300"
                    >
                      {task}
                    </span>
                  ))}
                </div>

                <span className="text-blue-600 dark:text-blue-400 font-bold group-hover:translate-x-1 transition-transform flex items-center">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
