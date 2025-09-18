import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function Chat() {
  const [messages, setMessages] = useState<
    { message: string; username?: string; timestamp?: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Fetch past messages

    api.get("http://localhost:8000/chat-messages/").then((res) => {
      console.log(res);
      const data = res.data.results || res.data; // handle both paginated & non
      if (Array.isArray(data)) {
        const formatted = data.map((msg: any) => ({
          message: msg.content,
          username: msg.sender,
          timestamp: msg.timestamp,
        }));
        setMessages(formatted);
      }
    });

    console.log(messages, "messages");

    // Connect WebSocket
    const token = localStorage.getItem("access");
    const ws = new WebSocket(
      `ws://localhost:8000/ws/chat/testroom/?token=${token}`
    );
    setSocket(ws);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    return () => ws.close();
  }, []);

  const sendMessage = () => {
    if (socket && input.trim() !== "") {
      socket.send(JSON.stringify({ message: input }));
      setInput("");
    }
  };

  return (
    <div>
      <h2>Chat Room</h2>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "200px",
          overflowY: "scroll",
        }}
      >
        {messages.map((msg, i) => (
          <div key={i}>
            <b>{msg.username || "Anonymous"}:</b> {msg.message}{" "}
            {msg.timestamp && (
              <small>({new Date(msg.timestamp).toLocaleTimeString()})</small>
            )}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
