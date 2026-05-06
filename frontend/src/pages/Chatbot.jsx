import { useState, useRef, useEffect } from "react";
import { Send, Loader, Mic, MicOff, Volume2 } from "lucide-react";
import { getChatHistory, sendMessage as sendChatMessage } from "../api/chat";

export default function Chatbot({ currentUser }) {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "👋 Welcome! I'm your AI College Assistant powered by Groq. I can help you with:\n\n• 📊 Attendance tracking\n• 📈 Marks & Performance\n• 📅 Exam schedules\n• 📚 Study resources\n• 🎓 Academic guidance\n• 🤔 FAQs & more!\n\nWhat can I help you with today?",
      timestamp: new Date()
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [botMuted, setBotMuted] = useState(false);
  const recognitionRef = useRef(null);
  const chatRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    if (chatRef.current) {
      setTimeout(() => {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }, 0);
    }
  }, [messages]);

  useEffect(() => {
    const loadHistory = async () => {
      setInitialLoading(true);
      try {
        const history = await getChatHistory(currentUser || "student");
        if (history && history.length > 0) {
          setMessages(history.map((entry) => ({
            role: entry.role,
            text: entry.text,
            timestamp: new Date(entry.timestamp),
          })));
        }
      } catch (error) {
        console.error("Error loading chat history:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadHistory();
  }, [currentUser]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      setVoiceSupported(true);

      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsRecording(false);
        if (transcript.trim()) {
          handleSendMessage(transcript.trim());
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }

    setSpeechSupported(typeof window !== "undefined" && "speechSynthesis" in window);

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const speakText = (text) => {
    if (!speechSupported || botMuted || !text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    const userMsg = { role: "user", text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const reply = await sendChatMessage(text, currentUser || "student");
      const botMsg = {
        role: "bot",
        text: reply || "I couldn't process that request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      speakText(botMsg.text);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, {
        role: "bot",
        text: "⚠️ Connection error. Please check your internet and try again.",
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    await handleSendMessage(input.trim());
    setInput("");
  };

  const toggleRecording = () => {
    if (!voiceSupported || !recognitionRef.current || loading) return;

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    try {
      recognitionRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Speech recognition start error:", error);
      setIsRecording(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestedQuestions = [
    "What's my current attendance?",
    "How are my marks performing?",
    "When's my next exam?",
    "How can I improve my grades?",
  ];

  const handleSuggestedQuestion = (question) => {
    setInput(question);
  };

  if (initialLoading) {
    return (
      <div className="page-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="loading" />
      </div>
    );
  }

  return (
    <div className="page-container chat-page" style={{ padding: 0 }}>
      <div className="chat-panel glass">
        {/* HEADER */}
        <div className="chat-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '30px' }}>🤖</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <div>
                  <h2>College AI Assistant</h2>
                  <p>
                    Humble and helpful AI answers for attendance, marks, exams, notes, FAQs, and campus guidance.
                  </p>
                </div>
                <button
                  type="button"
                  className={`voice-button ${botMuted ? 'recording' : ''}`}
                  onClick={() => setBotMuted((prev) => !prev)}
                  title={botMuted ? 'Enable bot voice' : 'Mute bot voice'}
                  style={{ alignSelf: 'flex-start' }}
                >
                  <Volume2 size={18} />
                </button>
              </div>
              <div className="voice-status">
                {botMuted
                  ? 'Bot speech is muted.'
                  : voiceSupported
                    ? isRecording
                      ? 'Listening... Speak now.'
                      : 'Tap the microphone to ask by voice.'
                    : 'Voice input is not supported in this browser.'}
              </div>
            </div>
          </div>
        </div>

        {/* CHAT CONTAINER */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '20px 24px 24px' }}>
        {/* MESSAGES */}
        <div
          ref={chatRef}
          className="chat-messages"
          style={{
            flex: 1,
            overflowY: 'auto',
            marginBottom: '20px',
            paddingRight: '10px',
          }}
        >
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>
              <div className="message-content">
                <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: '1.5' }}>
                  {msg.text}
                </div>
                <div style={{
                  fontSize: '10px',
                  marginTop: '6px',
                  opacity: 0.6,
                }}>
                  {msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="message bot">
              <div className="message-content" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="loading" style={{ width: '16px', height: '16px' }} />
                <span>Thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* SUGGESTED QUESTIONS */}
        {messages.length === 1 && (
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              💡 Quick Start Questions
            </p>
            <div className="chat-suggestions">
              {suggestedQuestions.map((question, idx) => (
                <button
                  key={idx}
                  className="chat-chip"
                  onClick={() => handleSuggestedQuestion(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* INPUT AREA */}
        <div className="chat-input-area">
          <button
            type="button"
            className={`voice-button ${isRecording ? "recording" : ""}`}
            onClick={toggleRecording}
            disabled={!voiceSupported || loading}
            title={voiceSupported ? (isRecording ? "Stop voice input" : "Start voice input") : "Voice input unavailable"}
          >
            {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about your college, academics, exams, or general guidance..."
            style={{
              resize: 'none',
              maxHeight: '100px',
            }}
            disabled={loading}
          />
          <button
            className="btn"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              opacity: loading || !input.trim() ? 0.5 : 1,
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              flexShrink: 0,
            }}
          >
            {loading ? <Loader size={16} className="loading" /> : <Send size={16} />}
          </button>
        </div>

        {/* FOOTER INFO */}
        <div style={{
          marginTop: '12px',
          padding: '12px',
          borderRadius: '8px',
          background: 'var(--glass-base)',
          fontSize: '11px',
          color: 'var(--text-muted)',
          textAlign: 'center',
        }}>
          💡 Tip: Be specific in your questions for better results. You can ask about multiple topics!
        </div>
      </div>
    </div>
  </div>
  );
}