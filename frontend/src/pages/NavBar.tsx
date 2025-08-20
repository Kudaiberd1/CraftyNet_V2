import { Link } from "react-router-dom";
import icon from "../assets/icon.svg";
import { useContext, useState } from "react";
import { authorizedContext } from "../components/ProtectedRoute";

const SideBar = () => {
  const [open, setOpen] = useState(false);
  const { isAuthorized } = useContext(authorizedContext);
  return (
    <nav className="fixed flex top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="p-3 flex items-center justify-between w-full">
        {/* Logo */}
        <Link className="flex ms-2" to="/">
          <img src={icon} className="h-11 me-3 flex" />
          <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap">
            CraftyNet
          </span>
        </Link>

        {/* User menu */}

        {isAuthorized ? (
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex text-sm rounded-full focus:ring-4 focus:ring-gray-300"
            >
              <img
                className="h-10 rounded-full"
                src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                alt="user"
              />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-sm shadow-sm">
                <div className="px-4 py-3">
                  <p className="text-sm">Neil Sims</p>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    neil.sims@flowbite.com
                  </p>
                </div>
                <hr className="border-t border-gray-200" />
                <ul className="py-1">
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm hover:bg-gray-100 "
                    >
                      Settings
                    </a>
                  </li>
                  <li>
                    <Link
                      to="/logout"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Sign out
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-4">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-500 rounded hover:bg-emerald-600"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-medium text-emerald-500 border border-emerald-500 rounded hover:bg-emerald-50"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default SideBar;
