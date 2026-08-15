import React, { useState, useEffect } from "react";
import { ModuleType, StudentProfile, UserRole } from "./types/lms";
import { INITIAL_BADGES } from "./data/questionBank";
import { Navbar } from "./components/Navbar";
import { WarmupSection } from "./components/WarmupSection";
import { ExploreSection } from "./components/ExploreSection";
import { ConceptSection } from "./components/ConceptSection";
import { AdaptivePracticeSection } from "./components/AdaptivePracticeSection";
import { DetectiveGameSection } from "./components/DetectiveGameSection";
import { FinalAssessmentSection } from "./components/FinalAssessmentSection";
import { CertificateSection } from "./components/CertificateSection";
import { TeacherDashboardSection } from "./components/TeacherDashboardSection";
import { AiTutorModal } from "./components/AiTutorModal";
import { Sparkles, MessageCircleQuestion, HelpCircle, ArrowRight, RotateCcw } from "lucide-react";

const DEFAULT_STUDENT: StudentProfile = {
  id: "student_01",
  name: "Nguyễn Minh Khang",
  grade: "6A1",
  school: "THCS Kết Nối Tri Thức",
  role: "student",
  xp: 120,
  badges: INITIAL_BADGES,
  currentModule: "warmup",
  completedModules: [],
  gameScore: 0,
  gameCompletedStages: [],
  adaptiveStats: {
    currentDifficulty: "nhan_biet",
    totalAnswered: 0,
    totalCorrect: 0,
    skillMistakes: {
      tim_uoc: 0,
      tim_uoc_chung: 0,
      tim_ucln_liet_ke: 0,
      tim_ucln_tsnt: 0,
      ucln_dac_biet: 0,
      rut_gon_phan_so: 0,
      toan_thuc_te_chia_phan: 0,
    },
    skillSuccesses: {
      tim_uoc: 0,
      tim_uoc_chung: 0,
      tim_ucln_liet_ke: 0,
      tim_ucln_tsnt: 0,
      ucln_dac_biet: 0,
      rut_gon_phan_so: 0,
      toan_thuc_te_chia_phan: 0,
    },
  },
  quizScore: 0,
  quizTotal: 10,
  passedFinal: false,
};

export default function App() {
  const [student, setStudent] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem("hoc_toan_co_nhan_student");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_STUDENT;
  });

  const [currentModule, setCurrentModule] = useState<ModuleType>(student.currentModule || "warmup");
  const [userRole, setUserRole] = useState<UserRole>("student");

  // AI Tutor State
  const [isAiTutorOpen, setIsAiTutorOpen] = useState(false);
  const [aiTutorContext, setAiTutorContext] = useState<string | undefined>(undefined);
  const [aiTutorSkill, setAiTutorSkill] = useState<string | undefined>(undefined);
  const [aiTutorAnswer, setAiTutorAnswer] = useState<string | undefined>(undefined);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("hoc_toan_co_nhan_student", JSON.stringify(student));
    } catch (e) {
      console.error(e);
    }
  }, [student]);

  const handleOpenAiTutor = (context?: string, skill?: string, answer?: string) => {
    setAiTutorContext(context);
    setAiTutorSkill(skill);
    setAiTutorAnswer(answer);
    setIsAiTutorOpen(true);
  };

  const handleSelectModule = (mod: ModuleType) => {
    setCurrentModule(mod);
    setStudent((prev) => ({ ...prev, currentModule: mod }));
  };

  const markModuleCompleted = (mod: ModuleType, nextMod?: ModuleType) => {
    setStudent((prev) => {
      const completed = [...prev.completedModules];
      if (!completed.includes(mod)) {
        completed.push(mod);
      }
      return {
        ...prev,
        xp: prev.xp + 20,
        completedModules: completed,
      };
    });

    if (nextMod) {
      handleSelectModule(nextMod);
    }
  };

  const handleResetData = () => {
    if (window.confirm("Em có muốn đặt lại tiến trình học tập để làm lại từ đầu không?")) {
      setStudent(DEFAULT_STUDENT);
      setCurrentModule("warmup");
      localStorage.removeItem("hoc_toan_co_nhan_student");
    }
  };

  const handleUnlockAll = () => {
    setStudent((prev) => ({
      ...prev,
      xp: prev.xp + 300,
      completedModules: [
        "warmup",
        "explore",
        "concept",
        "adaptive_practice",
        "detective_game",
        "final_assessment",
        "certificate",
      ],
      gameCompletedStages: [1, 2, 3, 4],
      passedFinal: true,
      quizScore: 10,
      certificateId: "CTN-" + Math.floor(100000 + Math.random() * 900000),
      completionDate: new Date().toLocaleDateString("vi-VN"),
      badges: prev.badges.map((b) => ({
        ...b,
        isUnlocked: true,
        unlockedAt: new Date().toLocaleDateString("vi-VN"),
      })),
    }));
  };

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white" id="main_app_container">
      {/* Top Main Navigation */}
      <Navbar
        student={student}
        currentModule={currentModule}
        onSelectModule={handleSelectModule}
        onOpenAiTutor={() => handleOpenAiTutor()}
        userRole={userRole}
        onToggleRole={(role) => {
          setUserRole(role);
          if (role === "teacher") {
            handleSelectModule("teacher_dashboard");
          } else {
            handleSelectModule("warmup");
          }
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
        {currentModule === "warmup" && (
          <WarmupSection
            onComplete={() => markModuleCompleted("warmup", "explore")}
            onOpenAiTutor={handleOpenAiTutor}
          />
        )}

        {currentModule === "explore" && (
          <ExploreSection
            onComplete={() => markModuleCompleted("explore", "concept")}
            onOpenAiTutor={handleOpenAiTutor}
          />
        )}

        {currentModule === "concept" && (
          <ConceptSection
            onComplete={() => markModuleCompleted("concept", "adaptive_practice")}
            onOpenAiTutor={handleOpenAiTutor}
          />
        )}

        {currentModule === "adaptive_practice" && (
          <AdaptivePracticeSection
            student={student}
            onUpdateStudent={setStudent}
            onOpenAiTutor={handleOpenAiTutor}
            onCompleteModule={() => markModuleCompleted("adaptive_practice", "detective_game")}
          />
        )}

        {currentModule === "detective_game" && (
          <DetectiveGameSection
            student={student}
            onUpdateStudent={setStudent}
            onOpenAiTutor={(ctx) => handleOpenAiTutor(ctx)}
            onCompleteGame={() => markModuleCompleted("detective_game", "final_assessment")}
          />
        )}

        {currentModule === "final_assessment" && (
          <FinalAssessmentSection
            student={student}
            onUpdateStudent={setStudent}
            onOpenAiTutor={handleOpenAiTutor}
            onGoToCertificate={() => handleSelectModule("certificate")}
          />
        )}

        {currentModule === "certificate" && (
          <CertificateSection
            student={student}
            onBackToDashboard={() => handleSelectModule("warmup")}
            onUpdateStudentName={(newName) =>
              setStudent((prev) => ({ ...prev, name: newName }))
            }
          />
        )}

        {currentModule === "teacher_dashboard" && (
          <TeacherDashboardSection onOpenAiTutor={handleOpenAiTutor} />
        )}
      </main>

      {/* Floating AI Tutor Quick Help Button */}
      <div className="fixed bottom-6 right-6 z-40 print:hidden" id="floating_ai_tutor_widget">
        <button
          onClick={() => handleOpenAiTutor()}
          className="relative group bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-bold p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-xl flex items-center space-x-2 transition-all transform hover:scale-105 active:scale-95 ring-4 ring-indigo-500/20"
          id="floating_ai_tutor_btn"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-lg">
            👩‍🏫
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-black leading-tight">Cô AI Nhân</span>
            <span className="text-[10px] text-indigo-100 font-normal leading-tight">
              Hỏi đáp & Gợi ý từng bước
            </span>
          </div>
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-pink-500"></span>
          </span>
        </button>
      </div>

      {/* Footer / Demo helper toolbar */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 py-4 px-6 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-slate-700 dark:text-slate-300">
            HỌC TOÁN CÙNG CÔ NHÂN
          </span>
          <span>•</span>
          <span>Toán 6 (Bộ sách Kết nối tri thức với cuộc sống)</span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleUnlockAll}
            className="text-[11px] text-indigo-600 hover:underline font-semibold"
            title="Mở khóa tất cả bài học để kiểm tra nhanh các chức năng"
          >
            ⚡ Chế độ Demo (Mở khóa toàn bộ)
          </button>
          <span>•</span>
          <button
            onClick={handleResetData}
            className="text-[11px] text-slate-400 hover:text-rose-500 transition-colors flex items-center space-x-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Đặt lại tiến trình</span>
          </button>
        </div>
      </footer>

      {/* AI Tutor Dialog Modal */}
      <AiTutorModal
        isOpen={isAiTutorOpen}
        onClose={() => setIsAiTutorOpen(false)}
        context={aiTutorContext}
        currentSkill={aiTutorSkill}
        studentAnswer={aiTutorAnswer}
      />
    </div>
  );
}
