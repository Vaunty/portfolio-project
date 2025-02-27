import React, { useState } from "react";
import axios from "axios";
import { Send, MessageSquare, X } from "lucide-react"; // Icons for UI

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");

  // Load API Key from environment
  const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
  const API_URL = "https://api.openai.com/v1/chat/completions";

  // Debugging - Check if API Key is loaded correctly
  console.log("API Key:", API_KEY);

  if (!API_KEY) {
    console.error("🚨 OpenAI API key is missing! Check your .env file.");
  }

  const sendMessage = async () => {
    if (!input.trim()) return; // Prevent empty messages

    // Add user message to chat
    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await axios.post(
        API_URL,
        {
          model: "gpt-4", // Ensure the model is correct
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            ...newMessages.map((msg) => ({
              role: msg.sender === "bot" ? "assistant" : "user",
              content: msg.text,
            })),
          ],
          max_tokens: 150,
        },
        {
          headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const botReply = response.data.choices[0]?.message?.content || "Sorry, I couldn't process your request.";
      setMessages([...newMessages, { text: botReply, sender: "bot" }]);
    } catch (error) {
      console.error("❌ Error fetching AI response:", error);
      setMessages([...newMessages, { text: "Sorry, I couldn't process your request.", sender: "bot" }]);
    }
  };

  return (
    <>
      {/* Floating Chat Bubble */}
      <div
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MessageSquare size={24} />
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-16 right-6 w-80 bg-white shadow-lg rounded-lg flex flex-col">
          {/* Chat Header */}
          <div className="bg-blue-600 text-white p-3 flex justify-between items-center rounded-t-lg">
            <h3 className="text-lg font-bold">AI Assistant</h3>
            <button onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="p-3 h-64 overflow-y-auto space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg ${
                  msg.sender === "bot"
                    ? "bg-gray-200 text-gray-800"
                    : "bg-blue-500 text-white self-end"
                } max-w-[75%]`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input Field */}
          <div className="flex items-center p-3 border-t">
            <input
              type="text"
              className="flex-1 p-2 border rounded-lg focus:outline-none"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              onClick={sendMessage}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
