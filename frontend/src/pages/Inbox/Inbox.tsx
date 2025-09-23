import { useEffect, useState } from "react";
import NavBar from "../Menu/NavBar";
import api from "../../services/api";
import formatDates from "../../services/formatData";
import { Link } from "react-router-dom";

export interface Inbox {
  id: number;
  sender: string;
  resiever: string;
  context: string;
  link: string;
  timestamp: string;
  sender_username: string;
  readed: boolean;
}

const Inbox = () => {
  const [inbox, setInbox] = useState<Inbox[]>([]);
  const [selected, setSelected] = useState<number[]>([]);

  const [filter, setFilter] = useState("all");

  const filteredInbox = inbox.filter((msg) => {
    if (filter === "unread") return !msg.readed;
    if (filter === "read") return msg.readed;
    return true; // "all"
  });

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selected.map((id) => api.delete(`/api/inbox/${id}/`)));

      setInbox((prev) => prev.filter((msg) => !selected.includes(msg.id)));
      setSelected([]);
    } catch (error) {
      console.error("Failed to delete messages", error);
    }
  };

  const handleReadedSelected = async () => {
    try {
      await Promise.all(
        selected.map((id) => {
          setInbox((prevInbox) =>
            prevInbox.map((msg) =>
              msg.id === id ? { ...msg, readed: true } : msg
            )
          );
          api.patch(`/api/inbox/${id}/`, { readed: true });
        })
      );
    } catch (error) {
      console.error("Failed to delete messages", error);
    }
  };

  useEffect(() => {
    api.get("/api/inbox/1/").then((res) => {
      setInbox(res.data);
      console.log(res.data, "Inbox");
    });
  }, []);

  const handleClick = (id: number) => {
    setInbox((prevInbox) =>
      prevInbox.map((msg) => (msg.id === id ? { ...msg, readed: true } : msg))
    );
    api
      .patch(`/api/inbox/${id}/`, { readed: true })
      .then((res) => {
        console.log("Message updated:", res.data);
      })
      .catch((err) => {
        console.error("Failed to update message:", err);
      });
  };

  return (
    <>
      <NavBar />
      <div className="p-4 sm:ml-64">
        <div className="p-4 mt-14">
          <div>
            <h1 className="text-xl"> Inbox </h1>
          </div>
          <br />
          <div className="flex">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded px-2 py-1 mb-4"
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
            {selected?.length ? (
              <div className="space-x-4 pl-5">
                <button className="text-red-500" onClick={handleDeleteSelected}>
                  {" "}
                  Delete
                </button>
                <button
                  className="text-blue-500"
                  onClick={handleReadedSelected}
                >
                  {" "}
                  Mark as read{" "}
                </button>
              </div>
            ) : (
              <></>
            )}
          </div>

          <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
            <div className="grid grid-cols-12 items-center p-3 bg-gray-100 font-semibold text-gray-700 rounded-t-lg">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-3">Sender</div>
              <div className="col-span-5">Context</div>
              <div className="col-span-2 text-right">Time</div>
            </div>
            {filteredInbox.map((message) => (
              <div
                key={message.id}
                className={`grid grid-cols-12 items-center p-3 hover:bg-gray-50 border-b last:border-none ${
                  !message.readed && "font-bold"
                }`}
              >
                <div className="col-span-1 flex justify-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-blue-600"
                    checked={selected.includes(message.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelected((prev) => [...prev, message.id]);
                      } else {
                        setSelected((prev) =>
                          prev.filter((id) => id !== message.id)
                        );
                      }
                      console.log(selected);
                    }}
                  />
                </div>
                <div className="col-span-3 text-gray-900">
                  {message.sender_username}
                </div>
                <div
                  className="col-span-5 text-sm text-gray-700 truncate"
                  onClick={() => handleClick(message.id)}
                >
                  <Link to={message.link} state={{ scrollTo: "comments" }}>
                    {message.context}
                  </Link>
                </div>
                <div className="col-span-2 text-xs text-gray-500 text-right">
                  {formatDates(message.timestamp)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Inbox;
