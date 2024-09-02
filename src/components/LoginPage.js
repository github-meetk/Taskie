import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiConnector } from "../apiConnector";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setToken, setUserData } from "../slice/authSlice";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await apiConnector("POST", BASE_URL + "/api/v1/login", {
        email,
        password,
      });
      toast.success("Logged in successfully!");
      dispatch(setToken(response.data.token));
      dispatch(setUserData(response.data.user));
      localStorage.setItem("token", JSON.stringify(response.data.token));
      localStorage.setItem("userData", JSON.stringify(response.data.user));
      navigate("/");
    } catch (error) {
      toast.error("Failed to log in");
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-indigo-600"></div>
        </div>
      ) : (
        <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
          <h1 className="text-4xl font-semibold text-center text-blue-600">
            Welcome Back
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Login
            </button>
          </form>
          <p className="text-center text-sm text-gray-500">
            Not registered?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
