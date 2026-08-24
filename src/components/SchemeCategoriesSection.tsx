import React from 'react';
import { 
  Sprout, 
  HeartPulse, 
  GraduationCap, 
  Home, 
  HeartHandshake, 
  Zap, 
  Briefcase, 
  UserCheck, 
  ArrowRight 
} from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  countLabel: string;
  filterCategory: string; // value used for filtering schemes
  icon: React.ReactNode;
  badgeBg: string;
  badgeColor: string;
  countColor: string;
}

interface SchemeCategoriesSectionProps {
  onSelectCategory?: (category: string) => void;
  onViewAll?: () => void;
}

export const SchemeCategoriesSection: React.FC<SchemeCategoriesSectionProps> = ({
  onSelectCategory,
  onViewAll
}) => {
  const categories: CategoryItem[] = [
    {
      id: 'agriculture',
      name: 'Agriculture',
      countLabel: '142 schemes',
      filterCategory: 'Agriculture',
      icon: <Sprout className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />,
      badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60',
      badgeColor: 'text-emerald-600',
      countColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      id: 'health',
      name: 'Health',
      countLabel: '89 schemes',
      filterCategory: 'Healthcare',
      icon: <HeartPulse className="w-8 h-8 text-rose-500 dark:text-rose-400" />,
      badgeBg: 'bg-rose-50 dark:bg-rose-950/60',
      badgeColor: 'text-rose-500',
      countColor: 'text-amber-600 dark:text-amber-400'
    },
    {
      id: 'education',
      name: 'Education',
      countLabel: '216 schemes',
      filterCategory: 'Education',
      icon: <GraduationCap className="w-8 h-8 text-sky-500 dark:text-sky-400" />,
      badgeBg: 'bg-sky-50 dark:bg-sky-950/60',
      badgeColor: 'text-sky-500',
      countColor: 'text-indigo-600 dark:text-indigo-400'
    },
    {
      id: 'housing',
      name: 'Housing',
      countLabel: '67 schemes',
      filterCategory: 'Housing',
      icon: <Home className="w-8 h-8 text-amber-600 dark:text-amber-400" />,
      badgeBg: 'bg-amber-50 dark:bg-amber-950/60',
      badgeColor: 'text-amber-600',
      countColor: 'text-amber-700 dark:text-amber-400'
    },
    {
      id: 'women-child',
      name: 'Women & Child',
      countLabel: '103 schemes',
      filterCategory: 'Women & Child',
      icon: <HeartHandshake className="w-8 h-8 text-pink-500 dark:text-pink-400" />,
      badgeBg: 'bg-pink-50 dark:bg-pink-950/60',
      badgeColor: 'text-pink-500',
      countColor: 'text-rose-600 dark:text-rose-400'
    },
    {
      id: 'energy',
      name: 'Energy',
      countLabel: '54 schemes',
      filterCategory: 'Energy',
      icon: <Zap className="w-8 h-8 text-amber-500 dark:text-amber-400 fill-amber-500/20" />,
      badgeBg: 'bg-amber-50 dark:bg-amber-950/60',
      badgeColor: 'text-amber-500',
      countColor: 'text-amber-600 dark:text-amber-400'
    },
    {
      id: 'employment',
      name: 'Employment',
      countLabel: '178 schemes',
      filterCategory: 'Employment & Skill',
      icon: <Briefcase className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />,
      badgeBg: 'bg-indigo-50 dark:bg-indigo-950/60',
      badgeColor: 'text-indigo-600',
      countColor: 'text-indigo-600 dark:text-indigo-400'
    },
    {
      id: 'senior-citizens',
      name: 'Senior Citizens',
      countLabel: '41 schemes',
      filterCategory: 'Senior Citizens',
      icon: <UserCheck className="w-8 h-8 text-[#6C5CE7] dark:text-indigo-300" />,
      badgeBg: 'bg-purple-50 dark:bg-purple-950/60',
      badgeColor: 'text-[#6C5CE7]',
      countColor: 'text-purple-600 dark:text-purple-400'
    }
  ];

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#E8640A] dark:text-amber-400 block mb-1">
            BROWSE BY SECTOR
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Scheme Categories
          </h2>
        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs sm:text-sm font-bold text-[#E8640A] hover:text-[#d35500] dark:text-amber-400 flex items-center gap-1.5 transition-colors group"
          >
            <span>View all</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onSelectCategory && onSelectCategory(cat.filterCategory)}
            className="group p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 hover:border-[#6C5CE7] dark:hover:border-[#6C5CE7] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[140px]"
          >
            {/* Top Icon Badge */}
            <div className={`w-14 h-14 rounded-2xl ${cat.badgeBg} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
              {cat.icon}
            </div>

            {/* Title & Count */}
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg group-hover:text-[#6C5CE7] transition-colors">
                {cat.name}
              </h3>
              <p className={`text-xs font-semibold mt-1 ${cat.countColor}`}>
                {cat.countLabel}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
