import React, { useState, useEffect, useRef } from "react";
import { Bot, Send, Sparkles, X, Lightbulb, BookOpen, Search, Layers, AlertCircle, Volume2, VolumeX, MessageSquare } from "lucide-react";

// Smart Pedagogical Client-side Reasoner for 100% Standalone Offline Browser Execution
function generateClientPedagogicalReply(
  mode: string,
  questionContext: string,
  studentName: string,
  userMessage?: string,
  errorSkill?: string,
  studentAnswer?: string
): string {
  // Extract numbers from questionContext if any (e.g. 18, 30, 24, 36)
  const numbers = questionContext.match(/\b\d+\b/g)?.map(Number) || [];
  const validNumbers = numbers.filter((n) => n > 1 && n <= 1000);

  // Helper math utilities
  const getFactors = (n: number) => {
    const factors: number[] = [];
    for (let i = 1; i <= n; i++) {
      if (n % i === 0) factors.push(i);
    }
    return factors;
  };

  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  if (mode === "hint") {
    if (validNumbers.length >= 2) {
      const a = validNumbers[0];
      const b = validNumbers[1];
      return `Cô Nhân gợi ý cho ${studentName} nhé:\n• Bước 1: Em hãy liệt kê các ước của số ${a}: Ư(${a}) = {${getFactors(a).join(", ")}}\n• Bước 2: Liệt kê các ước của số ${b}: Ư(${b}) = {${getFactors(b).join(", ")}}\n• Bước 3: Tìm các phần tử chung của cả hai tập hợp, sau đó chọn số lớn nhất làm ƯCLN nhé! ✨`;
    }
    return `Cô Nhân gợi ý cho ${studentName} nhé: Em hãy nhớ lại: Muốn tìm ước của một số, ta lần lượt chia số đó cho các số tự nhiên từ 1 đến chính nó. Số nào chia hết thì đó là ước! Em thử liệt kê các ước ra nháp xem nào! ✨`;
  }

  if (mode === "explain") {
    return `Chào ${studentName}! Cô giải thích lại cho em thật dễ hiểu nhé:\n\n1. **Ước chung (ƯC)**: Giống như một món đồ chơi mà cả hai bạn đều thích, ước chung là số mà TẤT CẢ các số đã cho ĐỀU CHIA HẾT cho nó.\n2. **Ước chung lớn nhất (ƯCLN)**: Là số LỚN NHẤT trong tập hợp các ước chung đó.\n\n*Mẹo nhớ:* Tập hợp ƯC của hai số chính là tập hợp các ƯỚC của ƯCLN của hai số đó! 🌟`;
  }

  if (mode === "example") {
    if (validNumbers.length >= 2) {
      const a = validNumbers[0];
      const b = validNumbers[1];
      const fA = getFactors(a);
      const fB = getFactors(b);
      const common = fA.filter((x) => fB.includes(x));
      const greatest = gcd(a, b);
      return `Ví dụ mẫu chi tiết cho bài toán của em:\n• Ư(${a}) = {${fA.join(", ")}}\n• Ư(${b}) = {${fB.join(", ")}}\n➔ ƯC(${a}, ${b}) = {${common.join(", ")}}\n➔ Số lớn nhất trong các ước chung là **${greatest}**, nên **ƯCLN(${a}, ${b}) = ${greatest}**.\n\nEm hãy quan sát mẫu trên và tự tin áp dụng nhé! 🔎`;
    }
    return `Cô lấy ví dụ với hai số nhỏ 12 và 18 nhé:\n• Ư(12) = {1, 2, 3, 4, 6, 12}\n• Ư(18) = {1, 2, 3, 6, 9, 18}\n➔ Các ước chung là: ƯC(12, 18) = {1, 2, 3, 6}.\n➔ Số lớn nhất là 6, vậy ƯCLN(12, 18) = 6.\nEm thử làm tương tự với bài của mình nhé!`;
  }

  if (mode === "step_by_step") {
    return `Để giải bài này thật chuẩn xác, em làm theo 3 bước của Cô Nhân nhé:\n\n1️⃣ **Bước 1 (Phân tích):** Liệt kê các ước của từng số hoặc phân tích ra thừa số nguyên tố.\n2️⃣ **Bước 2 (Tìm chung):** Lấy ra các phần tử xuất hiện ở tất cả các số (hoặc chọn các thừa số nguyên tố chung với số mũ nhỏ nhất).\n3️⃣ **Bước 3 (Kết luận):** Tính tích các thừa số đã chọn để ra ƯCLN.\n\nEm đã xong Bước 1 chưa? Cần cô kiểm tra bước nào thì nhắn cô nhé! 🧩`;
  }

  if (mode === "analyze_error") {
    let skillTip = "Em hãy kiểm tra xem mình có liệt kê thiếu ước số 1 hoặc chính số đó không nhé.";
    if (errorSkill?.includes("tsnt")) {
      skillTip = "Khi phân tích ra thừa số nguyên tố, em nhớ chỉ dùng các số nguyên tố (2, 3, 5, 7, 11...) và lấy số mũ nhỏ nhất cho thừa số chung nhé.";
    } else if (errorSkill?.includes("rut_gon")) {
      skillTip = "Để rút gọn phân số về tối giản chỉ trong 1 lần chia, em hãy chia cả tử và mẫu cho ƯCLN của chúng!";
    } else if (errorSkill?.includes("toan_thuc_te")) {
      skillTip = "Trong các bài toán chia đều (chia kẹo, chia nhóm, chia phần thưởng lớn nhất), số phần chia được nhiều nhất luôn chính là ƯCLN của các số lượng đã cho!";
    }

    return `Đừng nản lòng nhé ${studentName}! Sai lầm là một cơ hội tuyệt vời để mình hiểu sâu hơn. 💡\n\n${studentAnswer ? `Đáp án em vừa chọn: "${studentAnswer}".` : ""}\n**Lời khuyên của cô:** ${skillTip}\nEm thử nhẩm lại theo hướng dẫn của cô rồi làm lại câu này xem sao nhé! Cô tin em làm được! 💪`;
  }

  // Free Chat mode
  const q = (userMessage || "").toLowerCase();
  if (q.includes("chào") || q.includes("hello") || q.includes("hi")) {
    return `Chào ${studentName}! Cô AI Nhân rất vui được đồng hành cùng em. Em đang muốn cô hướng dẫn phần nào trong bài ƯC & ƯCLN?`;
  }
  if (q.includes("ước là gì") || q.includes("khái niệm ước")) {
    return `Nếu số tự nhiên a chia hết cho số tự nhiên b (b khác 0) thì ta nói a là bội của b, còn b là ƯỚC của a. Ký hiệu tập hợp các ước của a là Ư(a) em nhé!`;
  }
  if (q.includes("thừa số nguyên tố") || q.includes("tsnt")) {
    return `Muốn tìm ƯCLN bằng cách phân tích ra thừa số nguyên tố:\n• Bước 1: Phân tích mỗi số ra thừa số nguyên tố.\n• Bước 2: Chọn ra các thừa số nguyên tố CHUNG.\n• Bước 3: Lập tích các thừa số đã chọn, mỗi thừa số lấy với số mũ NHỎ NHẤT của nó. Tích đó là ƯCLN!`;
  }
  if (q.includes("rút gọn") || q.includes("phân số")) {
    return `Muốn rút gọn một phân số về phân số tối giản nhanh nhất, ta chỉ cần chia cả tử số và mẫu số cho ƯCLN của tử và mẫu em nhé!`;
  }
  if (q.includes("bài toán thực tế") || q.includes("chia kẹo") || q.includes("chia nhóm")) {
    return `Khi gặp bài toán chia đều số học sinh, chia đều hoa quả, kẹo bánh thành số phần NHIỀU NHẤT, số phần đó chính là ƯCLN của các đại lượng cần chia!`;
  }

  return `Cô Nhân đã nhận được câu hỏi của ${studentName}: "${userMessage}".\nĐể tìm Ước chung và ƯCLN nhanh và chính xác:\n1. Nhớ kiểm tra xem các số có chia hết cho nhau không (Nếu a chia hết cho b thì ƯCLN(a, b) = b).\n2. Nếu hai số nguyên tố cùng nhau thì ƯCLN bằng 1.\nEm hãy thử làm và nhấn các nút hướng dẫn nếu cần cô trợ giúp thêm nhé! ✨`;
}

interface AiTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  questionContext?: string;
  errorSkill?: string;
  studentAnswer?: string;
}

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export const AiTutorModal: React.FC<AiTutorModalProps> = ({
  isOpen,
  onClose,
  studentName,
  questionContext = "Ước chung và Ước chung lớn nhất (ƯC & ƯCLN)",
  errorSkill,
  studentAnswer,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init_1",
      sender: "ai",
      text: `Chào ${studentName}! Cô là Cô AI Nhân. Cô ở đây để đồng hành và gợi mở tư duy cho em trong bài học Ước chung & ƯCLN. Em đang gặp băn khoăn ở phần nào? Hãy bấm các nút gợi ý nhanh bên dưới hoặc nhắn tin cho cô nhé! ✨`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle Voice Speech Synthesis
  const speakText = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text.replace(/[*_~`#]/g, ""));
    utterance.lang = "vi-VN";
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (mode: string = "free_chat", customMsg?: string) => {
    const messageToSend = customMsg || inputText.trim();
    if (!messageToSend && mode === "free_chat") return;

    if (mode === "free_chat") {
      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        sender: "user",
        text: messageToSend,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInputText("");
    } else {
      let actionLabel = "";
      if (mode === "hint") actionLabel = "💡 Cô cho em một gợi ý với ạ!";
      else if (mode === "explain") actionLabel = "📚 Cô giải thích lại khái niệm này giúp em!";
      else if (mode === "example") actionLabel = "🔎 Cô cho em một ví dụ tương tự nhé!";
      else if (mode === "step_by_step") actionLabel = "🧩 Cô hướng dẫn em làm từng bước với ạ!";
      else if (mode === "analyze_error") actionLabel = "🔍 Cô phân tích giúp em vì sao em làm chưa đúng ạ!";

      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        sender: "user",
        text: actionLabel,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, userMsg]);
    }

    setIsLoading(true);

    // If opened via file:// protocol or offline, directly use client tutor engine
    const isFileProtocol = typeof window !== "undefined" && window.location.protocol === "file:";

    if (isFileProtocol) {
      setTimeout(() => {
        const clientReply = generateClientPedagogicalReply(
          mode,
          questionContext,
          studentName,
          messageToSend,
          errorSkill,
          studentAnswer
        );
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: clientReply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsLoading(false);
      }, 400);
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          mode,
          questionContext,
          studentName,
          userMessage: messageToSend,
          errorSkill,
          studentAnswer,
        }),
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: data.reply || generateClientPedagogicalReply(mode, questionContext, studentName, messageToSend, errorSkill, studentAnswer),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.warn("Using offline standalone pedagogical engine:", err);
      const offlineReply = generateClientPedagogicalReply(
        mode,
        questionContext,
        studentName,
        messageToSend,
        errorSkill,
        studentAnswer
      );
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: offlineReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" id="ai_tutor_backdrop">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-indigo-100 dark:border-slate-800 flex flex-col h-[640px] max-h-[90vh] overflow-hidden" id="ai_tutor_window">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-4 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl shadow-inner border border-white/30">
              👩‍🏫
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-lg leading-tight">Cô AI Nhân</h3>
                <span className="bg-amber-400 text-indigo-950 text-xs px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                  Gia sư Toán 6
                </span>
              </div>
              <p className="text-xs text-indigo-100">Đồng hành & gợi mở tư duy • Không làm bài thay</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => speakText(messages[messages.length - 1]?.text || "")}
              title="Đọc tin nhắn mới nhất"
              className="p-2 hover:bg-white/20 rounded-lg text-white transition-colors"
              id="ai_tutor_speech_toggle"
            >
              {isSpeaking ? <VolumeX className="w-5 h-5 text-amber-300" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg text-white transition-colors"
              id="ai_tutor_close_btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Pedagogical Banner */}
        <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/50 px-4 py-2 text-xs text-amber-800 dark:text-amber-300 flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            <strong>Nguyên tắc Cô Nhân:</strong> Hướng dẫn phương pháp, đặt câu hỏi gợi mở, giúp em tự phát hiện kiến thức!
          </span>
        </div>

        {/* Chat Message List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-900/50" id="ai_tutor_messages_container">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[82%] rounded-2xl px-4 py-3 shadow-sm ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white rounded-br-none"
                    : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-none"
                }`}
              >
                <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                <div
                  className={`text-[10px] mt-1 text-right ${
                    msg.sender === "user" ? "text-indigo-200" : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-none px-4 py-3 text-sm text-slate-500 flex items-center space-x-2 shadow-sm">
                <Bot className="w-4 h-4 animate-spin text-indigo-600" />
                <span>Cô Nhân đang suy nghĩ phản hồi cho em...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Action Chips */}
        <div className="p-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => handleSendMessage("hint")}
              disabled={isLoading}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 text-amber-800 dark:text-amber-300 rounded-full font-medium border border-amber-200 transition-colors whitespace-nowrap"
              id="ai_quick_hint"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>💡 Gợi ý</span>
            </button>
            <button
              onClick={() => handleSendMessage("explain")}
              disabled={isLoading}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-800 dark:text-blue-300 rounded-full font-medium border border-blue-200 transition-colors whitespace-nowrap"
              id="ai_quick_explain"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>📚 Giải thích lại</span>
            </button>
            <button
              onClick={() => handleSendMessage("example")}
              disabled={isLoading}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 rounded-full font-medium border border-emerald-200 transition-colors whitespace-nowrap"
              id="ai_quick_example"
            >
              <Search className="w-3.5 h-3.5 text-emerald-600" />
              <span>🔎 Cho ví dụ</span>
            </button>
            <button
              onClick={() => handleSendMessage("step_by_step")}
              disabled={isLoading}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 text-purple-800 dark:text-purple-300 rounded-full font-medium border border-purple-200 transition-colors whitespace-nowrap"
              id="ai_quick_step"
            >
              <Layers className="w-3.5 h-3.5 text-purple-600" />
              <span>🧩 Làm từng bước</span>
            </button>
            {errorSkill && (
              <button
                onClick={() => handleSendMessage("analyze_error")}
                disabled={isLoading}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-800 dark:text-rose-300 rounded-full font-medium border border-rose-200 transition-colors whitespace-nowrap"
                id="ai_quick_analyze_error"
              >
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>🔍 Phân tích lỗi sai</span>
              </button>
            )}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage("free_chat");
          }}
          className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2"
          id="ai_tutor_input_form"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Nhắn tin hỏi Cô Nhân (VD: Em chưa hiểu thừa số chung...)"
            className="flex-1 bg-slate-100 dark:bg-slate-800 border-0 focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400"
            id="ai_tutor_input_field"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center"
            id="ai_tutor_send_btn"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
