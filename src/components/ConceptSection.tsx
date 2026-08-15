import React, { useState } from "react";
import { BookOpen, CheckCircle2, HelpCircle, ArrowRight, Sparkles, Key, Zap, Check, AlertTriangle, Divide } from "lucide-react";

interface ConceptSectionProps {
  onComplete: () => void;
  onOpenAiTutor: (context: string, skill?: string) => void;
}

export const ConceptSection: React.FC<ConceptSectionProps> = ({ onComplete, onOpenAiTutor }) => {
  const [activeTab, setActiveTab] = useState<"rule" | "special" | "application">("rule");
  const [understood, setUnderstood] = useState(false);

  const handleUnderstand = () => {
    setUnderstood(true);
    onComplete();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in" id="concept_section">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-600 via-indigo-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-teal-100">
            <span>📖 PHẦN C</span>
            <span>•</span>
            <span>HÌNH THÀNH KIẾN THỨC TRỌNG TÂM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Quy Tắc Tìm ƯCLN & Ứng Dụng Thực Tiễn
          </h1>
          <p className="text-teal-100 text-sm sm:text-base max-w-2xl">
            Nắm vững phương pháp phân tích thừa số nguyên tố chuẩn SGK Kết nối tri thức.
          </p>
        </div>
        <div className="absolute right-4 bottom-[-10px] opacity-15 text-8xl pointer-events-none">
          📐
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex space-x-2 bg-white dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
        <button
          onClick={() => setActiveTab("rule")}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all ${
            activeTab === "rule"
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50"
          }`}
          id="concept_tab_rule"
        >
          <Key className="w-4 h-4" />
          <span>1. Quy tắc 3 bước (TSNT)</span>
        </button>

        <button
          onClick={() => setActiveTab("special")}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all ${
            activeTab === "special"
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50"
          }`}
          id="concept_tab_special"
        >
          <Zap className="w-4 h-4" />
          <span>2. Các trường hợp đặc biệt</span>
        </button>

        <button
          onClick={() => setActiveTab("application")}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all ${
            activeTab === "application"
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50"
          }`}
          id="concept_tab_application"
        >
          <Divide className="w-4 h-4" />
          <span>3. Ứng dụng: Rút gọn phân số</span>
        </button>
      </div>

      {/* ================= TAB 1: 3-STEP PRIME FACTORIZATION RULE ================= */}
      {activeTab === "rule" && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Kiến thức cốt lõi
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Quy tắc tìm ƯCLN bằng cách phân tích ra thừa số nguyên tố
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Muốn tìm ƯCLN của hai hay nhiều số lớn hơn 1, ta thực hiện theo 3 bước sau:
            </p>
          </div>

          {/* 3 Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-indigo-50/70 dark:bg-indigo-950/40 p-5 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                1
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Bước 1: Phân tích
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Phân tích mỗi số đã cho ra <strong>thừa số nguyên tố</strong>.
              </p>
              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl text-xs font-mono border border-indigo-100 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300">
                VD: 36 = 2² · 3²
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;84 = 2² · 3 · 7
              </div>
            </div>

            <div className="bg-purple-50/70 dark:bg-purple-950/40 p-5 rounded-2xl border border-purple-200 dark:border-purple-900/60 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                2
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Bước 2: Chọn thừa số chung
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Chọn ra các thừa số nguyên tố <strong>CHUNG</strong> (có mặt ở tất cả các số).
              </p>
              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl text-xs font-mono border border-purple-100 dark:border-purple-900 text-purple-700 dark:text-purple-300">
                Thừa số chung: <strong>2 và 3</strong>
                <br />
                <span className="text-rose-500">(Bỏ thừa số riêng 7)</span>
              </div>
            </div>

            <div className="bg-emerald-50/70 dark:bg-emerald-950/40 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                3
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Bước 3: Lập tích số mũ nhỏ nhất
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Lập tích các thừa số đã chọn, mỗi thừa số lấy với số mũ <strong>NHỎ NHẤT</strong>.
              </p>
              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl text-xs font-mono border border-emerald-100 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 font-bold">
                ƯCLN(36, 84) = 2² · 3¹ = 12
              </div>
            </div>
          </div>

          {/* Interactive Worked Example */}
          <div className="bg-slate-50 dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
              <span>💡 Ví dụ mẫu: Tìm ƯCLN(18, 30, 42)</span>
            </h4>
            <div className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 pl-2">
              <p>• <strong>Bước 1:</strong> 18 = 2 · 3² ; 30 = 2 · 3 · 5 ; 42 = 2 · 3 · 7</p>
              <p>• <strong>Bước 2:</strong> Các thừa số nguyên tố chung là <strong>2 và 3</strong>.</p>
              <p>• <strong>Bước 3:</strong> Số mũ nhỏ nhất của 2 là 1, của 3 là 1.</p>
              <p className="text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/60 p-2.5 rounded-xl border border-indigo-200 dark:border-indigo-900">
                👉 Kết luận: ƯCLN(18, 30, 42) = 2¹ · 3¹ = 6.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: SPECIAL CASES & PROPERTIES ================= */}
      {activeTab === "special" && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Mẹo & Tính chất quan trọng
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Các trường hợp đặc biệt cần ghi nhớ
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Case 1 */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 space-y-2">
              <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                <span>⚡ Trường hợp chia hết: a ⋮ b</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                Nếu số lớn chia hết cho số nhỏ (a ⋮ b), thì ƯCLN chính là <strong>số nhỏ</strong>:
              </p>
              <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900">
                ƯCLN(24, 8) = 8 (vì 24 ⋮ 8)
                <br />
                ƯCLN(a, b) = b nếu a ⋮ b
              </div>
            </div>

            {/* Case 2: Coprime */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 space-y-2">
              <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
                <span>🌟 Hai số nguyên tố cùng nhau</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                Hai số có <strong>ƯCLN = 1</strong> gọi là hai số nguyên tố cùng nhau:
              </p>
              <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl font-mono text-xs font-bold text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-900">
                ƯCLN(8, 9) = 1 → 8 và 9 nguyên tố cùng nhau
                <br />
                <span className="text-slate-500 font-normal">(Dù 8 và 9 đều là hợp số)</span>
              </div>
            </div>

            {/* Case 3: Find Common Divisors via GCD */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 space-y-2 md:col-span-2">
              <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                <span>🔗 Cách tìm ƯC thông qua ƯCLN (Rất nhanh!)</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                Tất cả các ước chung của a và b đều là ước của ƯCLN(a, b). Để tìm ƯC(a, b), ta chỉ cần tìm tập hợp các ước của ƯCLN(a, b):
              </p>
              <div className="bg-white dark:bg-slate-800 p-3 rounded-xl font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900">
                ƯC(a, b) = Ư(ƯCLN(a, b))
                <br />
                <span className="text-slate-600 dark:text-slate-400 font-normal">
                  VD: ƯCLN(24, 36) = 12 → ƯC(24, 36) = Ư(12) = &#123;1; 2; 3; 4; 6; 12&#125;.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: APPLICATION (FRACTION REDUCTION) ================= */}
      {activeTab === "application" && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Ứng dụng thực tế
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Rút gọn phân số về phân số tối giản
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Muốn rút gọn một phân số về phân số tối giản chỉ trong <strong>1 bước duy nhất</strong>, ta chia cả tử và mẫu cho ƯCLN của chúng!
            </p>
          </div>

          <div className="bg-indigo-50/70 dark:bg-indigo-950/40 p-6 rounded-3xl border border-indigo-200 dark:border-indigo-900/60 space-y-4 text-center">
            <div className="inline-flex items-center justify-center space-x-4 text-lg sm:text-2xl font-mono font-bold text-indigo-900 dark:text-indigo-200">
              <span>36 / 48</span>
              <span className="text-indigo-400">→ (Chia cho ƯCLN = 12) →</span>
              <span className="bg-emerald-500 text-white px-4 py-1 rounded-xl shadow-xs">3 / 4</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Vì ƯCLN(36, 48) = 12, nên 36:12 = 3 và 48:12 = 4. Phân số 3/4 là phân số tối giản.
            </p>
          </div>
        </div>
      )}

      {/* Comprehension Check / Ask AI Tutor Section */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg font-bold">Mức độ thấu hiểu của em:</h3>
          <p className="text-xs text-slate-300">
            Nếu còn chỗ nào chưa rõ, đừng ngần ngại bấm để Cô AI Nhân giảng giải lại bằng ví dụ khác nhé!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() =>
              onOpenAiTutor(
                "Quy tắc 3 bước tìm ƯCLN bằng phân tích ra thừa số nguyên tố và các mẹo đặc biệt",
                "tim_ucln_tsnt"
              )
            }
            className="px-4 py-2.5 rounded-xl border border-indigo-400/50 hover:bg-white/10 text-xs font-bold text-indigo-200 flex items-center space-x-1.5 transition-all"
            id="concept_need_explanation_btn"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>Em cần giải thích thêm</span>
          </button>

          <button
            onClick={handleUnderstand}
            className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-sm flex items-center space-x-2 shadow-lg transition-all transform active:scale-95"
            id="concept_understood_btn"
          >
            <CheckCircle2 className="w-4 h-4 text-slate-950" />
            <span>Em đã hiểu bài • Sang Luyện tập</span>
          </button>
        </div>
      </div>
    </div>
  );
};
