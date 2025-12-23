
import React from 'react';
import { Category } from '../types';
import { CATEGORIES } from '../constants';

interface SidebarProps {
  activeCategory: Category;
  onSelectCategory: (category: Category) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeCategory, onSelectCategory }) => {
  return (
    <div className="w-20 md:w-64 bg-white border-r border-slate-200 flex flex-col h-full transition-all duration-300">
      <div className="p-4 flex items-center gap-3 border-b border-slate-100">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
          <i className="fa-solid fa-utensils"></i>
        </div>
        <span className="hidden md:block font-bold text-xl tracking-tight text-slate-800">LumiPOS</span>
      </div>

      <nav className="flex-1 p-2 space-y-1 mt-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
              activeCategory === cat
                ? 'bg-indigo-50 text-indigo-600 font-semibold'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <span className="w-8 flex justify-center">
              <i className={`fa-solid ${getIconForCategory(cat)}`}></i>
            </span>
            <span className="hidden md:block">{cat}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 hidden md:block">
        <div className="bg-slate-50 rounded-xl p-3">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Shift Info</p>
          <p className="text-sm font-semibold text-slate-700">Alice Johnson</p>
          <p className="text-xs text-slate-500">Waitress • Counter 04</p>
        </div>
      </div>
    </div>
  );
};

const getIconForCategory = (cat: Category): string => {
  switch (cat) {
    case 'All': return 'fa-border-all';
    case 'Mains': return 'fa-burger';
    case 'Sides': return 'fa-bowl-food';
    case 'Drinks': return 'fa-mug-hot';
    case 'Desserts': return 'fa-ice-cream';
    default: return 'fa-circle';
  }
};

export default Sidebar;
