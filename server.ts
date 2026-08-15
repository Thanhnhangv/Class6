import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini Client
let aiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// System Instruction for "Cô AI Nhân" - Friendly, pedagogical, strictly Grade 6 math teacher
const CO_NHAN_SYSTEM_PROMPT = `
Bạn là "Cô AI Nhân" - Trợ lý gia sư dạy học Toán 6 ảo, thuộc hệ thống LMS "HỌC TOÁN CÙNG CÔ NHÂN" (Bộ sách Kết nối tri thức với cuộc sống).
Chủ đề trọng tâm: "ƯỚC CHUNG VÀ ƯỚC CHUNG LỚN NHẤT (ƯC & ƯCLN)".

NGUYÊN TẮC SƯ PHẠM CỦA CÔ NHÂN:
1. TUYỆT ĐỐI KHÔNG làm bài thay hoặc đưa ngay kết quả cuối cùng cho học sinh.
2. Luôn đặt câu hỏi gợi mở, hướng dẫn từng nấc tư duy (Scaffolding).
3. Sử dụng ngôn ngữ thân thiện, chuẩn mực, khích lệ học sinh lớp 6 (xưng "Cô" và gọi "em" hoặc tên học sinh).
4. Khi phân tích lỗi sai: Chỉ ra quan niệm sai lầm cụ thể (ví dụ: nhầm Ước với Bội, liệt kê thiếu ước, nhầm ƯC với ƯCLN, hoặc phân tích thừa số nguyên tố chưa triệt để) và dẫn dắt em tự sửa.
5. Giải thích ngắn gọn, súc tích, trực quan, có ví dụ gần gũi thực tế.
6. Trình bày định dạng rõ ràng, dùng gạch đầu dòng, ký hiệu toán học đẹp (Ư(a), ƯCLN(a, b), ƯC(a, b)).
`;

// Supported non-deprecated models in fallback order
const CANDIDATE_MODELS = [
  "gemini-3.7-flash",
  "gemini-3.1-flash-lite",
  "gemini-flash-latest",
];

async function generateWithFallback(prompt: string): Promise<string | null> {
  const ai = getGemini();
  if (!ai) return null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction: CO_NHAN_SYSTEM_PROMPT,
          temperature: 0.7,
        },
      });
      if (response.text) {
        return response.text;
      }
    } catch (error: any) {
      console.warn(`Gemini model ${model} unavailable (${error?.status || error?.message || "error"}), attempting next fallback model...`);
      // Short delay before trying the next model
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }
  return null;
}

app.post("/api/ai/chat", async (req, res) => {
  const { mode, questionContext, studentAnswer, userMessage, studentName = "em", errorSkill } = req.body;

  let prompt = "";
  if (mode === "hint") {
    prompt = `Học sinh ${studentName} đang làm câu hỏi sau:
"${questionContext}"
Học sinh yêu cầu: "💡 Gợi ý cho em với cô".
Hãy đưa ra một gợi ý ngắn gọn (1-2 câu), gợi mở phương pháp tư duy mà không tiết lộ đáp án.`;
  } else if (mode === "explain") {
    prompt = `Học sinh ${studentName} cần giải thích lại khái niệm liên quan đến:
"${questionContext}"
Hãy giải thích lại thật dễ hiểu bằng hình ảnh trực quan hoặc ví dụ chia kẹo/chia đồ vật của học sinh lớp 6.`;
  } else if (mode === "example") {
    prompt = `Học sinh ${studentName} muốn xem một ví dụ tương tự với bài toán:
"${questionContext}"
Hãy tạo 1 ví dụ số nhỏ hơn, giải mẫu từng bước rõ ràng để em học theo phương pháp.`;
  } else if (mode === "step_by_step") {
    prompt = `Học sinh ${studentName} đang bối rối với bài:
"${questionContext}"
Hãy chia bài toán thành 3-4 bước nhỏ, và yêu cầu em thực hiện bước 1 trước.`;
  } else if (mode === "analyze_error") {
    prompt = `Học sinh ${studentName} vừa trả lời sai bài:
Nội dung: "${questionContext}"
Kỹ năng liên quan: "${errorSkill || "Tìm ƯC/ƯCLN"}"
Đáp án học sinh đã chọn/nhập: "${studentAnswer || "chưa đúng"}"
Hãy động viên em, phân tích nhẹ nhàng nguyên nhân em dễ nhầm lẫn ở kỹ năng này và gợi ý cách kiểm tra lại.`;
  } else {
    // Free chat
    prompt = `Học sinh ${studentName} hỏi: "${userMessage}".
Bối cảnh bài học: "${questionContext || "Ước chung và ƯCLN"}".
Hãy trả lời thân thiện, sư phạm và dễ hiểu.`;
  }

  const generatedReply = await generateWithFallback(prompt);
  if (generatedReply) {
    return res.json({ reply: generatedReply });
  }

  // Smart Pedagogical Fallback Engine if API key is not yet set or during offline preview
  let fallbackReply = "";
  if (mode === "hint") {
    fallbackReply = `Cô Nhân gợi ý cho ${studentName} nhé: Em hãy nhớ lại: Muốn tìm ước của một số, ta lần lượt chia số đó cho các số tự nhiên từ 1 đến chính nó. Số nào chia hết thì đó là ước! Em thử liệt kê các ước của từng số ra nháp xem nào! ✨`;
  } else if (mode === "explain") {
    fallbackReply = `Chào ${studentName}! Ước chung của hai số giống như việc hai bạn cùng thích chung những món đồ vậy. Số nào mà cả hai số đã cho ĐỀU CHIA HẾT cho nó thì số đó là ƯỚC CHUNG. Và số to nhất trong nhóm đó chính là ƯỚC CHUNG LỚN NHẤT (ƯCLN) đấy em nhé! 🌟`;
  } else if (mode === "example") {
    fallbackReply = `Ví dụ cô lấy số nhỏ hơn nhé:\n- Ư(6) = {1, 2, 3, 6}\n- Ư(8) = {1, 2, 4, 8}\n-> Các số chung ở cả hai hàng là: 1 và 2. Vậy ƯC(6, 8) = {1, 2}.\n-> Số lớn nhất trong các ước chung là 2, nên ƯCLN(6, 8) = 2. Em thử áp dụng cách này vào bài của mình xem sao nhé!`;
  } else if (mode === "step_by_step") {
    fallbackReply = `Để giải quyết bài này, em làm theo 3 bước sau nhé:\n1. Bước 1: Viết tập hợp các ước của từng số.\n2. Bước 2: Khoanh tròn các số xuất hiện ở cả hai tập hợp để tìm ƯC.\n3. Bước 3: Chọn số lớn nhất trong các số vừa khoanh, đó chính là ƯCLN!\nEm đã hoàn thành được Bước 1 chưa?`;
  } else if (mode === "analyze_error") {
    fallbackReply = `Đừng nản lòng nhé ${studentName}! Sai là một bước để ta hiểu sâu hơn. Ở kỹ năng này, các bạn thường hay quên mất số 1 hoặc chính số đó khi tìm ước, hoặc nhầm lẫn giữa ước và bội. Em hãy thử chia từ tốn lại từng số tự nhiên từ 1 trở đi nhé! Cô tin em làm lại sẽ đúng! 💪`;
  } else {
    fallbackReply = `Cô Nhân luôn ở đây đồng hành cùng ${studentName}! Để học tốt bài Ước chung và ƯCLN, em nhớ ghi nhớ: "Muốn tìm ƯC, ta tìm các ước của từng số rồi lấy phần tử chung. ƯCLN là số lớn nhất trong tập hợp ƯC đó." Em cần cô giải thích phần nào nữa không?`;
  }

  return res.json({ reply: fallbackReply });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LMS "Học Toán Cùng Cô Nhân" running on port ${PORT}`);
  });
}

startServer();
