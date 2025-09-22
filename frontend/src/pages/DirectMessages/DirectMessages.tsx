import default_image from "../../assets/default.png";
import { useContext, useEffect, useRef, useState } from "react";
import { SelectedMessageContext } from "../../App";
import api from "../../services/api";
import { formatDate } from "../../services/formatData";
import { format } from "date-fns"; // install: npm install date-fns
import { Link } from "react-router-dom";

interface Message {
  id: number;
  sender: number;
  receiver: number;
  content: string;
  timestamp: string;
}

interface OutgoingMessage {
  type: string;
  message: string;
  sender: number;
  receiver: number;
}

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
}

const DirectMessages = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const { selected, setSelected } = useContext(SelectedMessageContext);
  const [messageInput, setMessageInput] = useState<string>("");

  const wsRef = useRef<WebSocket | null>(null);
  const messageQueueRef = useRef<OutgoingMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load users and current user
  useEffect(() => {
    api.get("/api/profiles/").then((res) => setUsers(res.data));
    api.get("/api/profiles/my/").then((res) => setCurrentUser(res.data));
  }, []);

  // Load messages when a user is selected
  useEffect(() => {
    if (selected !== 0) {
      api.get(`/api/message/${selected}/`).then((res) => setMessages(res.data));
    } else {
      setMessages([]);
    }
  }, [selected]);

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !currentUser) return;

    const msgToSend: OutgoingMessage = {
      type: "chat",
      message: messageInput.trim(),
      sender: currentUser.id,
      receiver: selected,
    };

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msgToSend));
    } else {
      messageQueueRef.current.push(msgToSend);
    }

    setMessageInput("");
  };

  const connectWebSocket = () => {
    if (!currentUser || selected === 0) return;
    const token = localStorage.getItem("access");
    if (!token) return;

    const roomName =
      currentUser.id < selected
        ? `${currentUser.id}_${selected}`
        : `${selected}_${currentUser.id}`;

    const ws = new WebSocket(
      `ws://127.0.0.1:8000/ws/chat/${roomName}/?token=${token}`
    );
    wsRef.current = ws;

    ws.onopen = () => {
      while (messageQueueRef.current.length > 0) {
        ws.send(JSON.stringify(messageQueueRef.current.shift()));
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const formattedMessage: Message = {
          id: data.id || Date.now(),
          sender: data.sender,
          receiver: data.receiver,
          content: data.message,
          timestamp: data.timestamp || new Date().toISOString(),
        };

        setMessages((prev) => {
          if (prev.some((msg) => msg.id === formattedMessage.id)) return prev;
          return [...prev, formattedMessage];
        });
      } catch (err) {
        console.error("WebSocket parse error:", err);
      }
    };

    ws.onclose = () => {
      wsRef.current = null;
      setTimeout(connectWebSocket, 3000);
    };

    ws.onerror = (err) => console.error("WebSocket error:", err);
  };

  useEffect(() => {
    connectWebSocket();
    return () => wsRef.current?.close();
  }, [currentUser, selected]);

  const selectedUser = users.find((u) => u.id === selected);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="h-screen p-4 max-w-sm w-full border-r border-gray-300">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Messages</h1>
          <div className="flex space-x-4 p-1">
            <Link to="/" className="group">
              <svg
                className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 18 18"
              >
                <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
              </svg>
            </Link>
            <Link to="/users" className="group">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </Link>
          </div>
        </div>
        <div className="mt-8">
          {users
            .filter((u) => u.id !== currentUser?.id)
            .map((user) => (
              <div
                key={user.id}
                onClick={() => setSelected(user.id)}
                className={`flex mb-4 items-center p-2 rounded-lg cursor-pointer ${
                  selected === user.id ? "bg-gray-100" : ""
                }`}
              >
                <img
                  src={default_image}
                  alt={`${user.first_name} ${user.last_name}`}
                  className="w-12 h-12 rounded-full"
                />
                <div className="ml-4">
                  <h2 className="font-semibold">
                    {user.first_name} {user.last_name}{" "}
                    <span className="text-gray-600">@{user.username}</span>
                  </h2>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 h-screen flex flex-col">
        {selectedUser && (
          <div className="p-4 flex border-b border-gray-300 pb-4 bg-gray-100">
            <img
              src={default_image}
              alt={`${selectedUser.first_name} ${selectedUser.last_name}`}
              className="w-12 h-12"
            />
            <div className="ml-4">
              <h2 className="font-semibold">
                {selectedUser.first_name} {selectedUser.last_name}{" "}
                <span className="text-gray-600">@{selectedUser.username}</span>
              </h2>
            </div>
          </div>
        )}

        <div className="p-4 h-[78vh] overflow-y-auto flex-1">
          {messages.map((msg, index) => {
            const msgDate = format(new Date(msg.timestamp), "MMMM d");

            const prevDate =
              index > 0
                ? format(new Date(messages[index - 1].timestamp), "MMMM d")
                : null;

            const showDate = msgDate !== prevDate;

            return (
              <div key={msg.id}>
                {/* Date divider */}
                {showDate && (
                  <div className="flex justify-center my-4">
                    <span className="bg-gray-200 text-back px-3 py-1 rounded-lg text-sm font-medium">
                      {msgDate}
                    </span>
                  </div>
                )}

                {/* Message */}
                <div
                  className={`mb-4 ${
                    msg.sender === currentUser?.id ? "flex justify-end" : ""
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg max-w-xs w-auto ${
                      msg.sender === currentUser?.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p className="text-gray-400 text-2xs">
                      {formatDate(msg.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {selected !== 0 && (
          <div className="p-4">
            <form className="flex items-center" onSubmit={handleSubmit}>
              <input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                type="text"
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="submit"
                className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectMessages;
