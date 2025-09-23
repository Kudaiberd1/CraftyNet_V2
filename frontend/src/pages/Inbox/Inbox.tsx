import { useState } from "react";
import NavBar from "../Menu/NavBar";

const Inbox = () => {
  const [selected, setSelected] = useState(1);
  return (
    <>
      <NavBar />
      <div className="p-4 sm:ml-64">
        <div className="p-4 mt-14">
          <div className="flex justify-between items-center px-10">
            <h1
              className={`text-xl ${
                selected === 1 && "underline"
              } cursor-pointer`}
              onClick={() => setSelected(1)}
            >
              {" "}
              All{" "}
            </h1>
            <h1
              className={`text-xl ${
                selected === 2 && "underline"
              } cursor-pointer`}
              onClick={() => setSelected(2)}
            >
              {" "}
              Unseen{" "}
            </h1>
            <h1
              className={`text-xl ${
                selected === 3 && "underline"
              } cursor-pointer`}
              onClick={() => setSelected(3)}
            >
              {" "}
              Seen{" "}
            </h1>
          </div>
          <hr />
        </div>
      </div>
    </>
  );
};

export default Inbox;
