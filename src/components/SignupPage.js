import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiConnector } from "../apiConnector";
import toast from "react-hot-toast";

const SignupPage = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiConnector(
        "POST",
        "http://localhost:4000/api/v1/register",
        {
          username,
          email,
          password,
        }
      );
      console.log(response);
      toast.success("Account created successfully!");
      navigate("/login"); // Navigate to login page after signup
    } catch (error) {
      toast.error("Failed to sign up");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Signup</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={username}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
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
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Signup
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
