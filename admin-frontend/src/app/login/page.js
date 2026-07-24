"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { login } from "../../store/slices/authSlice";
import api from "../../store/services/api";

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { isAuthenticated } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      setError("");

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      dispatch(
        login({
          token: response.data.token,
          admin: response.data.admin,
        }),
      );

      router.push("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6">Admin Login</h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block mb-1">Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1">Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </main>
  );
}
