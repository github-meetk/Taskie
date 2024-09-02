import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { userData } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors duration-200"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
        <h1 className="text-3xl font-bold mb-4 text-center">User Profile</h1>
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center mb-4">
            <span className="text-2xl text-gray-600">
              {userData.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <h2 className="text-2xl font-semibold mb-2">{userData.username}</h2>
          <p className="text-gray-500 mb-2">{userData.email}</p>
          <p className="text-gray-600 mb-4">Role: {userData.role}</p>
          <div className="bg-gray-50 p-4 rounded-md shadow-sm w-full">
            <h3 className="text-lg font-medium mb-2">Permissions</h3>
            <ul className="list-disc list-inside">
              <li
                className={`mb-1 ${
                  userData.permissions.canCreateLocation
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                Create Location:{" "}
                {userData.permissions.canCreateLocation
                  ? "Approved"
                  : "Not Approved"}
              </li>
              <li
                className={`mb-1 ${
                  userData.permissions.canCreateTask
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                Create Task:{" "}
                {userData.permissions.canCreateTask
                  ? "Approved"
                  : "Not Approved"}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
