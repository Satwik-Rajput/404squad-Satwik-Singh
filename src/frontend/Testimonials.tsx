import React from "react";
import { Star, Quote, CheckCircle2 } from "lucide-react";
import { TESTIMONIALS } from "../data/seedData";

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-12 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
            Trusted Worldwide
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
            What Clients & Freelancers Say
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            See how Skill Bridge powers real-time talent matching and seamless dynamic hires.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Rating Stars */}
                <div className="flex items-center space-x-1 text-amber-400 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>

                {/* Quote Content */}
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-6 italic">
                  "{t.content}"
                </p>
              </div>

              {/* Author Profile */}
              <div className="flex items-center space-x-3 pt-4 border-t border-slate-100 dark:border-slate-700/60">
                <img
                  src={t.avatar}
                  alt={t.name}
                  referrerPolicy="no-referrer"
                  className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1">
                    {t.name}
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
