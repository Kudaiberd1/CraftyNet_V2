import default_image from "../../assets/default.png";
import { useContext, useEffect, useRef, useState } from "react";
import { SelectedMessageContext } from "../../App";
import api from "../../services/api";
import { formatDate } from "../../services/formatData";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Pencil } from "lucide-react";
import { FaTimes } from "react-icons/fa";

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
  const [messageInputt, setMessageInputt] = useState<string>("");

  const wsRef = useRef<WebSocket | null>(null);
  const messageQueueRef = useRef<OutgoingMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [clicked, setClicked] = useState(false);

  const [selectedId, setSelectedId] = useState(-1);

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
    if (sendOrupdate) {
      const data = messages.find((m) => m.id == selectedId);
      const formattedMessage: Message = {
        id: data?.id,
        sender: data?.sender,
        receiver: data?.receiver,
        content: messageInput,
        timestamp: data?.timestamp || new Date().toISOString(),
      };
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.id === selectedId
            ? { ...message, content: formattedMessage.content }
            : message
        )
      );
      api
        .patch(`/api/message/${currentUser.id}/`, formattedMessage)
        .then((res) => console.log("Successfully updated", res.data))
        .catch((err) => console.log("Failed"));
      setMessageInput("");
      setMessageInputt("");
      setSendOrUpdate(false);
      setSelectedId(-1);
      return;
    }

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
    setMessageInputt("");
    handleMessage();
  };

  const deleteMessage = (id: number) => {
    setIsOpen(false);
    setMessages(messages.filter((message) => message.id != id));
    api
      .delete(`/api/message/${currentUser.id}/`, { data: { id: id } })
      .then(() => console.log("Message deleted"))
      .catch((err) => console.log(err.message));
  };

  const handleMessage = async () => {
    try {
      const data = {
        sender: currentUser?.id,
        resiever: selected,
        context: "Direct message",
        link: "/messages",
      };

      const res = await api.post("/api/inbox/1/", data);
      console.log("Successfully sent", res);
    } catch (err) {
      console.log(err);
    }
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

  const handlePopUp = (id: number, sender: number) => {
    if (sender === currentUser?.id) setIsOpen(true);
    setSelectedId(id);
  };

  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const openMenu = (x: number, y: number) => {
    setMenuPos({ x, y });
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    timerRef.current = setTimeout(() => {
      const touch = e.touches[0];
      openMenu(touch.clientX, touch.clientY);
    }, 500); // hold for 500ms
  };

  const handleTouchEnd = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const selectedUser = users.find((u) => u.id === selected);
  const [isOpen, setIsOpen] = useState(false);

  // if true then update else send message
  const [sendOrupdate, setSendOrUpdate] = useState(false);

  const update = () => {
    console.log("Woking");
    setIsOpen(false);
    const data = messages.find((m) => m.id == selectedId);
    setSendOrUpdate(true);
    setMessageInput(data.content);
    setMessageInputt(data.content);
  };

  const cancel = () => {
    setSendOrUpdate(false);
    setMessageInput("");
    setMessageInputt("");
    setSelectedId(-1);
  };

  return (
    <div className="flex h-screen relative">
      {/* Sidebar toggle button (mobile only) */}
      <button
        type="button"
        onClick={() => setClicked(!clicked)}
        className="absolute top-4 left-4 z-20 inline-flex items-center py-2 px-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 bg-white shadow"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`h-screen p-4 max-w-sm w-64 border-r border-gray-300 bg-white absolute sm:static sm:translate-x-0 transform top-0 left-0 z-10 transition-transform duration-300
          ${clicked ? "translate-x-0" : "-translate-x-full"}`}
      >
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
        <div className="mt-8" onClick={() => setIsOpen(false)}>
          {users
            .filter((u) => u.id !== currentUser?.id)
            .map((user) => (
              <div
                key={user.id}
                onClick={() => {
                  setSelected(user.id);
                  setClicked(false); // close sidebar on mobile
                }}
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

        {/* Messages */}
        <div className="p-4 flex-1 overflow-y-auto">
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
                    onContextMenu={() => handlePopUp(msg.id, msg.sender)}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
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
          {/* Pop up window to edit or delete message */}
          {isOpen && (
            <div className="fixed inset-0 bg-gray/30 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-white rounded-2xl shadow-lg p-6 w-80">
                <div className="flex space-x-2">
                  <button
                    onClick={() => deleteMessage(selectedId)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => update()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {sendOrupdate && (
          <div className="py-2 mb-0 border-t border-gray-200">
            <div className="pl-5 flex">
              <Pencil className="my-auto" />
              <div className="mx-3 px-3 border-l border-blue-500 bg-blue-300 w-full rounded-sm border-2px">
                <p className="text-blue-500"> Edit message </p>
                <h4 className="font-bold"> {messageInputt} </h4>
              </div>
              <div
                className="my-auto mr-3 cursor-pointer"
                onClick={() => cancel()}
              >
                <FaTimes />
              </div>
            </div>
          </div>
        )}
        {/* Input (fixed at bottom) */}
        {selected !== 0 && (
          <div className="p-4 border-t bg-white border-gray-200">
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
