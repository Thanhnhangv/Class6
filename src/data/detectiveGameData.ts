export interface GameStage {
  id: number;
  title: string;
  subtitle: string;
  story: string;
  character: string;
  characterAvatar: string;
  puzzleType: "find_factors" | "find_common_factors" | "find_gcd" | "real_life_story";
  taskQuestion: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
  interactiveItems?: {
    id: string;
    label: string;
    value: number;
    belongsTo: "A" | "B" | "BOTH" | "NONE";
  }[];
  hint: string;
  rewardXP: number;
  badgeId?: string;
  badgeName?: string;
}

export const DETECTIVE_GAME_STAGES: GameStage[] = [
  {
    id: 1,
    title: "Màn 1: Mật Mã Hang Động Bí Ẩn",
    subtitle: "Thử thách nhận diện Ước số",
    story: "Biệt đội thám tử đứng trước cánh cửa đá cổ xưa của Hang Động Số Học. Để mở khóa chốt chặn đầu tiên, bạn cần tìm tất cả các viên đá mang số là ƯỚC CỦA 20!",
    character: "Thám tử Toán học Min",
    characterAvatar: "🕵️‍♂️",
    puzzleType: "find_factors",
    taskQuestion: "Chọn tập hợp chứa ĐẦY ĐỦ tất cả các ước của số 20 để giải mã phiến đá:",
    options: [
      {
        id: "opt_2",
        text: "{2; 4; 5; 10; 20} (Thiếu số 1)",
        isCorrect: false,
        feedback: "Cửa đá báo động: Bạn đã bỏ quên số 1! Số 1 là ước của mọi số tự nhiên.",
      },
      {
        id: "opt_3",
        text: "{1; 2; 4; 5; 10} (Thiếu số 20)",
        isCorrect: false,
        feedback: "Cửa đá chưa mở: Bạn đã bỏ quên chính số 20! Mọi số tự nhiên a > 0 đều có ước là chính nó.",
      },
      {
        id: "opt_1",
        text: "{1; 2; 4; 5; 10; 20}",
        isCorrect: true,
        feedback: "Chính xác! Cửa hang rung chuyển và mở toang, phát ra ánh sáng hoàng kim!",
      },
      {
        id: "opt_4",
        text: "{0; 1; 2; 4; 5; 10; 20}",
        isCorrect: false,
        feedback: "Khóa bị kẹt: Số 0 không thể là ước của bất kỳ số nào vì không có phép chia cho 0!",
      },
    ],
    hint: "Ước của 20 là các số tự nhiên từ 1 đến 20 mà 20 chia hết cho nó: 20 chia hết cho 1, 2, 4, 5, 10, 20.",
    rewardXP: 50,
    badgeId: "badge_explorer",
    badgeName: "🏅 Nhà khám phá",
  },
  {
    id: 2,
    title: "Màn 2: Cánh Cổng Pha Lê Ước Chung",
    subtitle: "Thử thách giao thoa tập hợp",
    story: "Vượt qua hang đá, biệt đội tiến vào Cung Điện Pha Lê. Có hai luồng năng lượng: Nguồn lửa đỏ (số 18) và Nguồn băng xanh (số 24). Cánh cổng chỉ mở khi kích hoạt các Tinh thể năng lượng chung (Ước chung)!",
    character: "Tiên Phong Thám Tử",
    characterAvatar: "🧭",
    puzzleType: "find_common_factors",
    taskQuestion: "Tập hợp các số vừa là ước của 18 vừa là ước của 24 (ƯC(18, 24)) là:",
    options: [
      {
        id: "opt_2",
        text: "{1; 2; 3; 6; 9}",
        isCorrect: false,
        feedback: "Cổng rung lắc: Số 9 chỉ là ước của 18, 24 không chia hết cho 9 (24:9 = 2 dư 6)!",
      },
      {
        id: "opt_1",
        text: "{1; 2; 3; 6}",
        isCorrect: true,
        feedback: "Tuyệt vời! 4 viên ngọc pha lê đồng loạt phát sáng, cánh cổng pha lê hé lộ con đường!",
      },
      {
        id: "opt_3",
        text: "{1; 2; 3; 4; 6}",
        isCorrect: false,
        feedback: "Cổng phát tia cảnh báo: Số 4 chỉ là ước của 24, 18 không chia hết cho 4!",
      },
      {
        id: "opt_4",
        text: "{6}",
        isCorrect: false,
        feedback: "Chưa đủ tinh thể: Số 6 là ước chung lớn nhất, nhưng ƯC phải bao gồm TẤT CẢ các ước chung {1; 2; 3; 6}.",
      },
    ],
    hint: "Ư(18) = {1; 2; 3; 6; 9; 18} và Ư(24) = {1; 2; 3; 4; 6; 8; 12; 24}. Chọn những phần tử chung ở cả 2 tập hợp.",
    rewardXP: 50,
    badgeId: "badge_detective",
    badgeName: "🔎 Thám tử Toán học",
  },
  {
    id: 3,
    title: "Màn 3: Ổ Khóa Hoàng Kim ƯCLN",
    subtitle: "Thử thách tìm Ước Chung Lớn Nhất",
    story: "Trước mắt biệt đội là Rương Báu Hoàng Kim nghìn năm! Ổ khóa cổ yêu cầu nhập một con số DUY NHẤT: Ước chung lớn nhất của 60 và 84!",
    character: "Thần Giữ Rương",
    characterAvatar: "👑",
    puzzleType: "find_gcd",
    taskQuestion: "Hãy phân tích 60 và 84 ra thừa số nguyên tố và tìm ƯCLN(60, 84):",
    options: [
      {
        id: "opt_2",
        text: "6 (Vì chọn tích 2 · 3 = 6)",
        isCorrect: false,
        feedback: "Số mũ của thừa số 2 ở cả hai số đều là 2, nên phải chọn 2² = 4, do đó ƯCLN là 4 · 3 = 12.",
      },
      {
        id: "opt_3",
        text: "24",
        isCorrect: false,
        feedback: "60 không chia hết cho 24. 24 không phải là ước của 60.",
      },
      {
        id: "opt_4",
        text: "420 (Nhầm sang BCNN)",
        isCorrect: false,
        feedback: "Đây là BCNN của 60 và 84! Ổ khóa rương yêu cầu ƯCLN (Ước chung lớn nhất - số nhỏ hơn hoặc bằng 60).",
      },
      {
        id: "opt_1",
        text: "12 (Vì 60 = 2² · 3 · 5 và 84 = 2² · 3 · 7 -> ƯCLN = 2² · 3 = 12)",
        isCorrect: true,
        feedback: "Rương báu bật mở! Âm thanh reo hò vang dậy! Bạn đã làm chủ phương pháp phân tích thừa số nguyên tố!",
      },
    ],
    hint: "60 = 2² · 3 · 5; 84 = 2² · 3 · 7. Thừa số chung là 2 và 3 với số mũ nhỏ nhất là 2 và 1. Tích = 2² · 3 = 12.",
    rewardXP: 50,
    badgeId: "badge_gcd_master",
    badgeName: "🧠 Cao thủ ƯCLN",
  },
  {
    id: 4,
    title: "Màn 4: Giải Cứu Đoàn Thám Hiểm & Dân Làng",
    subtitle: "Vận dụng thực tế tình huống cứu trợ",
    story: "Biệt đội tìm thấy kho báu gồm 72 túi gạo thảo dược và 48 bình nước thần. Cần chia đều thành nhiều phần cứu trợ nhất cho các ngôi làng vùng xa, sao cho số túi gạo và bình nước ở mỗi phần là như nhau.",
    character: "Trưởng Làng Thông Thái",
    characterAvatar: "🧙‍♂️",
    puzzleType: "real_life_story",
    taskQuestion: "Có thể chia nhiều nhất thành bao nhiêu phần cứu trợ? Khi đó mỗi phần có bao nhiêu túi gạo và bình nước?",
    options: [
      {
        id: "opt_2",
        text: "12 phần quà (Mỗi phần có 6 túi gạo và 4 bình nước)",
        isCorrect: false,
        feedback: "12 phần chia được nhưng chưa phải số phần NHIỀU NHẤT. ƯCLN(72, 48) là 24 cơ mà!",
      },
      {
        id: "opt_1",
        text: "24 phần quà (Mỗi phần có 3 túi gạo và 2 bình nước)",
        isCorrect: true,
        feedback: "Xuất sắc tuyệt đỉnh! Dân làng ca ngợi trí tuệ của bạn! Bạn đã hoàn thành trọn vẹn toàn bộ chuyến thám hiểm!",
      },
      {
        id: "opt_3",
        text: "24 phần quà (Mỗi phần có 2 túi gạo và 3 bình nước - Đảo ngược)",
        isCorrect: false,
        feedback: "Số phần đúng là 24, nhưng 72 túi gạo chia 24 phần phải được 3 túi gạo mỗi phần (72:24 = 3).",
      },
      {
        id: "opt_4",
        text: "48 phần quà",
        isCorrect: false,
        feedback: "72 không chia hết cho 48, không thể chia thành 48 phần đều nhau được.",
      },
    ],
    hint: "Số phần nhiều nhất là ƯCLN(72, 48) = 24. Túi gạo mỗi phần = 72 : 24 = 3; Bình nước mỗi phần = 48 : 24 = 2.",
    rewardXP: 100,
    badgeId: "badge_conqueror",
    badgeName: "🏆 Chinh phục Toán 6",
  },
];
