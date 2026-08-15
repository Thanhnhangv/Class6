import React from "react";
import { ModuleType, StudentProfile, UserRole } from "../types/lms";
import { Sparkles, BarChart2, User, Award, Shield } from "lucide-react";

interface NavbarProps {
  currentModule: ModuleType;
  onSelectModule: (module: ModuleType) => void;
  student: StudentProfile;
  onOpenAiTutor: () => void;
  userRole: UserRole;
  onToggleRole: (role: UserRole) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentModule,
  onSelectModule,
  student,
  onOpenAiTutor,
  userRole,
  onToggleRole,
}) => {
  const navItems: { id: ModuleType; label: string; icon: string }[] = [
    { id: "warmup", label: "A. Khởi động", icon: "🚀" },
    { id: "explore", label: "B. Khám phá", icon: "🔍" },
    { id: "concept", label: "C. Kiến thức", icon: "📖" },
    { id: "adaptive_practice", label: "D. Luyện tập", icon: "⚡" },
    { id: "detective_game", label: "E. Thám tử", icon: "🕵️" },
    { id: "final_assessment", label: "F. Đánh giá", icon: "📝" },
    { id: "certificate", label: "Chứng nhận", icon: "🎓" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => onSelectModule("warmup")}
            id="brand_logo_click"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-xl shadow-md">
              𝝅
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg tracking-tight">
                  HỌC TOÁN CÙNG CÔ NHÂN
                </span>
                <span className="bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                  Toán 6 • KNTT
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Ước chung và Ước chung lớn nhất (ƯC & ƯCLN)
              </p>
            </div>
          </div>

          {/* User Stats & Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* XP Badge */}
            <div className="flex items-center space-x-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 px-3 py-1.5 rounded-full text-xs font-bold text-amber-800 dark:text-amber-300 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>{student.xp} XP</span>
            </div>

            {/* Badges Preview count */}
            <div className="hidden md:flex items-center space-x-1 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 px-2.5 py-1.5 rounded-full text-xs font-bold text-purple-700 dark:text-purple-300">
              <span>🏅 {student.badges.filter((b) => b.isUnlocked).length}/{student.badges.length} Huy hiệu</span>
            </div>

            {/* AI Tutor Button */}
            <button
              onClick={onOpenAiTutor}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm transition-all transform active:scale-95"
              id="navbar_open_ai_tutor"
            >
              <span className="text-sm">👩‍🏫</span>
              <span className="hidden sm:inline">Cô AI Nhân</span>
            </button>

            {/* Role Switcher */}
            <button
              onClick={() => onToggleRole(userRole === "student" ? "teacher" : "student")}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                userRole === "teacher"
                  ? "bg-purple-600 text-white border-purple-700 shadow-xs"
                  : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 hover:bg-slate-200"
              }`}
              title="Chuyển chế độ Học sinh / Giáo viên"
              id="navbar_toggle_role"
            >
              {userRole === "teacher" ? <BarChart2 className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{userRole === "teacher" ? "Báo cáo Giáo viên" : "Góc Học sinh"}</span>
            </button>
          </div>
        </div>

        {/* Module Sub-tabs */}
        {userRole === "student" && (
          <div className="flex items-center space-x-1 overflow-x-auto py-2 border-t border-slate-100 dark:border-slate-800/80 no-scrollbar" id="navbar_module_tabs">
            {navItems.map((item) => {
              const isActive = currentModule === item.id;
              const isCompleted = student.completedModules.includes(item.id);
              const isCert = item.id === "certificate";
              const isCertLocked = isCert && !student.passedFinal;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectModule(item.id)}
                  disabled={isCertLocked}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-xs"
                      : isCertLocked
                      ? "opacity-40 cursor-not-allowed text-slate-400"
                      : isCompleted
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                  id={`nav_tab_${item.id}`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                  {isCompleted && !isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  )}
                  {isCert && student.passedFinal && (
                    <Award className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
