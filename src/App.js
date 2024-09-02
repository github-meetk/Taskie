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
import Profile from "./components/Profile";

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
            <div className="flex items-center justify-center">
              {userData?.role === "admin" && token && (
                <button
                  onClick={() => navigate("/permission")}
                  className="relative m-auto inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white"
                >
                  <span className="relative px-5 text-gray-900 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-white-900 rounded-md group-hover:bg-opacity-0 group-hover:text-white">
                    Dashboard
                  </span>
                </button>
              )}
              {token && (
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    dispatch(setToken(null));
                    dispatch(setUserData(null));
                    navigate("/login");
                    toast.success("/Logout successfully!!!");
                  }}
                  className="m-auto py-3 text-white bg-[#2557D6] hover:bg-[#2557D6]/90 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#2557D6]/50 mb-2"
                >
                  Logout
                </button>
              )}

              {token && (
                <button
                  onClick={() => navigate("/profile")}
                  className="m-2 flex items-center justify-center gap-3 p-1.5 px-4 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 text-white hover:from-blue-500 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-transform transform hover:scale-105"
                >
                  <svg
                    className="h-8 w-8"
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
                  <div className="text-lg font-semibold">
                    {userData?.username}
                  </div>
                </button>
              )}
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
          <Route
            path="/profile"
            element={
              <OpenRoute>
                <Profile />
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
