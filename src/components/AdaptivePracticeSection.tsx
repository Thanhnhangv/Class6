import React, { useState, useEffect } from "react";
import { Question, DifficultyLevel, MathSkill, StudentProfile } from "../types/lms";
import { QUESTION_BANK, SKILL_LABELS } from "../data/questionBank";
import { Sparkles, CheckCircle2, XCircle, AlertCircle, ArrowRight, HelpCircle, TrendingUp, Lightbulb, RefreshCw, Trophy, BookOpen, Layers } from "lucide-react";
import confetti from "canvas-confetti";

interface AdaptivePracticeSectionProps {
  student: StudentProfile;
  onUpdateStudent: (updater: (prev: StudentProfile) => StudentProfile) => void;
  onOpenAiTutor: (context: string, skill?: string, answer?: string) => void;
  onCompleteModule: () => void;
}

export const AdaptivePracticeSection: React.FC<AdaptivePracticeSectionProps> = ({
  student,
  onUpdateStudent,
  onOpenAiTutor,
  onCompleteModule,
}) => {
  const [currentLevel, setCurrentLevel] = useState<DifficultyLevel>(
    student.adaptiveStats.currentDifficulty || "nhan_biet"
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [sessionCorrectCount, setSessionCorrectCount] = useState(0);
  const [sessionTotalAnswered, setSessionTotalAnswered] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [adaptiveMessage, setAdaptiveMessage] = useState<string | null>(null);
  const [remedialSkill, setRemedialSkill] = useState<MathSkill | null>(null);

  // Initialize pool for current level
  useEffect(() => {
    const levelQuestions = QUESTION_BANK.filter((q) => q.level === currentLevel);
    // Shuffle
    const shuffled = [...levelQuestions].sort(() => Math.random() - 0.5);
    setSessionQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowHint(false);
  }, [currentLevel]);

  const currentQ = sessionQuestions[currentQuestionIndex] || QUESTION_BANK[0];

  const handleSelectOption = (idx: string) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null || isAnswered) return;
    setIsAnswered(true);

    const isCorrect = selectedOption === currentQ.correctAnswer;
    const newTotal = sessionTotalAnswered + 1;
    const newCorrect = sessionCorrectCount + (isCorrect ? 1 : 0);
    setSessionTotalAnswered(newTotal);
    setSessionCorrectCount(newCorrect);

    // Update global student profile
    onUpdateStudent((prev) => {
      const skill = currentQ.skill;
      const skillMistakes = { ...prev.adaptiveStats.skillMistakes };
      const skillSuccesses = { ...prev.adaptiveStats.skillSuccesses };

      if (isCorrect) {
        skillSuccesses[skill] = (skillSuccesses[skill] || 0) + 1;
      } else {
        skillMistakes[skill] = (skillMistakes[skill] || 0) + 1;
      }

      // Check pedagogical triggers
      if (!isCorrect && skillMistakes[skill] >= 2) {
        setRemedialSkill(skill);
      }
      if (!isCorrect && skillMistakes[skill] >= 3) {
        // Auto trigger AI Tutor help prompt
        setTimeout(() => {
          onOpenAiTutor(
            `Học sinh sai 3 lần ở kỹ năng: ${SKILL_LABELS[skill]}. Nội dung câu: ${currentQ.content}`,
            skill,
            selectedOption
          );
        }, 1200);
      }

      const addedXp = isCorrect ? currentQ.points : 0;
      return {
        ...prev,
        xp: prev.xp + addedXp,
        adaptiveStats: {
          ...prev.adaptiveStats,
          totalAnswered: prev.adaptiveStats.totalAnswered + 1,
          totalCorrect: prev.adaptiveStats.totalCorrect + (isCorrect ? 1 : 0),
          skillMistakes,
          skillSuccesses,
        },
      };
    });

    if (isCorrect) {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    }
  };

  const handleNextQuestion = () => {
    // Check adaptive difficulty adjustment every 3-4 questions or level progress
    const accuracy = sessionTotalAnswered > 0 ? (sessionCorrectCount / sessionTotalAnswered) * 100 : 100;

    let nextLevel = currentLevel;
    let message = null;

    if (sessionTotalAnswered >= 3) {
      if (accuracy >= 80) {
        if (currentLevel === "nhan_biet") {
          nextLevel = "thong_hieu";
          message = "🚀 Xuất sắc (Đúng ≥ 80%)! Hệ thống tự động nâng độ khó lên THÔNG HIỂU!";
        } else if (currentLevel === "thong_hieu") {
          nextLevel = "van_dung";
          message = "🌟 Tuyệt vời! Bạn được thăng hạng lên cấp độ VẬN DỤNG!";
        } else if (currentLevel === "van_dung") {
          nextLevel = "van_dung_cao";
          message = "🔥 Phong độ đỉnh cao! Mở khóa thử thách VẬN DỤNG CAO!";
        }
      } else if (accuracy < 50) {
        if (currentLevel === "van_dung_cao") {
          nextLevel = "van_dung";
          message = "💡 Điều chỉnh độ khó về VẬN DỤNG để củng cố nền tảng chắc chắn hơn.";
        } else if (currentLevel === "van_dung") {
          nextLevel = "thong_hieu";
          message = "💡 Điều chỉnh về THÔNG HIỂU để rèn luyện kỹ năng cốt lõi.";
        } else if (currentLevel === "thong_hieu") {
          nextLevel = "nhan_biet";
          message = "💡 Củng cố lại phần NHẬN BIẾT trước khi thử sức các bài phức tạp.";
        }
      }
    }

    if (nextLevel !== currentLevel) {
      setCurrentLevel(nextLevel);
      setAdaptiveMessage(message);
      setSessionCorrectCount(0);
      setSessionTotalAnswered(0);
      return;
    }

    if (currentQuestionIndex + 1 < sessionQuestions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowHint(false);
    } else {
      // Completed all questions in this level
      setAdaptiveMessage("🎉 Bạn đã hoàn thành xuất sắc các câu hỏi trong cấp độ này!");
      onCompleteModule();
    }
  };

  const getLevelBadge = (level: DifficultyLevel) => {
    switch (level) {
      case "nhan_biet":
        return { label: "Mức 1: Nhận biết", color: "bg-blue-100 text-blue-800 border-blue-200" };
      case "thong_hieu":
        return { label: "Mức 2: Thông hiểu", color: "bg-emerald-100 text-emerald-800 border-emerald-200" };
      case "van_dung":
        return { label: "Mức 3: Vận dụng", color: "bg-amber-100 text-amber-800 border-amber-200" };
      case "van_dung_cao":
        return { label: "Mức 4: Vận dụng cao", color: "bg-rose-100 text-rose-800 border-rose-200" };
    }
  };

  const currentBadge = getLevelBadge(currentLevel);
  const isCorrect = isAnswered && selectedOption === currentQ.correctAnswer;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in" id="adaptive_practice_section">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-amber-100">
            <span>⚡ PHẦN D</span>
            <span>•</span>
            <span>LUYỆN TẬP THÍCH ỨNG (ADAPTIVE LEARNING)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ngân Hàng 30+ Câu Hỏi Thích Ứng Theo Năng Lực
          </h1>
          <p className="text-amber-100 text-sm sm:text-base max-w-2xl">
            Hệ thống tự động điều chỉnh độ khó theo kết quả của em: Đúng ≥80% tăng độ khó, &lt;50% hạ độ khó & hỗ trợ củng cố.
          </p>
        </div>
        <div className="absolute right-4 bottom-[-10px] opacity-15 text-8xl pointer-events-none">
          🎯
        </div>
      </div>

      {/* Adaptive Status Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <span className="text-xs text-slate-500">Cấp độ hiện tại:</span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${currentBadge.color}`}>
              {currentBadge.label}
            </span>
          </div>

          <div className="hidden sm:flex items-center space-x-1 text-xs text-slate-500 border-l border-slate-200 dark:border-slate-700 pl-3">
            <span>Kỹ năng:</span>
            <strong className="text-slate-800 dark:text-slate-200">
              {SKILL_LABELS[currentQ.skill]}
            </strong>
          </div>
        </div>

        {/* Level Selector buttons for quick test */}
        <div className="flex items-center space-x-1 text-xs">
          <span className="text-slate-400 mr-1 hidden md:inline">Chọn cấp độ:</span>
          {(["nhan_biet", "thong_hieu", "van_dung", "van_dung_cao"] as DifficultyLevel[]).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setCurrentLevel(lvl)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                currentLevel === lvl
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {lvl === "nhan_biet" ? "Mức 1" : lvl === "thong_hieu" ? "Mức 2" : lvl === "van_dung" ? "Mức 3" : "Mức 4"}
            </button>
          ))}
        </div>
      </div>

      {/* Adaptive Level Change Notification */}
      {adaptiveMessage && (
        <div className="p-4 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900 rounded-2xl text-indigo-900 dark:text-indigo-200 text-sm flex items-center justify-between animate-fade-in">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <span className="font-semibold">{adaptiveMessage}</span>
          </div>
          <button
            onClick={() => setAdaptiveMessage(null)}
            className="text-xs text-indigo-600 font-bold hover:underline"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Remedial Skill Recommendation (if mistake >= 2) */}
      {remedialSkill && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-900 rounded-2xl text-amber-900 dark:text-amber-200 text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <strong>Đề xuất học lại:</strong> Em đang sai lặp lại ở kỹ năng{" "}
              <span className="underline font-bold">{SKILL_LABELS[remedialSkill]}</span>.
            </div>
          </div>
          <button
            onClick={() =>
              onOpenAiTutor(
                `Học sinh cần ôn lại lý thuyết kỹ năng: ${SKILL_LABELS[remedialSkill]}`,
                remedialSkill
              )
            }
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-xs flex items-center space-x-1"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Ôn kỹ năng cùng Cô Nhân</span>
          </button>
        </div>
      )}

      {/* Main Question Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        {/* Question Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/80 pb-4">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 font-black text-sm flex items-center justify-center">
              #{currentQuestionIndex + 1}
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Câu hỏi trong cấp độ ({currentQuestionIndex + 1}/{sessionQuestions.length})
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
              +{currentQ.points} XP
            </span>
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 p-1.5 rounded-lg flex items-center space-x-1"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>{showHint ? "Ẩn gợi ý" : "Gợi ý"}</span>
            </button>
          </div>
        </div>

        {/* Hint Box */}
        {showHint && (
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-start space-x-2 animate-fade-in">
            <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Gợi ý từ Cô Nhân:</strong> {currentQ.hint}
            </div>
          </div>
        )}

        {/* Question Text */}
        <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
          {currentQ.content}
        </div>

        {/* Options */}
        <div className="space-y-3" id="adaptive_options_list">
          {currentQ.options?.map((optionText, idx) => {
            const optIndexStr = idx.toString();
            const isSelected = selectedOption === optIndexStr;
            const isThisCorrect = optIndexStr === currentQ.correctAnswer;

            let optionStyle = "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300";

            if (isSelected) {
              optionStyle = "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 ring-2 ring-indigo-500/20";
            }

            if (isAnswered) {
              if (isThisCorrect) {
                optionStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 ring-2 ring-emerald-400/30 text-emerald-950 dark:text-emerald-100";
              } else if (isSelected && !isThisCorrect) {
                optionStyle = "border-rose-500 bg-rose-50 dark:bg-rose-950/60 ring-2 ring-rose-400/30 text-rose-950 dark:text-rose-100";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(optIndexStr)}
                disabled={isAnswered}
                className={`w-full p-4 rounded-2xl border text-left font-medium text-sm sm:text-base transition-all flex items-center justify-between ${optionStyle}`}
                id={`adaptive_opt_${idx}`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-7 h-7 rounded-xl border flex items-center justify-center text-xs font-bold ${
                      isSelected
                        ? isAnswered
                          ? isThisCorrect
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-rose-600 text-white border-rose-600"
                          : "bg-indigo-600 text-white border-indigo-600"
                        : isAnswered && isThisCorrect
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "border-slate-300 dark:border-slate-600 text-slate-500"
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="text-slate-800 dark:text-slate-200 leading-snug">
                    {optionText}
                  </span>
                </div>

                {isAnswered && (
                  <div>
                    {isThisCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : isSelected ? (
                      <XCircle className="w-5 h-5 text-rose-600" />
                    ) : null}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Action Bottom Bar */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() =>
              onOpenAiTutor(
                `Bài toán: "${currentQ.content}" thuộc kỹ năng ${SKILL_LABELS[currentQ.skill]}`,
                currentQ.skill,
                selectedOption || undefined
              )
            }
            className="text-xs text-indigo-600 font-bold hover:underline flex items-center space-x-1.5"
            id="adaptive_ask_ai_btn"
          >
            <HelpCircle className="w-4 h-4 text-purple-600" />
            <span>Hỏi Cô AI Nhân phân tích</span>
          </button>

          {!isAnswered ? (
            <button
              onClick={handleCheckAnswer}
              disabled={selectedOption === null}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold px-7 py-3 rounded-2xl shadow-md transition-all text-sm flex items-center space-x-2"
              id="adaptive_submit_btn"
            >
              <span>Kiểm tra</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold px-7 py-3 rounded-2xl shadow-md transition-all text-sm flex items-center space-x-2"
              id="adaptive_next_btn"
            >
              <span>Câu tiếp theo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Diagnostic Feedback Box */}
        {isAnswered && (
          <div
            className={`p-5 rounded-2xl border transition-all space-y-3 animate-fade-in ${
              isCorrect
                ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100"
                : "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100"
            }`}
          >
            <div className="flex items-start space-x-3">
              {isCorrect ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="space-y-2">
                <h4 className="font-bold text-base">
                  {isCorrect ? "🎉 Chính xác tuyệt vời! (+ " + currentQ.points + " XP)" : "Chưa chính xác rồi em ơi!"}
                </h4>
                <p className="text-sm leading-relaxed">
                  <strong>Lời giải chi tiết:</strong> {currentQ.explanation}
                </p>
                {!isCorrect && (
                  <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-rose-200 dark:border-rose-900 text-xs text-rose-900 dark:text-rose-200">
                    ⚠️ <strong>Bẫy học sinh hay mắc:</strong> {currentQ.commonMistake}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
