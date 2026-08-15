import { Badge, DifficultyLevel } from "../types/lms";

export interface StudentAnalytics {
  id: string;
  name: string;
  avatar: string;
  completed: boolean;
  quizScore: number;
  timeSpentMinutes: number;
  xp: number;
  currentLevel: DifficultyLevel;
  weakSkills: string[];
  needsHelp: boolean;
  lastActive: string;
}

export interface CommonMistakeStat {
  id: string;
  skillLabel: string;
  studentCount: number;
  mistakeDescription: string;
  suggestedRemedy: string;
}

export interface ClassAnalytics {
  className: string;
  totalStudents: number;
  completedCount: number;
  completionRate: number;
  averageScore: number;
  needsHelpCount: number;
  aiTutorQueriesTotal: number;
  levelMastery: {
    nhan_biet: number;
    thong_hieu: number;
    van_dung: number;
    van_dung_cao: number;
  };
  topCommonMistakes: CommonMistakeStat[];
}

export const MOCK_STUDENT_LIST: StudentAnalytics[] = [
  {
    id: "st_01",
    name: "Trần Minh Đức",
    avatar: "👦",
    completed: true,
    quizScore: 10,
    timeSpentMinutes: 38,
    xp: 420,
    currentLevel: "van_dung_cao",
    weakSkills: [],
    needsHelp: false,
    lastActive: "10 phút trước",
  },
  {
    id: "st_02",
    name: "Lê Bảo Ngọc",
    avatar: "👧",
    completed: true,
    quizScore: 10,
    timeSpentMinutes: 42,
    xp: 390,
    currentLevel: "van_dung_cao",
    weakSkills: [],
    needsHelp: false,
    lastActive: "25 phút trước",
  },
  {
    id: "st_03",
    name: "Nguyễn Hoàng Nam",
    avatar: "👦",
    completed: false,
    quizScore: 7,
    timeSpentMinutes: 28,
    xp: 260,
    currentLevel: "thong_hieu",
    weakSkills: ["Phân tích TSNT tìm ƯCLN", "Chọn số mũ nhỏ nhất"],
    needsHelp: true,
    lastActive: "1 giờ trước",
  },
  {
    id: "st_04",
    name: "Phạm Thảo Linh",
    avatar: "👧",
    completed: true,
    quizScore: 10,
    timeSpentMinutes: 35,
    xp: 450,
    currentLevel: "van_dung_cao",
    weakSkills: [],
    needsHelp: false,
    lastActive: "Hôm nay",
  },
  {
    id: "st_05",
    name: "Vũ Tuấn Kiệt",
    avatar: "👦",
    completed: false,
    quizScore: 6,
    timeSpentMinutes: 31,
    xp: 210,
    currentLevel: "thong_hieu",
    weakSkills: ["Bài toán thực tế chia quà", "Xác định ước chung"],
    needsHelp: true,
    lastActive: "Hôm qua",
  },
  {
    id: "st_06",
    name: "Đặng Khánh An",
    avatar: "👧",
    completed: true,
    quizScore: 10,
    timeSpentMinutes: 40,
    xp: 410,
    currentLevel: "van_dung",
    weakSkills: [],
    needsHelp: false,
    lastActive: "Hôm nay",
  },
  {
    id: "st_07",
    name: "Bùi Quang Huy",
    avatar: "👦",
    completed: false,
    quizScore: 5,
    timeSpentMinutes: 22,
    xp: 180,
    currentLevel: "nhan_biet",
    weakSkills: ["Số nguyên tố cùng nhau", "Tìm tập hợp ước"],
    needsHelp: true,
    lastActive: "2 ngày trước",
  },
  {
    id: "st_08",
    name: "Hoàng Mai Phương",
    avatar: "👧",
    completed: true,
    quizScore: 10,
    timeSpentMinutes: 36,
    xp: 430,
    currentLevel: "van_dung_cao",
    weakSkills: [],
    needsHelp: false,
    lastActive: "3 giờ trước",
  },
  {
    id: "st_09",
    name: "Đỗ Gia Hưng",
    avatar: "👦",
    completed: false,
    quizScore: 8,
    timeSpentMinutes: 30,
    xp: 310,
    currentLevel: "van_dung",
    weakSkills: ["Rút gọn phân số về tối giản"],
    needsHelp: false,
    lastActive: "Hôm nay",
  },
  {
    id: "st_10",
    name: "Võ Thị Quỳnh Nga",
    avatar: "👧",
    completed: true,
    quizScore: 10,
    timeSpentMinutes: 45,
    xp: 480,
    currentLevel: "van_dung_cao",
    weakSkills: [],
    needsHelp: false,
    lastActive: "Vừa xong",
  },
];

export const MOCK_CLASS_ANALYTICS: ClassAnalytics = {
  className: "6A1",
  totalStudents: 36,
  completedCount: 28,
  completionRate: 78,
  averageScore: 8.6,
  needsHelpCount: 5,
  aiTutorQueriesTotal: 134,
  levelMastery: {
    nhan_biet: 94,
    thong_hieu: 82,
    van_dung: 68,
    van_dung_cao: 48,
  },
  topCommonMistakes: [
    {
      id: "mistake_1",
      skillLabel: "Lấy nhầm số mũ lớn nhất thay vì số mũ nhỏ nhất khi tính ƯCLN",
      studentCount: 9,
      mistakeDescription: "Học sinh nhầm lẫn giữa quy tắc tìm BCNN (số mũ lớn nhất) và ƯCLN (số mũ nhỏ nhất).",
      suggestedRemedy: "Nhấn mạnh từ khóa 'ƯCLN → Số mũ NHỎ NHẤT (Chung)' thông qua bảng so sánh trực quan.",
    },
    {
      id: "mistake_2",
      skillLabel: "Quên kiểm tra tính chất chia hết đặc biệt (a ⋮ b thì ƯCLN = b)",
      studentCount: 7,
      mistakeDescription: "Học sinh vẫn phân tích thừa số nguyên tố dài dòng thay vì nhận biết nhanh ƯCLN(24, 8) = 8.",
      suggestedRemedy: "Cho làm 3 bài tập phản xạ nhanh với trường hợp số lớn chia hết cho số nhỏ.",
    },
    {
      id: "mistake_3",
      skillLabel: "Chưa xác định đúng điều kiện 'chia nhiều nhất' trong toán đố",
      studentCount: 6,
      mistakeDescription: "Không nhận biết được số phần quà nhiều nhất chính là ƯCLN của số lượng từng món.",
      suggestedRemedy: "Minh họa mô phỏng chia quà thực tế và hướng dẫn cách gạch chân từ khóa đề bài.",
    },
  ],
};
