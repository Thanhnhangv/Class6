import React, { useState, useEffect } from "react";
import { DETECTIVE_GAME_STAGES, GameStage } from "../data/detectiveGameData";
import { StudentProfile } from "../types/lms";
import { Shield, Sparkles, Clock, CheckCircle2, XCircle, HelpCircle, Trophy, Award, ArrowRight, Play, RotateCcw } from "lucide-react";
import confetti from "canvas-confetti";

interface DetectiveGameSectionProps {
  student: StudentProfile;
  onUpdateStudent: (updater: (prev: StudentProfile) => StudentProfile) => void;
  onOpenAiTutor: (context: string) => void;
  onCompleteGame: () => void;
}

export const DetectiveGameSection: React.FC<DetectiveGameSectionProps> = ({
  student,
  onUpdateStudent,
  onOpenAiTutor,
  onCompleteGame,
}) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);

  const stage: GameStage = DETECTIVE_GAME_STAGES[currentStageIndex];

  useEffect(() => {
    let interval: any;
    if (timerEnabled && timeLeft > 0 && !isAnswered) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerEnabled, timeLeft, isAnswered]);

  const selectedOpt = stage.options.find((o) => o.id === selectedOptionId);

  const handleSelectOption = (id: string) => {
    if (isAnswered) return;
    setSelectedOptionId(id);
  };

  const handleVerifyAnswer = () => {
    if (!selectedOptionId || isAnswered) return;
    setIsAnswered(true);

    if (selectedOpt?.isCorrect) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });

      onUpdateStudent((prev) => {
        const completed = [...prev.gameCompletedStages];
        if (!completed.includes(stage.id)) {
          completed.push(stage.id);
        }

        // Unlock badge if exists
        const badges = prev.badges.map((b) => {
          if (b.id === stage.badgeId) {
            return { ...b, isUnlocked: true, unlockedAt: new Date().toLocaleDateString("vi-VN") };
          }
          return b;
        });

        return {
          ...prev,
          xp: prev.xp + stage.rewardXP,
          gameScore: prev.gameScore + stage.rewardXP,
          gameCompletedStages: completed,
          badges,
        };
      });
    }
  };

  const handleNextStage = () => {
    if (currentStageIndex + 1 < DETECTIVE_GAME_STAGES.length) {
      setCurrentStageIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
      setShowHint(false);
      setTimeLeft(45);
    } else {
      // Finished all 4 stages
      onCompleteGame();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in" id="detective_game_section">
      {/* Game Header */}
      <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-amber-100">
            <span>🕵️‍♂️ TRÒ CHƠI HÓA TOÁN HỌC</span>
            <span>•</span>
            <span>MÀN {stage.id} / 4</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            BIỆT ĐỘI THÁM TỬ – TRUY TÌM KHO BÁU
          </h1>
          <p className="text-amber-100 text-sm sm:text-base max-w-2xl">
            Vượt qua 4 ải mật mã số học để giải cứu đồng đội và mở rương kho báu ƯCLN!
          </p>
        </div>
        <div className="absolute right-4 bottom-[-10px] opacity-15 text-8xl pointer-events-none">
          🗺️
        </div>
      </div>

      {/* Stage Navigation & Timer Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
        <div className="flex items-center space-x-2">
          {DETECTIVE_GAME_STAGES.map((st, idx) => {
            const isPassed = student.gameCompletedStages.includes(st.id);
            const isCurrent = idx === currentStageIndex;

            return (
              <button
                key={st.id}
                onClick={() => {
                  setCurrentStageIndex(idx);
                  setSelectedOptionId(null);
                  setIsAnswered(false);
                  setShowHint(false);
                  setTimeLeft(45);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1 transition-all ${
                  isCurrent
                    ? "bg-amber-500 text-white shadow-xs ring-2 ring-amber-300"
                    : isPassed
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                }`}
              >
                <span>{isPassed ? "✓" : `Màn ${st.id}`}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <button
            onClick={() => setTimerEnabled(!timerEnabled)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold border transition-colors ${
              timerEnabled
                ? "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300"
                : "bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{timerEnabled ? `Thời gian: ${timeLeft}s` : "Bật hẹn giờ (Tùy chọn)"}</span>
          </button>

          <span className="font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-900">
            +{stage.rewardXP} XP
          </span>
        </div>
      </div>

      {/* Main Stage Adventure Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        {/* Story Dialogue Box */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-900 dark:to-amber-950/30 p-5 rounded-2xl border border-amber-200 dark:border-amber-900/60 flex items-start space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white text-3xl flex items-center justify-center shadow-md flex-shrink-0">
            {stage.characterAvatar}
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                {stage.character}
              </h3>
              <span className="bg-amber-200 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                {stage.subtitle}
              </span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
              “{stage.story}”
            </p>
          </div>
        </div>

        {/* Challenge Task */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Nhiệm vụ: {stage.taskQuestion}
            </h2>
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-xs font-bold text-amber-600 hover:underline flex items-center space-x-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showHint ? "Ẩn mật thư" : "Mở mật thư gợi ý"}</span>
            </button>
          </div>

          {showHint && (
            <div className="p-4 bg-amber-100/70 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 rounded-2xl text-xs text-amber-900 dark:text-amber-200 animate-fade-in">
              📜 <strong>Mật thư từ Cô Nhân:</strong> {stage.hint}
            </div>
          )}

          {/* Options Grid */}
          <div className="space-y-3 pt-2">
            {stage.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              let btnStyle = "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-amber-400";

              if (isSelected) {
                btnStyle = "border-amber-500 bg-amber-50/70 dark:bg-amber-950/50 ring-2 ring-amber-400/20";
              }

              if (isAnswered) {
                if (opt.isCorrect) {
                  btnStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 ring-2 ring-emerald-400/30 text-emerald-950 dark:text-emerald-100";
                } else if (isSelected && !opt.isCorrect) {
                  btnStyle = "border-rose-500 bg-rose-50 dark:bg-rose-950/60 ring-2 ring-rose-400/30 text-rose-950 dark:text-rose-100";
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-2xl border text-left font-medium text-sm sm:text-base transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold ${
                        isSelected
                          ? "bg-amber-500 text-white border-amber-500"
                          : "border-slate-300 text-slate-400"
                      }`}
                    >
                      ★
                    </div>
                    <span className="text-slate-800 dark:text-slate-200">{opt.text}</span>
                  </div>

                  {isAnswered && (
                    <div>
                      {opt.isCorrect ? (
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
        </div>

        {/* Bottom Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => onOpenAiTutor(`Thám tử Toán học đang giải mã màn ${stage.id}: ${stage.taskQuestion}`)}
            className="text-xs text-indigo-600 font-bold hover:underline flex items-center space-x-1"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Gọi Cô AI Nhân chi viện</span>
          </button>

          {!isAnswered ? (
            <button
              onClick={handleVerifyAnswer}
              disabled={!selectedOptionId}
              className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold px-7 py-3 rounded-2xl shadow-md transition-all text-sm flex items-center space-x-2"
            >
              <span>Giải mã ổ khóa</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleNextStage}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold px-7 py-3 rounded-2xl shadow-md transition-all text-sm flex items-center space-x-2"
            >
              <span>{currentStageIndex + 1 < DETECTIVE_GAME_STAGES.length ? "Màn kế tiếp" : "Hoàn thành toàn bộ Game!"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Feedback Display */}
        {isAnswered && selectedOpt && (
          <div
            className={`p-5 rounded-2xl border transition-all space-y-2 animate-fade-in ${
              selectedOpt.isCorrect
                ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100"
                : "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100"
            }`}
          >
            <div className="flex items-start space-x-3">
              {selectedOpt.isCorrect ? (
                <Trophy className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="font-bold text-base">
                  {selectedOpt.isCorrect
                    ? `🎉 Giải mã thành công! Mở khóa huy hiệu ${stage.badgeName || ""}`
                    : "Cửa chưa mở!"}
                </h4>
                <p className="text-sm leading-relaxed mt-1">{selectedOpt.feedback}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
