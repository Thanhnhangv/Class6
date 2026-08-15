import React, { useState } from "react";
import { StudentProfile } from "../types/lms";
import { Award, Printer, Share2, Sparkles, CheckCircle2, Download, ArrowLeft, ShieldCheck, Star } from "lucide-react";
import confetti from "canvas-confetti";

interface CertificateSectionProps {
  student: StudentProfile;
  onBackToDashboard: () => void;
  onUpdateStudentName: (name: string) => void;
}

export const CertificateSection: React.FC<CertificateSectionProps> = ({
  student,
  onBackToDashboard,
  onUpdateStudentName,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(student.name);

  const handlePrint = () => {
    window.print();
  };

  const triggerConfettiAgain = () => {
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.4 } });
  };

  const handleSaveName = () => {
    if (tempName.trim()) {
      onUpdateStudentName(tempName.trim());
      setIsEditingName(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in" id="certificate_section">
      {/* Action Toolbar (Hidden during print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm print:hidden">
        <button
          onClick={onBackToDashboard}
          className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về trang học tập</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={triggerConfettiAgain}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 text-amber-800 dark:text-amber-300 rounded-xl text-xs font-bold border border-amber-200"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Bắn pháo hoa 🎉</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
            id="cert_print_btn"
          >
            <Printer className="w-4 h-4" />
            <span>In / Lưu PDF chứng nhận</span>
          </button>
        </div>
      </div>

      {/* ================= OFFICIAL CERTIFICATE CANVAS ================= */}
      <div
        className="relative bg-gradient-to-br from-amber-50 via-white to-amber-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-3xl p-8 sm:p-12 border-8 border-double border-amber-400 dark:border-amber-600 shadow-2xl overflow-hidden text-center space-y-6"
        id="printable_certificate"
      >
        {/* Decorative corner borders */}
        <div className="absolute top-3 left-3 text-amber-500 text-2xl font-serif">✦</div>
        <div className="absolute top-3 right-3 text-amber-500 text-2xl font-serif">✦</div>
        <div className="absolute bottom-3 left-3 text-amber-500 text-2xl font-serif">✦</div>
        <div className="absolute bottom-3 right-3 text-amber-500 text-2xl font-serif">✦</div>

        {/* Certificate Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-amber-100 dark:bg-amber-950/80 px-4 py-1 rounded-full text-xs font-black text-amber-800 dark:text-amber-300 tracking-widest uppercase border border-amber-300">
            HỆ THỐNG LMS TOÁN THCS • KẾT NỐI TRI THỨC VỚI CUỘC SỐNG
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight uppercase font-serif pt-2">
            GIẤY CHỨNG NHẬN
          </h1>
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-widest">
            HỌC TOÁN CÙNG CÔ NHÂN
          </p>
        </div>

        {/* Certificate Body */}
        <div className="space-y-4 max-w-2xl mx-auto py-2">
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 italic">
            Chứng nhận em:
          </p>

          {isEditingName ? (
            <div className="flex items-center justify-center space-x-2 print:hidden">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="text-2xl font-bold text-center border-b-2 border-indigo-600 bg-transparent px-3 py-1 text-slate-900 dark:text-white focus:outline-none"
              />
              <button
                onClick={handleSaveName}
                className="bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-lg font-bold"
              >
                Lưu
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2 group">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-indigo-900 dark:text-indigo-200 border-b-2 border-amber-400 pb-1 px-6 font-serif">
                {student.name}
              </h2>
              <button
                onClick={() => setIsEditingName(true)}
                className="text-[11px] text-slate-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity print:hidden"
                title="Sửa tên học sinh"
              >
                ✏️
              </button>
            </div>
          )}

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Học sinh Lớp: <strong>{student.grade || "6A1"}</strong> • Trường THCS:{" "}
            <strong>{student.school || "THCS Kết Nối Tri Thức"}</strong>
          </p>

          <div className="bg-white/80 dark:bg-slate-800/80 p-5 rounded-2xl border border-amber-200 dark:border-amber-900/60 text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed shadow-xs">
            Đã hoàn thành xuất sắc toàn diện bài học:
            <br />
            <strong className="text-indigo-700 dark:text-indigo-300 text-lg sm:text-xl font-black block mt-1">
              ƯỚC CHUNG VÀ ƯỚC CHUNG LỚN NHẤT
            </strong>
            <span className="text-xs text-slate-500 block mt-1">
              Đạt chuẩn 100% đầu ra • Vượt qua 4 Màn thử thách thám tử • Làm chủ phương pháp phân tích thừa số nguyên tố
            </span>
          </div>
        </div>

        {/* Badges Ribbon */}
        <div className="flex flex-wrap items-center justify-center gap-3 py-2">
          {student.badges.map((b) => (
            <div
              key={b.id}
              className="flex items-center space-x-1.5 bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700/60 px-3 py-1.5 rounded-full shadow-xs text-xs font-bold text-amber-900 dark:text-amber-200"
            >
              <span className="text-sm">{b.icon}</span>
              <span>{b.name}</span>
            </div>
          ))}
        </div>

        {/* Certificate Footer (Signatures & Verification Code) */}
        <div className="grid grid-cols-2 gap-6 pt-6 border-t border-amber-200 dark:border-slate-700/80 text-xs">
          <div className="text-left space-y-1">
            <div className="text-slate-500 dark:text-slate-400">Mã chứng nhận:</div>
            <div className="font-mono font-bold text-sm text-indigo-700 dark:text-indigo-300">
              {student.certificateId || "CTN-839201"}
            </div>
            <div className="text-slate-500 dark:text-slate-400 text-[11px]">
              Ngày cấp: {student.completionDate || new Date().toLocaleDateString("vi-VN")}
            </div>
          </div>

          <div className="text-right space-y-1">
            <div className="text-slate-500 dark:text-slate-400">Giáo viên phụ trách</div>
            <div className="font-serif italic font-bold text-base text-indigo-900 dark:text-indigo-200">
              Cô Nhân
            </div>
            <div className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-600">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Hệ thống LMS Đã Xác Thực</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
