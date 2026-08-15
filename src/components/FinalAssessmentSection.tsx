import React, { useState, useMemo } from "react";
import { Question, MathSkill, StudentProfile } from "../types/lms";
import { QUESTION_BANK, SKILL_LABELS } from "../data/questionBank";
import { CheckCircle2, XCircle, AlertCircle, ArrowRight, RotateCcw, Trophy, Award, BookOpen, Sparkles, HelpCircle, ShieldCheck } from "lucide-react";
import confetti from "canvas-confetti";

interface FinalAssessmentSectionProps {
  student: StudentProfile;
  onUpdateStudent: (updater: (prev: StudentProfile) => StudentProfile) => void;
  onOpenAiTutor: (context: string, skill?: string) => void;
  onGoToCertificate: () => void;
}

export const FinalAssessmentSection: React.FC<FinalAssessmentSectionProps> = ({
  student,
  onUpdateStudent,
  onOpenAiTutor,
  onGoToCertificate,
}) => {
  // Select fixed balanced set of 10 questions: 3 NB, 3 TH, 2 VD, 2 VDC
  const examQuestions = useMemo<Question[]>(() => {
    const nb = QUESTION_BANK.filter((q) => q.level === "nhan_biet").slice(0, 3);
    const th = QUESTION_BANK.filter((q) => q.level === "thong_hieu").slice(0, 3);
    const vd = QUESTION_BANK.filter((q) => q.level === "van_dung").slice(0, 2);
    const vdc = QUESTION_BANK.filter((q) => q.level === "van_dung_cao").slice(0, 2);
    return [...nb, ...th, ...vd, ...vdc];
  }, []);

  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);

  // Remedial Mode State
  const [isRemedialMode, setIsRemedialMode] = useState(false);
  const [remedialQuestions, setRemedialQuestions] = useState<Question[]>([]);
  const [remedialAnswers, setRemedialAnswers] = useState<Record<number, string>>({});
  const [isRemedialSubmitted, setIsRemedialSubmitted] = useState(false);

  const currentQ = examQuestions[currentQIndex];

  // Calculate Results
  const { correctCount, totalQuestions, scorePercent, wrongSkills } = useMemo(() => {
    let correct = 0;
    const failedSkills: MathSkill[] = [];

    examQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) {
        correct += 1;
      } else if (isSubmitted) {
        if (!failedSkills.includes(q.skill)) {
          failedSkills.push(q.skill);
        }
      }
    });

    const percent = Math.round((correct / examQuestions.length) * 100);
    return {
      correctCount: correct,
      totalQuestions: examQuestions.length,
      scorePercent: percent,
      wrongSkills: failedSkills,
    };
  }, [examQuestions, userAnswers, isSubmitted]);

  const handleSubmitExam = () => {
    setIsSubmitted(true);

    const isPassed = correctCount === totalQuestions; // 100% required

    if (isPassed) {
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });

      const certId = "CTN-" + Math.floor(100000 + Math.random() * 900000);
      const completionDate = new Date().toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      onUpdateStudent((prev) => {
        const badges = prev.badges.map((b) => {
          if (b.id === "badge_conqueror" || b.id === "badge_gcd_master") {
            return { ...b, isUnlocked: true, unlockedAt: completionDate };
          }
          return b;
        });

        const completed = [...prev.completedModules];
        if (!completed.includes("final_assessment")) completed.push("final_assessment");
        if (!completed.includes("certificate")) completed.push("certificate");

        return {
          ...prev,
          xp: prev.xp + 100,
          quizScore: correctCount,
          quizTotal: totalQuestions,
          passedFinal: true,
          certificateId: certId,
          completionDate: completionDate,
          badges,
          completedModules: completed,
        };
      });
    } else {
      // Prepare 3 remedial questions targeting the weakest skills
      const targetSkill = wrongSkills[0] || "tim_ucln_tsnt";
      const pool = QUESTION_BANK.filter(
        (q) => q.skill === targetSkill && !examQuestions.some((eq) => eq.id === q.id)
      );
      const chosen = pool.slice(0, 3);
      if (chosen.length < 3) {
        const fillers = QUESTION_BANK.filter((q) => !examQuestions.some((eq) => eq.id === q.id)).slice(0, 3);
        setRemedialQuestions(fillers);
      } else {
        setRemedialQuestions(chosen);
      }
    }
  };

  const handleRetakeExam = () => {
    setUserAnswers({});
    setIsSubmitted(false);
    setCurrentQIndex(0);
    setIsRemedialMode(false);
    setIsRemedialSubmitted(false);
  };

  const startRemedialPractice = () => {
    setIsRemedialMode(true);
    setRemedialAnswers({});
    setIsRemedialSubmitted(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in" id="final_assessment_section">
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-rose-100">
            <span>📝 PHẦN F</span>
            <span>•</span>
            <span>ĐÁNH GIÁ NĂNG LỰC CUỐI BÀI</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Bài Kiểm Tra Chuẩn Đầu Ra (10 Câu)
          </h1>
          <p className="text-rose-100 text-sm sm:text-base max-w-2xl">
            Phân bố chuẩn: 3 Nhận biết + 3 Thông hiểu + 2 Vận dụng + 2 Vận dụng cao.
            <br />
            <strong className="text-amber-300">Tiêu chuẩn cấp Chứng nhận: Đạt 100% (10/10)</strong>
          </p>
        </div>
        <div className="absolute right-4 bottom-[-10px] opacity-15 text-8xl pointer-events-none">
          🎓
        </div>
      </div>

      {/* ================= NORMAL EXAM VIEW ================= */}
      {!isSubmitted && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          {/* Question Navigator Bubbles */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-4">
            {examQuestions.map((q, idx) => {
              const isCurrent = idx === currentQIndex;
              const hasAnswered = userAnswers[idx] !== undefined;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQIndex(idx)}
                  className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                    isCurrent
                      ? "bg-indigo-600 text-white ring-2 ring-indigo-300 shadow-xs"
                      : hasAnswered
                      ? "bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-slate-200"
                  }`}
                  id={`exam_bubble_${idx}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Current Question Info */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">
              Câu {currentQIndex + 1} / {examQuestions.length} •{" "}
              <span className="text-indigo-600 dark:text-indigo-400">
                {currentQ.level === "nhan_biet"
                  ? "Nhận biết"
                  : currentQ.level === "thong_hieu"
                  ? "Thông hiểu"
                  : currentQ.level === "van_dung"
                  ? "Vận dụng"
                  : "Vận dụng cao"}
              </span>
            </span>

            <span className="text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full">
              {SKILL_LABELS[currentQ.skill]}
            </span>
          </div>

          <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
            {currentQ.content}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options?.map((opt, idx) => {
              const optStr = idx.toString();
              const isSelected = userAnswers[currentQIndex] === optStr;

              return (
                <button
                  key={idx}
                  onClick={() =>
                    setUserAnswers((prev) => ({ ...prev, [currentQIndex]: optStr }))
                  }
                  className={`w-full p-4 rounded-2xl border text-left font-medium text-sm sm:text-base transition-all flex items-center space-x-3 ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 ring-2 ring-indigo-500/20"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300"
                  }`}
                  id={`exam_opt_${currentQIndex}_${idx}`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl border flex items-center justify-center text-xs font-bold ${
                      isSelected
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "border-slate-300 text-slate-500"
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="text-slate-800 dark:text-slate-200">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation & Submit Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
            <button
              onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQIndex === 0}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl disabled:opacity-30"
            >
              ← Câu trước
            </button>

            {currentQIndex < examQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentQIndex((prev) => prev + 1)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-all"
              >
                Câu tiếp theo →
              </button>
            ) : (
              <button
                onClick={handleSubmitExam}
                disabled={Object.keys(userAnswers).length < examQuestions.length}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white font-black px-7 py-3 rounded-2xl shadow-md text-sm transition-all"
                id="exam_submit_all_btn"
              >
                NỘP BÀI KIỂM TRA
              </button>
            )}
          </div>
        </div>
      )}

      {/* ================= EXAM RESULTS SUMMARY ================= */}
      {isSubmitted && !isRemedialMode && (
        <div className="space-y-6">
          {/* Result Score Card */}
          <div
            className={`p-6 sm:p-8 rounded-3xl border shadow-md text-center space-y-4 ${
              correctCount === totalQuestions
                ? "bg-gradient-to-b from-emerald-500/10 to-teal-500/20 border-emerald-300 dark:border-emerald-800"
                : "bg-gradient-to-b from-rose-500/10 to-amber-500/20 border-rose-300 dark:border-rose-800"
            }`}
            id="exam_result_card"
          >
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-3xl shadow-sm bg-white dark:bg-slate-800">
              {correctCount === totalQuestions ? "🏆" : "📈"}
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {correctCount === totalQuestions
                  ? "XUẤT SẮC ĐẠT 100% ĐIỂM SỐ!"
                  : `Kết quả: ${correctCount} / ${totalQuestions} Câu đúng (${scorePercent}%)`}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
                {correctCount === totalQuestions
                  ? "Chúc mừng em đã làm chủ trọn vẹn kiến thức Ước chung & ƯCLN. Giấy chứng nhận danh giá đã sẵn sàng!"
                  : "Chưa đạt 100% để cấp chứng nhận. Hệ thống đã phân tích lỗi sai và chuẩn bị bài luyện củng cố cho em bên dưới!"}
              </p>
            </div>

            {correctCount === totalQuestions ? (
              <div className="pt-3">
                <button
                  onClick={onGoToCertificate}
                  className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-base px-8 py-3.5 rounded-2xl shadow-xl transition-all transform active:scale-95 flex items-center space-x-2 mx-auto"
                  id="exam_view_cert_btn"
                >
                  <Award className="w-5 h-5" />
                  <span>XEM GIẤY CHỨNG NHẬN HOÀN THÀNH</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  onClick={startRemedialPractice}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-md flex items-center space-x-2"
                  id="exam_start_remedial_btn"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Luyện 3 câu bổ trợ kỹ năng yếu</span>
                </button>

                <button
                  onClick={handleRetakeExam}
                  className="bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold text-sm px-6 py-3 rounded-2xl flex items-center space-x-2"
                  id="exam_retake_btn"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Làm lại bài kiểm tra 10 câu</span>
                </button>
              </div>
            )}
          </div>

          {/* Diagnostic Error Breakdown (If not 100%) */}
          {wrongSkills.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 space-y-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-rose-500" />
                <span>Phân tích chẩn đoán kỹ năng cần cải thiện:</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {wrongSkills.map((sk) => (
                  <div
                    key={sk}
                    className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs sm:text-sm text-rose-900 dark:text-rose-200 flex items-center justify-between"
                  >
                    <div>
                      <strong className="block text-rose-800 dark:text-rose-300">
                        {SKILL_LABELS[sk]}
                      </strong>
                      <span className="text-xs text-rose-600 dark:text-rose-400">
                        Học sinh thường quên kiểm tra đầy đủ các ước hoặc tính sai lũy thừa.
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        onOpenAiTutor(
                          `Học sinh cần phân tích sâu kỹ năng: ${SKILL_LABELS[sk]}`,
                          sk
                        )
                      }
                      className="text-xs font-bold bg-white dark:bg-slate-800 border border-rose-300 px-2.5 py-1.5 rounded-lg text-rose-700 hover:bg-rose-100 flex-shrink-0 ml-2"
                    >
                      Hỏi Cô Nhân
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Question Review List */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Chi tiết bài làm từng câu:
            </h3>

            <div className="space-y-4">
              {examQuestions.map((q, idx) => {
                const userAns = userAnswers[idx];
                const isCorrect = userAns === q.correctAnswer;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-2xl border text-sm space-y-2 ${
                      isCorrect
                        ? "bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60"
                        : "bg-rose-50/50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2 font-bold text-slate-900 dark:text-white">
                        <span>{isCorrect ? "✓ Câu " : "✗ Câu "}{idx + 1}:</span>
                        <span>{q.content}</span>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          isCorrect
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {isCorrect ? "Đúng" : "Sai"}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      <strong>Đáp án của em:</strong>{" "}
                      {userAns !== undefined && q.options
                        ? q.options[parseInt(userAns)]
                        : "Chưa chọn"}
                    </div>

                    {!isCorrect && (
                      <div className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold bg-white/70 dark:bg-slate-900/70 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                        👉 <strong>Đáp án đúng:</strong> {q.options?.[parseInt(q.correctAnswer)]}
                        <br />
                        <span className="font-normal text-slate-600 dark:text-slate-300 mt-1 block">
                          <strong>Giải thích:</strong> {q.explanation}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= REMEDIAL BOOSTER PRACTICE VIEW ================= */}
      {isRemedialMode && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
            <div>
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
                Luyện tập củng cố 3 câu
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                Bài tập khắc phục lỗ hổng kiến thức
              </h2>
            </div>
            <button
              onClick={() => setIsRemedialMode(false)}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              Quay lại kết quả
            </button>
          </div>

          <div className="space-y-6">
            {remedialQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 space-y-3"
              >
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  Câu bổ trợ {idx + 1}: {q.content}
                </div>

                <div className="space-y-2">
                  {q.options?.map((opt, optIdx) => {
                    const optStr = optIdx.toString();
                    const isSelected = remedialAnswers[idx] === optStr;

                    return (
                      <button
                        key={optIdx}
                        onClick={() =>
                          setRemedialAnswers((prev) => ({ ...prev, [idx]: optStr }))
                        }
                        disabled={isRemedialSubmitted}
                        className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all ${
                          isSelected
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-300"
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}. {opt}
                      </button>
                    );
                  })}
                </div>

                {isRemedialSubmitted && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-xs text-emerald-900 dark:text-emerald-200">
                    <strong>Giải thích:</strong> {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
            <button
              onClick={handleRetakeExam}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-2xl text-sm transition-all flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Làm lại bài kiểm tra 10 câu để lấy chứng nhận</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
