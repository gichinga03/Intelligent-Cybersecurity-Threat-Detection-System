"use client";

import { useState } from "react";
import { auth } from "../login/firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const register = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/logs");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const registerWithGoogle = async () => {
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/logs");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form onSubmit={register} className="bg-zinc-900 p-8 rounded-lg shadow-lg w-full max-w-md space-y-6 border border-zinc-800">
        <h1 className="text-2xl font-bold text-white text-center">Register</h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="border border-zinc-700 bg-zinc-800 text-white p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="border border-zinc-700 bg-zinc-800 text-white p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full font-semibold transition-colors">
          Register
        </button>
        <button
          type="button"
          onClick={registerWithGoogle}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded w-full font-semibold transition-colors"
        >
          Register with Google
        </button>
        <p className="mt-2 text-center text-zinc-400">
          Already have an account? <a href="/login" className="text-blue-400 underline hover:text-blue-300">Login here</a>
        </p>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}