import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

function ChatSection() {

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello 👋 I am your AI College Assistant.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // SEND MESSAGE TO BACKEND
  // =========================
  const sendMessage = async () => {

    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    setInput("");
    setLoading(true);

    try {

      const res = await axios.post("http://localhost:8000/chat", {
        message: input,
      });

      const botReply = res.data.reply;

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: botReply,
        },
      ]);

    } catch (error) {

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Backend Error ❌ Cannot connect to server",
        },
      ]);

    }

    setLoading(false);
  };

  return (
    <motion.div
      className="chat-section"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >

      <div className="chat-header">
        AI Chatbot
      </div>

      {/* CHAT BOX */}
      <div className="chat-box">

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender}`}
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <div className="message bot">
            Typing...
          </div>
        )}

      </div>

      {/* INPUT */}
      <div className="chat-input">

        <input
          type="text"
          placeholder="Ask anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />

        <button onClick={sendMessage}>
          Send
        </button>

      </div>

    </motion.div>
  );
}

export default ChatSection;