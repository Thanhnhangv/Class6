import React, { useState } from "react";
import { MOCK_CLASS_ANALYTICS, MOCK_STUDENT_LIST, ClassAnalytics, StudentAnalytics } from "../data/mockAnalyticsData";
import { Users, TrendingUp, AlertTriangle, CheckCircle2, BookOpen, Send, Sparkles, Filter, Download, MessageSquare, ShieldAlert, Award } from "lucide-react";

interface TeacherDashboardSectionProps {
  onOpenAiTutor: (context: string) => void;
}

export const TeacherDashboardSection: React.FC<TeacherDashboardSectionProps> = ({ onOpenAiTutor }) => {
  const [analytics, setAnalytics] = useState<ClassAnalytics>(MOCK_CLASS_ANALYTICS);
  const [students, setStudents] = useState<StudentAnalytics[]>(MOCK_STUDENT_LIST);
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "learning" | "remedial">("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sentRemedialId, setSentRemedialId] = useState<string | null>(null);

  const filteredStudents = students.filter((s) => {
    if (filterStatus === "completed" && !s.completed) return false;
    if (filterStatus === "learning" && (s.completed || s.needsHelp)) return false;
    if (filterStatus === "remedial" && !s.needsHelp) return false;
    if (searchKeyword && !s.name.toLowerCase().includes(searchKeyword.toLowerCase())) return false;
    return true;
  });

  const handleSendRemedial = (studentId: string) => {
    setSentRemedialId(studentId);
    setTimeout(() => {
      setSentRemedialId(null);
    }, 2500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-fade-in" id="teacher_dashboard_section">
      {/* Teacher Dashboard Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/20 px-3 py-1 rounded-full text-xs font-semibold text-indigo-300 border border-indigo-400/30">
            <span>📊 DASHBOARD GIÁO VIÊN</span>
            <span>•</span>
            <span>LỚP 6A1 • TOÁN 6 (KẾT NỐI TRI THỨC)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Learning Analytics & Giám Sát Tiến Trình Học Sinh
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
            Theo dõi năng lực thời gian thực, chẩn đoán lỗ hổng kiến thức và can thiệp sư phạm kịp thời.
          </p>
        </div>
        <div className="absolute right-4 bottom-[-10px] opacity-10 text-9xl pointer-events-none">
          📈
        </div>
      </div>

      {/* Top 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Sĩ số & Tiến độ</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {analytics.completedCount}/{analytics.totalStudents}
            </span>
            <span className="text-xs font-bold text-emerald-600">
              ({analytics.completionRate}% hoàn thành)
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all"
              style={{ width: `${analytics.completionRate}%` }}
            />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Điểm trung bình lớp</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {analytics.averageScore}
            </span>
            <span className="text-xs text-slate-500">/ 10 điểm</span>
          </div>
          <p className="text-xs text-slate-500">
            Tỷ lệ đạt chuẩn 100% (10/10): <strong>{analytics.completedCount} em</strong>
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Cần can thiệp sư phạm</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400">
              {analytics.needsHelpCount}
            </span>
            <span className="text-xs text-slate-500">học sinh</span>
          </div>
          <p className="text-xs text-rose-600 font-semibold">
            Sai ≥2 lần cùng 1 kỹ năng
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Tương tác Cô AI Nhân</span>
            <MessageSquare className="w-4 h-4 text-purple-500" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400">
              {analytics.aiTutorQueriesTotal}
            </span>
            <span className="text-xs text-slate-500">lượt hỏi</span>
          </div>
          <p className="text-xs text-slate-500">
            Trung bình <strong>3.7 lượt</strong>/học sinh
          </p>
        </div>
      </div>

      {/* Level Mastery Breakdown & Top Errors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Mastery by Cognitive Levels */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
            <span>📊 Tỷ lệ đạt theo 4 mức độ nhận thức (GDPT 2018)</span>
          </h3>

          <div className="space-y-3">
            {[
              { label: "Mức 1: Nhận biết", rate: analytics.levelMastery.nhan_biet, color: "bg-blue-500" },
              { label: "Mức 2: Thông hiểu", rate: analytics.levelMastery.thong_hieu, color: "bg-emerald-500" },
              { label: "Mức 3: Vận dụng", rate: analytics.levelMastery.van_dung, color: "bg-amber-500" },
              { label: "Mức 4: Vận dụng cao", rate: analytics.levelMastery.van_dung_cao, color: "bg-purple-500" },
            ].map((lvl) => (
              <div key={lvl.label} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>{lvl.label}</span>
                  <span>{lvl.rate}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`${lvl.color} h-full rounded-full transition-all`}
                    style={{ width: `${lvl.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl text-xs text-indigo-950 dark:text-indigo-200 border border-indigo-100 dark:border-indigo-900">
            💡 <strong>Nhận xét từ AI Cô Nhân:</strong> Lớp nắm rất chắc Mức 1 (94%) và Mức 2 (82%). Cần bổ sung ví dụ thực tế cho bài toán chia tổ/chia phần ở Mức 4 (Vận dụng cao: 48%).
          </div>
        </div>

        {/* Right: Top 3 Common Mistakes */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            <span>Top 3 lỗi sai phổ biến cần lưu ý trên lớp</span>
          </h3>

          <div className="space-y-3">
            {analytics.topCommonMistakes.map((m, idx) => (
              <div
                key={m.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    #{idx + 1}. {m.skillLabel}
                  </span>
                  <span className="text-xs font-extrabold text-rose-600 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded-md">
                    {m.studentCount} học sinh mắc phải
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  ⚠️ <strong>Biểu hiện:</strong> {m.mistakeDescription}
                </p>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                  👉 <strong>Giải pháp sư phạm:</strong> {m.suggestedRemedy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student Roster Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Danh sách chi tiết học sinh Lớp 6A1 ({filteredStudents.length} em)
            </h3>
            <p className="text-xs text-slate-500">
              Nhấn vào từng học sinh để xem lịch sử làm bài và gửi bài tập thích ứng cá nhân hóa.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="Tìm tên học sinh..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />

            <select
              value={filterStatus}
              onChange={(e: any) => setFilterStatus(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200"
            >
              <option value="all">Tất cả học sinh</option>
              <option value="completed">Đã hoàn thành 100%</option>
              <option value="learning">Đang tiến hành</option>
              <option value="remedial">Cần can thiệp bổ trợ</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 uppercase font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4">Học sinh</th>
                <th className="py-3 px-4">Điểm Đánh giá</th>
                <th className="py-3 px-4">Cấp độ thích ứng</th>
                <th className="py-3 px-4">Kỹ năng cần bổ trợ</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filteredStudents.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">{st.name}</div>
                    <div className="text-[11px] text-slate-400">
                      {st.xp} XP • {st.timeSpentMinutes} phút học
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-black text-sm ${
                        st.quizScore === 10
                          ? "text-emerald-600"
                          : st.quizScore >= 7
                          ? "text-indigo-600"
                          : "text-rose-600"
                      }`}
                    >
                      {st.quizScore}/10
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                      {st.currentLevel === "nhan_biet"
                        ? "Mức 1"
                        : st.currentLevel === "thong_hieu"
                        ? "Mức 2"
                        : st.currentLevel === "van_dung"
                        ? "Mức 3"
                        : "Mức 4"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {st.weakSkills.length > 0 ? (
                      <span className="text-rose-600 dark:text-rose-400 font-medium">
                        {st.weakSkills.join(", ")}
                      </span>
                    ) : (
                      <span className="text-emerald-600 font-medium">Làm chủ tốt ✓</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {st.completed ? (
                      <span className="inline-flex items-center space-x-1 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Đạt chuẩn 100%</span>
                      </span>
                    ) : st.needsHelp ? (
                      <span className="inline-flex items-center space-x-1 text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 rounded-full font-bold">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Cần bổ trợ</span>
                      </span>
                    ) : (
                      <span className="text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-full font-bold">
                        Đang học
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleSendRemedial(st.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-1 ml-auto ${
                        sentRemedialId === st.id
                          ? "bg-emerald-600 text-white"
                          : "bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                      }`}
                    >
                      <Send className="w-3 h-3" />
                      <span>{sentRemedialId === st.id ? "Đã gửi phiếu!" : "Gửi phiếu bài"}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
