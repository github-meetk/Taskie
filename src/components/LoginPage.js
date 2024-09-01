import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiConnector } from "../apiConnector";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setToken, setUserData } from "../slice/authSlice";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiConnector(
        "POST",
        "http://localhost:4000/api/v1/login",
        {
          email,
          password,
        }
      );
      toast.success("Logged in successfully!");
      dispatch(setToken(response.data.token));
      dispatch(setUserData(response.data.user));
      localStorage.setItem("token", JSON.stringify(response.data.token));
      localStorage.setItem("userData", JSON.stringify(response.data.user));
      navigate("/"); // Navigate to dashboard or home page after login
    } catch (error) {
      toast.error("Failed to log in");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Login
        </button>
        <Link to={"/signup"}>not registered?</Link>
      </form>
    </div>
  );
};

export default LoginPage;
