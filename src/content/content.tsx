import { createRoot } from "react-dom/client";
import Bubble from "../component/bubble";
import { useState, useEffect } from "react";

// Tailwind handles component styles now, so global styles are minimal.
// Keep only essential isolation for extension popup root.
const style = document.createElement('style');
style.textContent = `
  #hover-ai-lens-root {
    all: initial;
    position: absolute;
    z-index: 2147483647;
    pointer-events: none;
  }
  #hover-ai-lens-root > * {
    pointer-events: auto;
  }
  #hover-ai-lens-root *,
  #hover-ai-lens-root *::before,
  #hover-ai-lens-root *::after {
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  }
  /* Tailwind will use its animate-spin utilities */
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(10px) scale(0.95);}
    to   { opacity: 1; transform: translateY(0) scale(1);}
  }
`;
document.head.appendChild(style);

function ContentApp() {
  const [selectedText, setSelectedText] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

const getAISummary = async (text: string): Promise<void> => {
    setIsLoading(true);
    setAiResponse("");
    try {
        const response = await chrome.runtime.sendMessage({
            type: "analyze",
            payload: {
                question: "Provide a concise summary of this text",
                webpage_content: text,
                source_url: window.location.href
            } as AnalyzePayload
        });
        setAiResponse((response as ChromeResponse).answer || "No response from AI.");
    } catch (error) {
        console.error("Error getting AI summary:", error);
        setAiResponse("Error: Could not get AI summary.");
    } finally {
        setIsLoading(false);
    }
};

interface AnalyzePayload {
    question: string;
    webpage_content: string;
    source_url: string;
}

interface ChromeResponse {
    answer: string;
}

const handleAsk = async (question: string): Promise<void> => {
    setIsLoading(true);
    try {
        const response = await chrome.runtime.sendMessage({
            type: "analyze",
            payload: {
                question,
                webpage_content: selectedText,
                source_url: window.location.href
            } as AnalyzePayload
        });
        setAiResponse((response as ChromeResponse).answer || "No response from AI.");
    } catch (error) {
        console.error("Error asking question:", error);
        setAiResponse("Error: Could not get response.");
    } finally {
        setIsLoading(false);
    }
};

  const handleClose = () => {
    setIsVisible(false);
    setSelectedText("");
    setAiResponse("");
  };

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();
      if (text && text.length > 10 && selection) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const x = rect.left + window.scrollX;
        const y = rect.bottom + window.scrollY + 10;
        setPosition({ x, y });
        setSelectedText(text);
        setIsVisible(true);
        getAISummary(text);
      } else if (!text) {
        setIsVisible(false);
      }
    };
    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("touchend", handleSelection);
    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("touchend", handleSelection);
    };
  }, []);

  return (
    // Just wrap Bubble in a flex container using Tailwind
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-2147483647">
      <Bubble
        selectedText={selectedText}
        onAsk={handleAsk}
        onClose={handleClose}
        aiResponse={aiResponse}
        isLoading={isLoading}
        isVisible={isVisible}
        position={position}
      />
    </div>
  );
}

const container = document.createElement("div");
container.id = "hover-ai-lens-root";
document.body.appendChild(container);
const root = createRoot(container);
root.render(<ContentApp />);
console.log("🎉 Hover AI Lens content script loaded successfully"); 
