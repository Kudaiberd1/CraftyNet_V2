import { Link } from "react-router-dom";
import icon from "../../assets/icon.svg";
import { useContext, useState } from "react";
import { authorizedContext } from "../../components/ProtectedRoute";
import "flowbite";

const OnlyNavBar = () => {
  const [open, setOpen] = useState(false);
  const { isAuthorized } = useContext(authorizedContext);
  return (
    <nav className="fixed flex top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="p-3 flex items-center justify-between w-full">
        <button
          data-drawer-target="logo-sidebar"
          data-drawer-toggle="logo-sidebar"
          aria-controls="logo-sidebar"
          type="button"
          className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
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
              clip-rule="evenodd"
              fill-rule="evenodd"
              d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
            ></path>
          </svg>
        </button>
        {/* Logo */}
        <Link className="flex ms-2 md:me-24" to="/">
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
                    <Link
                      to="/my"
                      className="block px-4 py-2 text-sm hover:bg-gray-100 "
                    >
                      Settings
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/logout"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Log out
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

export default OnlyNavBar;
