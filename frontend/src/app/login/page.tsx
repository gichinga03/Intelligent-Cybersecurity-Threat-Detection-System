"use client";

import { useState } from "react";
import { auth } from "../login/firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user?.email === "threatdetectai@gmail.com") {
        router.push("/admin");
      } else {
        router.push("/logs");
      }
    } catch (error) {
      alert("Login failed");
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user?.email === "threatdetectai@gmail.com") {
        router.push("/admin");
      } else {
        router.push("/logs");
      }
    } catch (error) {
      alert("Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form onSubmit={login} className="bg-zinc-900 p-8 rounded-lg shadow-lg w-full max-w-md space-y-6 border border-zinc-800">
        <h1 className="text-2xl font-bold text-white text-center">Admin Login</h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="border border-zinc-700 bg-zinc-800 text-white p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="border border-zinc-700 bg-zinc-800 text-white p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full font-semibold transition-colors">
          Login
        </button>
        <button
          type="button"
          onClick={loginWithGoogle}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded w-full font-semibold transition-colors"
        >
          Login with Google
        </button>
        <p className="mt-2 text-center text-zinc-400">
          Don&apos;t have an account? <a href="/register" className="text-blue-400 underline hover:text-blue-300">Register here</a>
        </p>
      </form>
    </div>
  );
}
