"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // LOGIN
        const response = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        localStorage.setItem('token', data.token);
        if (!response.ok) throw new Error(data.message || "Login failed");

        if (data?.user?._id) {
          localStorage.setItem("userId", data.user._id);
          localStorage.setItem("token", data.access_token);
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        router.push("/path");
      } else {
        // REGISTER
        const registerRes = await fetch(`${API_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ name, email, password }),
        });

        if (!registerRes.ok) {
          const errData = await registerRes.json();
          throw new Error(errData.message || "Registration failed");
        }

        // AUTO-LOGIN
        const loginRes = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });

        const loginData = await loginRes.json();
        if (loginRes.ok && loginData?.user?._id) {
          localStorage.setItem("userId", loginData.user._id);
          localStorage.setItem("token", loginData.access_token);
          localStorage.setItem("user", JSON.stringify(loginData.user));
          router.push("/path");
        } else {
          setIsLogin(true);
          setError("Registration successful! Please log in.");
        }
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-900 via-indigo-900 to-purple-900 p-6 text-white relative overflow-hidden">
      {/* Magical background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.2),transparent_50%),radial-gradient(circle_at_80%_0%,rgba(236,72,153,0.15),transparent_50%)] pointer-events-none"></div>

      <div className="w-full max-w-md bg-gradient-to-b from-purple-800/70 to-indigo-800/70 rounded-2xl shadow-2xl p-8 border border-purple-700/40 backdrop-blur-lg relative z-10">
        <h1 className="text-3xl font-extrabold text-center text-purple-300 mb-6">
          {isLogin ? "🔮 Welcome Back, Apprentice" : "🧙‍♂️ Join the Zero2Hero Guild"}
        </h1>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-pink-500/20 border border-pink-400 text-pink-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-purple-200 font-medium mb-1">Username</label>
              <input
                type="text"
                placeholder="Enter your hero name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-purple-900/40 border border-purple-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-purple-200 font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="you@zero2hero.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-purple-900/40 border border-purple-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          <div>
            <label className="block text-purple-200 font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your secret spell"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-purple-900/40 border border-purple-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Casting Spell..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="text-center text-purple-300 mt-6">
          {isLogin ? "New to the guild?" : "Already a member?"}{" "}
          <span
            className="text-pink-400 font-semibold cursor-pointer hover:underline"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
          >
            {isLogin ? "Join Now" : "Login"}
          </span>
        </p>

        <p className="text-sm text-indigo-300 text-center mt-4 italic">
          💡 Each login brings you closer to mastering decomposition.
        </p>
      </div>
    </div>
  );
}
