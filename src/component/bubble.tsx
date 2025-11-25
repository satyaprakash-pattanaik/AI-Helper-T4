import { useState, useEffect } from "react";
import { detectTheme } from "../utils/helper";

interface BubbleProps {
  selectedText: string;
  onAsk: (question: string) => void;
  onClose: () => void;
  aiResponse: string;
  isLoading?: boolean;
  isVisible: boolean;
  position: { x: number; y: number };
}

export default function Bubble({ 
  selectedText, 
  onAsk, 
  onClose, 
  aiResponse, 
  isLoading,
  isVisible,
  position 
}: BubbleProps) {
  const [question, setQuestion] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => { setTheme(detectTheme()); }, []);

  const handleAsk = () => {
    if(question.trim() !== "") {
      onAsk(question);
      setQuestion("");
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAsk();
    }
  };
  if (!isVisible) return null;
  const isDark = theme === "dark";

  // complete tailwind conversion:
  return (
    <div style={{
      position: "absolute",
      left: `${position.x}px`,
      top: `${position.y}px`,
      animation: "slideIn 0.3s ease-out",
      zIndex: 2147483647,
    }}>
      <div className={`relative w-[380px] max-w-[90vw] rounded-3xl p-6 backdrop-blur-xl
        ${isDark
          ? "bg-gradient-to-br from-slate-800 to-slate-700 shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.1)] border border-white/10"
          : "bg-gradient-to-br from-white to-slate-50 shadow-[0_20px_60px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.05)] border border-black/5"
        }`}
      >
        {/* Decorative glow */}
        <div className={`absolute -top-[50%] left-[20%] w-[60%] h-full pointer-events-none -z-10
          ${isDark
            ? "bg-[radial-gradient(circle,rgba(96,165,250,0.15)_0%,transparent_70%)]"
            : "bg-[radial-gradient(circle,rgba(59,130,246,0.1)_0%,transparent_70%)]"
          } blur-[30px]`}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center font-light text-base transition-all
            ${isDark
              ? "bg-white/10 text-slate-200 hover:bg-white/15"
              : "bg-black/5 text-slate-600 hover:bg-black/10"
            }`}
          style={{ border: "none" }}
        >✕</button>

        {/* Header */}
        <div className="mb-4">
          <div className={`flex items-center gap-2 text-lg font-bold mb-2
            ${isDark ? "text-slate-100" : "text-slate-900"}
          `}>
            <span className="text-2xl bg-gradient-to-br from-blue-500 to-violet-500 bg-clip-text text-transparent">✨</span>
            AI Insights
          </div>
          <div className={`text-[11px] uppercase tracking-[0.5px] font-medium
            ${isDark ? "text-slate-400" : "text-slate-500"}
          `}>
            Selected Text
          </div>
        </div>

        {/* Selected text preview */}
        <div className={`text-sm rounded-xl px-[14px] py-3 mb-4 max-h-20 overflow-y-auto leading-[1.5]
          ${isDark
            ? "bg-white/5 text-slate-300 border border-white/5"
            : "bg-black/3 text-slate-600 border border-black/5"
          }`}
        >
          {selectedText.substring(0, 150)}
          {selectedText.length > 150 ? "..." : ""}
        </div>

        {/* AI Response */}
        <div className="mb-4">
          <div className={`flex items-center gap-1 text-xs font-semibold mb-2
            ${isDark ? "text-slate-400" : "text-slate-500"}
          `}>
            <span className="text-base">🤖</span>
            AI Summary
          </div>
          <div className={`rounded-2xl py-3 px-3 min-h-20 max-h-52 overflow-y-auto text-base leading-[1.6]
            ${isDark
              ? "bg-gradient-to-br from-blue-400/15 to-violet-500/10 text-slate-200 border border-blue-400/20"
              : "bg-gradient-to-br from-blue-400/8 to-violet-500/5 text-slate-900 border border-blue-500/15"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full border-2 border-t-transparent animate-spin
                  ${isDark ? "border-blue-400/20" : "border-blue-500/20"}
                `} />
                <span className={`${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Analyzing...
                </span>
              </div>
            ) : aiResponse ? (
              aiResponse
            ) : (
              <span className={`${isDark ? "text-slate-500" : "text-slate-400"} italic`}>
                Select text to get AI insights...
              </span>
            )}
          </div>
        </div>

        {/* Ask question section */}
        <div>
          <div className={`flex items-center gap-1 text-xs font-semibold mb-2
            ${isDark ? "text-slate-400" : "text-slate-500"}
          `}>
            <span className="text-base">💬</span>
            Ask a Question
          </div>
          <div className="flex gap-2">
            <input
              className={`flex-1 rounded-xl px-4 py-3 text-base outline-none transition-all
                ${isDark 
                  ? "bg-white/5 text-slate-100 border border-white/10 focus:border-blue-400/50 focus:shadow-[0_0_0_3px_rgba(96,165,250,0.1)]"
                  : "bg-white/80 text-slate-900 border border-black/10 focus:border-blue-500/50 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
                }`}
              placeholder="Ask anything..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              // border color/box-shadow handled by Tailwind focus styles
            />
            <button
              className={`rounded-xl px-5 py-3 font-semibold text-base text-white cursor-pointer transition-all shadow-md
                bg-gradient-to-br from-blue-500 to-violet-500
                hover:-translate-y-0.5 hover:shadow-lg
                ${isLoading || !question.trim() ? "opacity-50 cursor-not-allowed" : ""}
              `}
              onClick={handleAsk}
              disabled={isLoading || !question.trim()}
            >
              Ask
            </button>
          </div>

          {/* Quick actions */}
          <div className="flex gap-1 mt-2 flex-wrap">
            {["✨ Simplify", "📌 Key Points", "🔍 Explain More"].map((label) => (
              <button
                key={label}
                onClick={() => {
                  const questionMap: Record<string, string> = {
                    "✨ Simplify": "Explain this in simpler terms",
                    "📌 Key Points": "What are the key takeaways?",
                    "🔍 Explain More": "Provide more detailed explanation",
                  };
                  onAsk(questionMap[label]);
                }}
                disabled={isLoading}
                className={`px-3 py-1.5 rounded-md border-none text-xs font-medium transition-all
                  ${isDark
                    ? "bg-white/8 text-slate-300 hover:bg-white/12"
                    : "bg-black/4 text-slate-600 hover:bg-black/8"
                  }
                  ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tailwind animation for spinner (global) */}
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg);}
            to { transform: rotate(360deg);}
          }
        `}
        </style>
      </div>
    </div>
  );
}
