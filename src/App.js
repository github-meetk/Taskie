import React from "react";
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import TaskModule from "./components/TaskModule";
import LocationModule from "./components/LocationModule";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import OpenRoute from "./components/OpenRoute";
import Permission from "./components/Permission";
import { useDispatch, useSelector } from "react-redux";
import { setToken, setUserData } from "./slice/authSlice";
import toast from "react-hot-toast";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, userData } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-blue-600">Taskie</span>
              </Link>
            </div>
            <div className="flex items-center">
              {userData?.role === "admin" && (
                <button
                  className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                  onClick={() => navigate("/permission")}
                >
                  Give Permission
                </button>
              )}
              {token && (
                <button
                  className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                  onClick={() => {
                    localStorage.removeItem("token");
                    dispatch(setToken(null));
                    dispatch(setUserData(null));
                    navigate("/login");
                    toast.success("/Logout successfully!!!");
                  }}
                >
                  logout
                </button>
              )}

              <button className="ml-3 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <span className="sr-only">User menu</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
              <div>{userData?.username}</div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/"
            element={
              <OpenRoute>
                <Dashboard />
              </OpenRoute>
            }
          />
          <Route path="/tasks" element={<TaskModule />} />
          <Route path="/locations" element={<LocationModule />} />
          <Route path="/permission" element={<Permission />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
