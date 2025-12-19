
import React, { useState } from 'react';
import { Icons } from '../constants';
import { View } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: View;
  onViewChange: (view: View) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange }) => {
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  const navItems: { id: View; label: string; icon: React.FC }[] = [
    { id: 'dashboard', label: 'الرئيسية', icon: Icons.Home },
    { id: 'lessons', label: 'الدروس الذكية', icon: Icons.Book },
    { id: 'exams', label: 'اختبارات دولية', icon: Icons.Exam },
    { id: 'tutor', label: 'المعلم المباشر', icon: Icons.Mic },
    { id: 'profile', label: 'ملفي الشخصي', icon: Icons.User },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-80 bg-white/40 backdrop-blur-3xl border-l p-10 sticky top-0 h-screen z-50">
        <div className="flex items-center gap-4 mb-4 px-2 group cursor-pointer" onClick={() => onViewChange('dashboard')}>
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-indigo-200 transition-transform group-hover:scale-105">
            ع
          </div>
          <div className="flex flex-col">
            <h1 className="text-[16px] font-black tracking-[-0.4px] text-slate-900 leading-tight">عصر الذكاء</h1>
            <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider">Asr Althkaa</span>
          </div>
        </div>

        <button 
          onClick={() => setIsLogoModalOpen(true)}
          className="mb-10 text-[11px] font-black text-indigo-500/60 hover:text-indigo-600 text-right px-4 transition-colors uppercase tracking-widest"
        >
          View Full Size
        </button>

        <nav className="flex-1 space-y-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-[22px] transition-all duration-500 ${
                activeView === item.id 
                  ? 'bg-white shadow-[0_15px_30px_-5px_rgba(0,0,0,0.06)] text-indigo-600 font-bold scale-[1.03]' 
                  : 'text-slate-500 hover:bg-white/60 hover:text-slate-900'
              }`}
            >
              <item.icon />
              <span className="text-[14px] font-bold">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-10 border-t border-slate-200/40">
          <button className="w-full flex items-center gap-4 px-6 py-4 text-slate-500 hover:text-indigo-600 transition-all rounded-[22px] hover:bg-white/40">
            <Icons.Settings />
            <span className="text-[14px] font-bold">إعدادات الحساب</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col w-full overflow-x-hidden">
        {/* Mobile Nav Header */}
        <header className="md:hidden flex items-center justify-between p-6 bg-white/80 backdrop-blur-2xl border-b sticky top-0 z-[60]">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsLogoModalOpen(true)}
              className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg active:scale-90 transition-transform"
            >
              ع
            </button>
            <h1 className="font-black text-slate-900 text-base">Asr Althkaa</h1>
          </div>
          <button className="p-2.5 text-slate-900 bg-slate-50 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        </header>

        {/* Content Area */}
        <div className="p-8 md:p-16 max-w-7xl mx-auto w-full pb-40 md:pb-16">
          {children}
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-6 left-6 right-6 bg-white/90 backdrop-blur-3xl border border-white/40 shadow-2xl rounded-[30px] flex justify-around p-4 z-50 overflow-hidden">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex flex-col items-center px-4 py-2 transition-all duration-300 ${
                activeView === item.id ? 'text-indigo-600 bg-indigo-50/80 rounded-2xl' : 'text-slate-400'
              }`}
            >
              <item.icon />
              <span className="text-[9px] mt-1.5 font-black uppercase tracking-tighter">{item.id.slice(0,3)}</span>
            </button>
          ))}
        </nav>
      </main>

      {/* Logo Modal */}
      {isLogoModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-300 p-8">
          <div className="relative group max-w-md w-full flex flex-col items-center">
            <div className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-[60px] flex items-center justify-center text-white font-black text-9xl md:text-[180px] shadow-[0_50px_100px_-20px_rgba(79,70,229,0.5)] border-4 border-white/20 animate-float">
              ع
            </div>
            <button 
              onClick={() => setIsLogoModalOpen(false)}
              className="mt-12 p-5 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all flex items-center gap-3 font-bold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              إغلاق العرض
            </button>
            <div className="mt-8 text-center text-white/60 font-black tracking-widest uppercase text-lg">
              Asr Althkaa - Visual Identity
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
