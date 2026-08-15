import React, { useState } from "react";
import { Sparkles, ArrowRight, HelpCircle, CheckCircle2, AlertCircle, Gift, BookOpen, PenTool, RefreshCw } from "lucide-react";

interface WarmupSectionProps {
  onComplete: () => void;
  onOpenAiTutor: (context: string, skill?: string) => void;
}

export const WarmupSection: React.FC<WarmupSectionProps> = ({ onComplete, onOpenAiTutor }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [studentNote, setStudentNote] = useState("");
  const [previewDivisions, setPreviewDivisions] = useState<number>(12);

  const options = [
    {
      id: "opt_6",
      value: "6",
      label: "6 phần quà",
      isBest: false,
      feedback: "6 phần quà chia được (mỗi phần 4 vở, 6 bút), nhưng ĐÃ PHẢI LÀ NHIỀU NHẤT CHƯA nhỉ?",
      scaffolding: "Em thử tìm những số lớn hơn 6 mà vừa chia hết 24 vừa chia hết 36 xem nào!",
    },
    {
      id: "opt_12",
      value: "12",
      label: "12 phần quà",
      isBest: true,
      feedback: "Chính xác tuyệt vời! 24 : 12 = 2 quyển vở và 36 : 12 = 3 chiếc bút mỗi phần. Không có số nào lớn hơn 12 mà cả 24 và 36 cùng chia hết!",
      scaffolding: "",
    },
    {
      id: "opt_24",
      value: "24",
      label: "24 phần quà",
      isBest: false,
      feedback: "24 chia hết cho 24 (1 vở/phần), nhưng 36 bút chia 24 phần sẽ bị dư (36 : 24 = 1 dư 12) nên không đều!",
      scaffolding: "Nhớ rằng cả 24 vở và 36 bút đều phải chia hết không thừa em nhé!",
    },
    {
      id: "opt_4",
      value: "4",
      label: "4 phần quà",
      isBest: false,
      feedback: "4 phần quà chia được (6 vở, 9 bút), nhưng đề bài hỏi số phần quà NHIỀU NHẤT!",
      scaffolding: "Có số lớn hơn 4 cùng chia hết cho cả 24 và 36 đấy, em tìm thử nhé!",
    },
  ];

  const currentOption = options.find((o) => o.value === selectedAnswer);

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    setHasSubmitted(true);
    if (selectedAnswer === "12") {
      onComplete();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in" id="warmup_section">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-blue-100">
            <span>🚀 PHẦN A</span>
            <span>•</span>
            <span>KHỞI ĐỘNG VÀ ĐẶT VẤN ĐỀ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Tình huống chia quà của Cô Nhân
          </h1>
          <p className="text-blue-100 text-sm sm:text-base max-w-2xl">
            Hãy cùng phân tích một tình huống thực tế để phát hiện ra quy luật toán học kỳ diệu!
          </p>
        </div>
        <div className="absolute right-4 bottom-[-10px] opacity-15 text-8xl pointer-events-none">
          🎁
        </div>
      </div>

      {/* Real-world Problem Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-2xl flex-shrink-0">
            👩‍🏫
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Tình huống lớp học:
            </h2>
            <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-4 text-slate-800 dark:text-slate-200 text-base leading-relaxed">
              “Cô Nhân chuẩn bị khen thưởng các bạn học sinh có thành tích tốt. Cô có sẵn{" "}
              <strong className="text-indigo-600 dark:text-indigo-400 font-extrabold">24 quyển vở</strong> và{" "}
              <strong className="text-purple-600 dark:text-purple-400 font-extrabold">36 chiếc bút</strong>. Cô muốn chia tất cả số vở và bút thành các phần quà <strong>giống hệt nhau</strong> (mỗi phần quà có số vở như nhau và số bút như nhau, không thừa món nào).
              <br />
              <span className="text-amber-800 dark:text-amber-300 font-bold block mt-2">
                ❓ Hỏi: Cô Nhân có thể chia được NHIỀU NHẤT thành bao nhiêu phần quà?”
              </span>
            </div>
          </div>
        </div>

        {/* Visual Gift Division Simulator */}
        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Gift className="w-5 h-5 text-indigo-500" />
              <span className="font-bold text-sm text-slate-700 dark:text-slate-300">
                Mô phỏng thử chia quà trực quan:
              </span>
            </div>
            <div className="flex items-center space-x-1">
              {[2, 3, 4, 6, 12, 24].map((num) => (
                <button
                  key={num}
                  onClick={() => setPreviewDivisions(num)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-all ${
                    previewDivisions === num
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                  }`}
                >
                  {num} phần
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📘</span>
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">24 Quyển vở</div>
                  <div className="text-xs text-slate-500">
                    24 chia {previewDivisions} phần ={" "}
                    <strong>{Math.floor(24 / previewDivisions)}</strong> vở/phần{" "}
                    {24 % previewDivisions !== 0 && (
                      <span className="text-rose-500 font-bold">(dư {24 % previewDivisions})</span>
                    )}
                  </div>
                </div>
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                  24 % previewDivisions === 0
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                    : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                }`}
              >
                {24 % previewDivisions === 0 ? "Chia hết ✓" : "Không đều ✗"}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">✏️</span>
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">36 Chiếc bút</div>
                  <div className="text-xs text-slate-500">
                    36 chia {previewDivisions} phần ={" "}
                    <strong>{Math.floor(36 / previewDivisions)}</strong> bút/phần{" "}
                    {36 % previewDivisions !== 0 && (
                      <span className="text-rose-500 font-bold">(dư {36 % previewDivisions})</span>
                    )}
                  </div>
                </div>
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                  36 % previewDivisions === 0
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                    : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                }`}
              >
                {36 % previewDivisions === 0 ? "Chia hết ✓" : "Không đều ✗"}
              </span>
            </div>
          </div>
        </div>

        {/* Prediction Options */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
            Dự đoán và lựa chọn của em:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="warmup_options_grid">
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  setSelectedAnswer(opt.value);
                  setHasSubmitted(false);
                }}
                className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  selectedAnswer === opt.value
                    ? "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 ring-2 ring-indigo-500/20"
                    : "border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-800 bg-white dark:bg-slate-800"
                }`}
                id={`warmup_opt_${opt.value}`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold ${
                      selectedAnswer === opt.value
                        ? "border-indigo-600 bg-indigo-600 text-white"
                        : "border-slate-300 text-slate-400"
                    }`}
                  >
                    {opt.value}
                  </div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-base">
                    {opt.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Student Explanation Input */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">
            Giải thích ngắn gọn suy nghĩ của em (Tùy chọn):
          </label>
          <input
            type="text"
            value={studentNote}
            onChange={(e) => setStudentNote(e.target.value)}
            placeholder="Ví dụ: Em thấy 12 là số lớn nhất mà 24 và 36 đều chia hết..."
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
            id="warmup_explanation_input"
          />
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() =>
              onOpenAiTutor(
                "Có 24 quyển vở và 36 chiếc bút chia thành các phần đều nhau, nhiều nhất bao nhiêu phần?",
                "tim_ucln_liet_ke"
              )
            }
            className="inline-flex items-center space-x-1.5 text-indigo-600 hover:text-indigo-700 font-semibold text-xs py-2 px-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
            id="warmup_ask_ai_btn"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Hỏi Cô Nhân gợi ý</span>
          </button>

          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-2xl shadow-md flex items-center space-x-2 transition-all"
            id="warmup_submit_btn"
          >
            <span>Kiểm tra kết quả</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Feedback Section */}
        {hasSubmitted && currentOption && (
          <div
            className={`p-5 rounded-2xl border transition-all space-y-3 ${
              currentOption.isBest
                ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
                : "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200"
            }`}
            id="warmup_feedback_box"
          >
            <div className="flex items-start space-x-3">
              {currentOption.isBest ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <h4 className="font-bold text-base">
                  {currentOption.isBest ? "🎉 Xuất sắc! Em đã dự đoán hoàn toàn chính xác!" : "💡 Gợi mở từ Cô Nhân:"}
                </h4>
                <p className="text-sm leading-relaxed">{currentOption.feedback}</p>
                {!currentOption.isBest && currentOption.scaffolding && (
                  <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mt-2 bg-white/70 dark:bg-slate-900/60 p-3 rounded-xl border border-amber-200 dark:border-amber-900">
                    🔍 {currentOption.scaffolding}
                  </p>
                )}
              </div>
            </div>

            {currentOption.isBest && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={onComplete}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-sm flex items-center space-x-2 text-sm"
                  id="warmup_next_btn"
                >
                  <span>Chuyển sang Khám Phá Kiến Thức</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
