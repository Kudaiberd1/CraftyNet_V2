import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Chat() {
  const [messages, setMessages] = useState<
    { message: string; username?: string; timestamp?: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const roomId = "1-2";

    // Fetch past messages
    api.get(`http://localhost:8000/chat-messages/`).then((res) => {
      const data = res.data.results || res.data;
      if (Array.isArray(data)) {
        setMessages(
          data.map((msg: any) => ({
            message: msg.content,
            username: msg.sender,
            timestamp: msg.timestamp,
          }))
        );
      }
    });

    const token = localStorage.getItem("access");
    const ws = new WebSocket(`ws://localhost:8000/ws/chat/1/2/?token=${token}`);
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
          padding: 10,
          height: 200,
          overflowY: "scroll",
        }}
      >
        {messages.map((msg, i) => (
          <div key={i}>
            <b>{msg.username || "Anonymous"}:</b> {msg.message}
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
