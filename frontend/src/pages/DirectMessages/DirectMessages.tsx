import { Link } from "react-router-dom";
import default_image from "../../assets/default.png";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { AuthContext, SelectedMessageContext } from "../../App";
import api from "../../services/api";
import formatDates, {
  calculateDate,
  formatDate,
} from "../../services/formatData";

interface Message {
  id: number;
  sender: number;
  receiver: number;
  content: string;
  timestamp: string;
}

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
}

const DirectMessages = () => {
  const [currentUser, setCurrentUser] = useState(null);

  const [messaged, setMessaged] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>();
  const { selected, setSelected } = useContext(SelectedMessageContext);
  const [message, setMessage] = useState<String>();
  const form = "";

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    api
      .get("/api/profiles/")
      .then((res) => {
        setUsers(res.data);
        console.log(res.data, "users");
      })
      .catch((err) => console.log(err));
    api.get("/api/profiles/my/").then((res) => setCurrentUser(res.data));
  }, []);

  useEffect(() => {
    if (selected !== 0) {
      api
        .get(`/api/message/${selected}/`)
        .then((res) => {
          setMessaged(res.data);
          console.log(res.data, "messages");
        })
        .catch((err) => console.log(err));
    }
  }, [selected]);

  useEffect(() => {
    scrollToBottom();
  }, [messaged]);

  const handleSubmit = (e: React.FormEvent) => {
    console.log(currentUser, "User");
    e.preventDefault();
    const formData = new FormData();
    formData.append("sender", currentUser.id);
    formData.append("recipient", selected.toString());
    console.log(formData, "Formed");
    if (message) {
      formData.append("content", message.toString());
    }
    api
      .post(`/api/message/${selected}/`, formData)
      .then((res) => {
        setMessaged((prev) => [...prev, res.data]);
        setMessage("");
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div id="message">
        <div className="flex h-full ">
          {/* Side Bar */}
          <div className=" h-screen p-4 max-w-sm w-full border-r border-gray-300">
            {/* Header */}
            <div className="flex justify-between w-full">
              <h1 className="text-2xl font-bold"> Messages </h1>
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
            {/* Users */}
            <div className="mt-8">
              {users?.map(
                (user) =>
                  user.id != currentUser.id && (
                    <>
                      <div
                        key={user.id}
                        onClick={() => setSelected(user.id)}
                        className={`flex mb-4 items-center p-2 ${
                          selected == user.id && "bg-gray-100"
                        } rounded-lg cursor-pointer`}
                      >
                        <img
                          src={default_image}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="ml-4">
                          <h2 className="font-semibold">
                            {user.first_name} {user.last_name}
                            <span className="text-gray-600">
                              @{user.username}
                            </span>
                          </h2>
                          <p className="text-gray-600">Last messageed d.m.y</p>
                        </div>
                      </div>
                    </>
                  )
              )}
            </div>
          </div>
          {/* Chat Area */}
          <div className="flex-1 h-screen">
            {/* User Header */}
            {users?.find((user) => user.id === selected) && (
              <div
                key={selected}
                className="p-4 flex border-b border-gray-300 pb-4 bg-gray-100"
              >
                <img src={default_image} className="w-12 h-12" />
                <div className="ml-4">
                  <h2 className="font-semibold">
                    {users.find((user) => user.id === selected)?.first_name}{" "}
                    {users.find((user) => user.id === selected)?.last_name}{" "}
                    <span className="text-gray-600">
                      @{users.find((user) => user.id === selected)?.username}
                    </span>
                  </h2>
                  <p className="text-gray-500"> Last seen recently </p>
                </div>
              </div>
            )}

            {/* Chat */}
            <div className="p-4 h-[78vh] overflow-y-auto">
              {messaged?.map((message, index) => {
                const prevMessage = messaged[index - 1];
                const currentDay = new Date(message.timestamp)
                  .toISOString()
                  .split("T")[0];
                const prevDay = prevMessage
                  ? new Date(prevMessage.timestamp).toISOString().split("T")[0]
                  : null;
                const showDate = index === 0 || currentDay !== prevDay;

                return message.sender == currentUser.id ? (
                  <>
                    <div key={message.id} className="mb-4">
                      {showDate && (
                        <div className="flex justify-center mb-2">
                          <p className="border border-gray-100 text-gray-500 rounded-full bg-gray-200 px-2 py-1">
                            {formatDates(message.timestamp)}
                          </p>
                        </div>
                      )}
                      <div className="flex justify-end mb-2">
                        <div className="bg-blue-600 text-white p-2 rounded-lg max-w-xs">
                          <p>{message.content}</p>
                          <p className="text-gray-400 text-2xs">
                            {" "}
                            {formatDate(message.timestamp)}{" "}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div key={message.id} className="flex justify-start mb-2">
                      {showDate && (
                        <div className="flex justify-center mb-2 w-full pb-4">
                          <p className="border border-gray-100 text-gray-500 rounded-full bg-gray-200 px-2 py-1">
                            {formatDates(message.timestamp)}
                          </p>
                        </div>
                      )}
                      <div className="bg-gray-200 text-gray-800 p-2 rounded-lg max-w-xs">
                        <p>{message.content}</p>
                        <p className="text-gray-400 text-2xs">
                          {" "}
                          {formatDate(message.timestamp)}{" "}
                        </p>
                      </div>
                    </div>
                  </>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            {/* Message Input */}
            {selected != 0 && (
              <div className="p-4">
                <form className="flex items-center" onSubmit={handleSubmit}>
                  <input
                    onChange={(e) => setMessage(e.target.value)}
                    type="text"
                    value={message || form}
                    placeholder="Type your message..."
                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <button
                    type="submit"
                    className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
                  >
                    Send
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DirectMessages;
