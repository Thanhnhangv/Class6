import React, { useState } from "react";
import { Sparkles, CheckCircle2, ArrowRight, Layers, HelpCircle, Eye, Star, Info } from "lucide-react";
import confetti from "canvas-confetti";

interface ExploreSectionProps {
  onComplete: () => void;
  onOpenAiTutor: (context: string, skill?: string) => void;
}

export const ExploreSection: React.FC<ExploreSectionProps> = ({ onComplete, onOpenAiTutor }) => {
  const [activeStep, setActiveStep] = useState<number>(1);

  // Step 1: Factors of 24
  const allCandidate24 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 16, 20, 24];
  const trueFactors24 = [1, 2, 3, 4, 6, 8, 12, 24];
  const [selected24, setSelected24] = useState<number[]>([]);
  const [step1Submitted, setStep1Submitted] = useState(false);

  // Step 2: Factors of 36
  const allCandidate36 = [1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 24, 36];
  const trueFactors36 = [1, 2, 3, 4, 6, 9, 12, 18, 36];
  const [selected36, setSelected36] = useState<number[]>([]);
  const [step2Submitted, setStep2Submitted] = useState(false);

  // Step 3 & 4: Venn Diagram & Common Factors
  const [step3Viewed, setStep3Viewed] = useState(false);
  const [selectedGcd, setSelectedGcd] = useState<number | null>(null);
  const [step4Completed, setStep4Completed] = useState(false);

  const toggle24 = (num: number) => {
    if (step1Submitted && is24Correct) return;
    setSelected24((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num].sort((a, b) => a - b)
    );
  };

  const is24Correct =
    selected24.length === trueFactors24.length &&
    trueFactors24.every((n) => selected24.includes(n));

  const toggle36 = (num: number) => {
    if (step2Submitted && is36Correct) return;
    setSelected36((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num].sort((a, b) => a - b)
    );
  };

  const is36Correct =
    selected36.length === trueFactors36.length &&
    trueFactors36.every((n) => selected36.includes(n));

  const handleFinishExplore = () => {
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    onComplete();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in" id="explore_section">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-purple-100">
            <span>🔍 PHẦN B</span>
            <span>•</span>
            <span>KHÁM PHÁ KIẾN THỨC TƯƠNG TÁC</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Truy tìm Ước chung & ƯCLN của 24 và 36
          </h1>
          <p className="text-purple-100 text-sm sm:text-base max-w-2xl">
            Thực hiện 4 hoạt động khám phá để tự tay xây dựng định nghĩa Ước chung và Ước chung lớn nhất.
          </p>
        </div>
        <div className="absolute right-4 bottom-[-10px] opacity-15 text-8xl pointer-events-none">
          🔬
        </div>
      </div>

      {/* Step Stepper Indicator */}
      <div className="grid grid-cols-4 gap-2 bg-white dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
        {[
          { num: 1, title: "HĐ 1: Tìm Ư(24)" },
          { num: 2, title: "HĐ 2: Tìm Ư(36)" },
          { num: 3, title: "HĐ 3: Biểu đồ Ven" },
          { num: 4, title: "HĐ 4: Hình thành ƯC & ƯCLN" },
        ].map((step) => {
          const isDone =
            (step.num === 1 && is24Correct) ||
            (step.num === 2 && is36Correct) ||
            (step.num === 3 && step3Viewed) ||
            (step.num === 4 && step4Completed);
          const isCurrent = activeStep === step.num;

          return (
            <button
              key={step.num}
              onClick={() => setActiveStep(step.num)}
              className={`py-2 px-2 rounded-xl text-xs font-bold text-center transition-all flex flex-col items-center space-y-1 ${
                isCurrent
                  ? "bg-indigo-600 text-white shadow-xs"
                  : isDone
                  ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50"
              }`}
            >
              <span>{isDone ? "✓ " + step.title : step.title}</span>
            </button>
          );
        })}
      </div>

      {/* ================= STEP 1: FACTORS OF 24 ================= */}
      {activeStep === 1 && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="space-y-2">
            <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
              Hoạt động 1
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Tìm tất cả các ước của số 24
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Hãy bấm chọn tất cả các số mà <strong>24 chia hết</strong> (không dư):
            </p>
          </div>

          {/* Number chips grid */}
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
            {allCandidate24.map((num) => {
              const isSelected = selected24.includes(num);
              const isCorrectItem = trueFactors24.includes(num);
              let itemStyle = "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-indigo-400";
              if (isSelected) {
                if (step1Submitted) {
                  itemStyle = isCorrectItem
                    ? "bg-emerald-500 text-white border-emerald-600 ring-2 ring-emerald-300"
                    : "bg-rose-500 text-white border-rose-600";
                } else {
                  itemStyle = "bg-indigo-600 text-white border-indigo-700 shadow-sm";
                }
              }

              return (
                <button
                  key={num}
                  onClick={() => toggle24(num)}
                  className={`h-14 rounded-2xl border font-black text-lg flex items-center justify-center transition-all transform active:scale-95 ${itemStyle}`}
                >
                  {num}
                </button>
              );
            })}
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">
              Tập hợp em đã chọn: <strong>Ư(24) = &#123;{selected24.join("; ")}&#125;</strong>
            </span>
            <span className="text-xs font-bold text-indigo-600">
              Đã chọn: {selected24.length} / 8 số
            </span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => onOpenAiTutor("Cách tìm tất cả các ước của một số tự nhiên (VD số 24)", "tim_uoc")}
              className="text-xs text-indigo-600 font-bold hover:underline flex items-center space-x-1"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Gợi ý cách tìm ước của 24</span>
            </button>

            <button
              onClick={() => {
                setStep1Submitted(true);
                if (is24Correct) {
                  setTimeout(() => setActiveStep(2), 600);
                }
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-2xl shadow-md flex items-center space-x-2 text-sm transition-all"
            >
              <span>{is24Correct ? "Đúng rồi! Sang HĐ 2" : "Kiểm tra HĐ 1"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {step1Submitted && !is24Correct && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl text-rose-800 dark:text-rose-200 text-sm">
              💡 <strong>Chưa chính xác:</strong> Em hãy nhớ chia 24 lần lượt cho các số từ 1 đến 24.
              Các ước đúng của 24 là: <strong>&#123;1; 2; 3; 4; 6; 8; 12; 24&#125;</strong> (gồm 8 ước). Em chọn lại nhé!
            </div>
          )}
        </div>
      )}

      {/* ================= STEP 2: FACTORS OF 36 ================= */}
      {activeStep === 2 && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="space-y-2">
            <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
              Hoạt động 2
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Tìm tất cả các ước của số 36
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Hãy bấm chọn tất cả các số mà <strong>36 chia hết</strong>:
            </p>
          </div>

          {/* Number chips grid */}
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
            {allCandidate36.map((num) => {
              const isSelected = selected36.includes(num);
              const isCorrectItem = trueFactors36.includes(num);
              let itemStyle = "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-purple-400";
              if (isSelected) {
                if (step2Submitted) {
                  itemStyle = isCorrectItem
                    ? "bg-emerald-500 text-white border-emerald-600 ring-2 ring-emerald-300"
                    : "bg-rose-500 text-white border-rose-600";
                } else {
                  itemStyle = "bg-purple-600 text-white border-purple-700 shadow-sm";
                }
              }

              return (
                <button
                  key={num}
                  onClick={() => toggle36(num)}
                  className={`h-14 rounded-2xl border font-black text-lg flex items-center justify-center transition-all transform active:scale-95 ${itemStyle}`}
                >
                  {num}
                </button>
              );
            })}
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">
              Tập hợp em đã chọn: <strong>Ư(36) = &#123;{selected36.join("; ")}&#125;</strong>
            </span>
            <span className="text-xs font-bold text-purple-600">
              Đã chọn: {selected36.length} / 9 số
            </span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => onOpenAiTutor("Cách tìm tất cả các ước của 36", "tim_uoc")}
              className="text-xs text-purple-600 font-bold hover:underline flex items-center space-x-1"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Gợi ý cách tìm ước của 36</span>
            </button>

            <button
              onClick={() => {
                setStep2Submitted(true);
                if (is36Correct) {
                  setTimeout(() => setActiveStep(3), 600);
                }
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-2xl shadow-md flex items-center space-x-2 text-sm transition-all"
            >
              <span>{is36Correct ? "Đúng rồi! Sang Biểu đồ Ven" : "Kiểm tra HĐ 2"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {step2Submitted && !is36Correct && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl text-rose-800 dark:text-rose-200 text-sm">
              💡 <strong>Chưa chính xác:</strong> Các ước đúng của 36 là: <strong>&#123;1; 2; 3; 4; 6; 9; 12; 18; 36&#125;</strong> (gồm 9 ước). Em chọn lại nhé!
            </div>
          )}
        </div>
      )}

      {/* ================= STEP 3: VENN DIAGRAM COMPARISON ================= */}
      {activeStep === 3 && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="space-y-2">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
              Hoạt động 3
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              So sánh hai tập hợp bằng Biểu đồ Ven
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Quan sát phần giao thoa giữa hai tập hợp ước của 24 và 36:
            </p>
          </div>

          {/* Interactive Venn Diagram Graphic */}
          <div className="bg-gradient-to-b from-slate-50 to-indigo-50/40 dark:from-slate-900 dark:to-indigo-950/30 p-6 sm:p-8 rounded-3xl border border-indigo-100 dark:border-indigo-900/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Left Circle: Only in 24 */}
              <div className="bg-blue-100/70 dark:bg-blue-950/50 border-2 border-dashed border-blue-400 rounded-3xl p-5 text-center space-y-3">
                <div className="font-extrabold text-blue-800 dark:text-blue-300 text-base">
                  Chỉ là ước của 24
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {[8, 24].map((n) => (
                    <span
                      key={n}
                      className="w-10 h-10 rounded-full bg-blue-500 text-white font-bold text-sm flex items-center justify-center shadow-xs"
                    >
                      {n}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Ư(24) có nhưng Ư(36) không có
                </p>
              </div>

              {/* Center Intersection: COMMON FACTORS */}
              <div className="bg-gradient-to-tr from-amber-200 to-amber-100 dark:from-amber-950/80 dark:to-amber-900/60 border-2 border-amber-500 rounded-3xl p-6 text-center space-y-3 shadow-md ring-4 ring-amber-400/20 transform md:scale-105">
                <div className="inline-flex items-center space-x-1 bg-amber-500 text-white text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  <Star className="w-3.5 h-3.5" />
                  <span>Ước Chung • ƯC(24, 36)</span>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {[1, 2, 3, 4, 6, 12].map((n) => (
                    <span
                      key={n}
                      className={`w-11 h-11 rounded-2xl font-black text-base flex items-center justify-center shadow-sm ${
                        n === 12
                          ? "bg-rose-600 text-white ring-2 ring-rose-300 animate-pulse"
                          : "bg-white dark:bg-slate-800 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700"
                      }`}
                    >
                      {n}
                    </span>
                  ))}
                </div>
                <p className="text-xs font-bold text-amber-900 dark:text-amber-300">
                  Xuất hiện ở CẢ HAI tập hợp!
                </p>
              </div>

              {/* Right Circle: Only in 36 */}
              <div className="bg-purple-100/70 dark:bg-purple-950/50 border-2 border-dashed border-purple-400 rounded-3xl p-5 text-center space-y-3">
                <div className="font-extrabold text-purple-800 dark:text-purple-300 text-base">
                  Chỉ là ước của 36
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {[9, 18, 36].map((n) => (
                    <span
                      key={n}
                      className="w-10 h-10 rounded-full bg-purple-500 text-white font-bold text-sm flex items-center justify-center shadow-xs"
                    >
                      {n}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  Ư(36) có nhưng Ư(24) không có
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => onOpenAiTutor("Giải thích biểu đồ Ven thể hiện Ước chung", "tim_uoc_chung")}
              className="text-xs text-indigo-600 font-bold hover:underline flex items-center space-x-1"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Hỏi Cô Nhân về Biểu đồ Ven</span>
            </button>

            <button
              onClick={() => {
                setStep3Viewed(true);
                setActiveStep(4);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-2xl shadow-md flex items-center space-x-2 text-sm transition-all"
            >
              <span>Tiếp tục rút ra Kết luận (HĐ 4)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 4: FORMING CONCEPTS ================= */}
      {activeStep === 4 && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="space-y-2">
            <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
              Hoạt động 4
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Đúc kết định nghĩa Ước chung & Ước chung lớn nhất
            </h2>
          </div>

          {/* Interactive Question */}
          <div className="bg-indigo-50/80 dark:bg-indigo-950/40 p-5 rounded-2xl border border-indigo-200 dark:border-indigo-900/50 space-y-4">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Nhìn vào tập hợp các ước chung <code className="text-indigo-600 font-mono">ƯC(24, 36) = &#123;1; 2; 3; 4; 6; 12&#125;</code>:
              <br />
              👉 Số nào là <strong>SỐ LỚN NHẤT</strong> trong tập hợp này?
            </p>

            <div className="flex flex-wrap gap-3">
              {[1, 4, 6, 12, 24, 36].map((val) => (
                <button
                  key={val}
                  onClick={() => {
                    setSelectedGcd(val);
                    if (val === 12) setStep4Completed(true);
                  }}
                  className={`px-5 py-3 rounded-xl font-black text-base border transition-all ${
                    selectedGcd === val
                      ? val === 12
                        ? "bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-300"
                        : "bg-rose-500 text-white border-rose-600"
                      : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-400"
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>

            {selectedGcd === 12 && (
              <div className="p-4 bg-emerald-100 dark:bg-emerald-950/60 rounded-xl border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-sm space-y-1 animate-fade-in">
                <div className="font-extrabold flex items-center space-x-1.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Chính xác! Số 12 là số lớn nhất trong các ước chung!</span>
                </div>
                <p>
                  Số 12 được gọi là <strong>Ước chung lớn nhất của 24 và 36</strong>. Ký hiệu là:{" "}
                  <code className="bg-white/80 dark:bg-slate-900 px-2 py-0.5 rounded font-mono font-bold text-emerald-700">
                    ƯCLN(24, 36) = 12
                  </code>
                </p>
              </div>
            )}
          </div>

          {/* Formed Definitions Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-950/40 p-5 rounded-2xl border border-blue-200 dark:border-blue-900/50 space-y-2">
              <h3 className="font-extrabold text-blue-900 dark:text-blue-300 flex items-center space-x-2">
                <span>📘 1. Ước chung (ƯC)</span>
              </h3>
              <p className="text-xs sm:text-sm text-blue-950 dark:text-blue-100 leading-relaxed">
                Số x được gọi là <strong>ước chung</strong> của hai số a và b nếu x vừa là ước của a, vừa là ước của b (a ⋮ x và b ⋮ x).
              </p>
              <div className="text-xs font-mono bg-white dark:bg-slate-900 p-2 rounded-lg text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                x ∈ ƯC(a, b) nếu a ⋮ x và b ⋮ x
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/40 p-5 rounded-2xl border border-amber-200 dark:border-amber-900/50 space-y-2">
              <h3 className="font-extrabold text-amber-900 dark:text-amber-300 flex items-center space-x-2">
                <span>👑 2. Ước chung lớn nhất (ƯCLN)</span>
              </h3>
              <p className="text-xs sm:text-sm text-amber-950 dark:text-amber-100 leading-relaxed">
                <strong>Ước chung lớn nhất</strong> của hai hay nhiều số là <strong>số lớn nhất</strong> trong tập hợp các ước chung của các số đó.
              </p>
              <div className="text-xs font-mono bg-white dark:bg-slate-900 p-2 rounded-lg text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                ƯCLN(a, b) = max&#123;ƯC(a, b)&#125;
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
            <div className="text-xs text-emerald-600 font-bold flex items-center space-x-1">
              <Sparkles className="w-4 h-4" />
              <span>+20 XP Khám phá kiến thức</span>
            </div>

            <button
              onClick={handleFinishExplore}
              disabled={selectedGcd !== 12}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white font-bold px-7 py-3 rounded-2xl shadow-md flex items-center space-x-2 text-sm transition-all"
              id="explore_finish_btn"
            >
              <span>Hoàn thành & Sang Hình thành kiến thức</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
