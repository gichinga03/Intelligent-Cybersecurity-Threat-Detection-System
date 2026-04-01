// components/RegisterForm.tsx
"use client";

import { useState } from "react";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [computerName, setComputerName] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [lastName, setLastName] = useState("");
  const [virusTotalApi, setVirusTotalApi] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          computer_name: computerName,
          username,
          first_name: firstName,
          second_name: secondName,
          last_name: lastName,
          virus_total_api: virusTotalApi || null,
          other_computers: []
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage("✅ Registration successful!");
        // Store user data in localStorage
        localStorage.setItem("email", email);
        localStorage.setItem("computer_name", computerName);
        localStorage.setItem("username", username);
        localStorage.setItem("first_name", firstName);
        localStorage.setItem("second_name", secondName);
        localStorage.setItem("last_name", lastName);
        if (virusTotalApi) localStorage.setItem("virus_total_api", virusTotalApi);
      } else {
        setMessage(`❌ ${data.error || "Registration failed"}`);
      }
    } catch (error) {
      setMessage("❌ Error connecting to server");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="flex flex-col space-y-4">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className="p-2 bg-gray-700 border border-gray-600 rounded text-white"
      />

      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
        className="p-2 bg-gray-700 border border-gray-600 rounded text-white"
      />

      <input
        type="text"
        placeholder="Second Name"
        value={secondName}
        onChange={(e) => setSecondName(e.target.value)}
        required
        className="p-2 bg-gray-700 border border-gray-600 rounded text-white"
      />

      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
        className="p-2 bg-gray-700 border border-gray-600 rounded text-white"
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="p-2 bg-gray-700 border border-gray-600 rounded text-white"
      />

      <input
        type="text"
        placeholder="Computer Name"
        value={computerName}
        onChange={(e) => setComputerName(e.target.value)}
        required
        className="p-2 bg-gray-700 border border-gray-600 rounded text-white"
      />

      <input
        type="text"
        placeholder="VirusTotal API Key (Optional)"
        value={virusTotalApi}
        onChange={(e) => setVirusTotalApi(e.target.value)}
        className="p-2 bg-gray-700 border border-gray-600 rounded text-white"
      />

      <button
        type="submit"
        className="p-2 bg-blue-600 hover:bg-blue-700 rounded font-bold"
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </button>

      {message && <p className="text-sm text-center">{message}</p>}

      <p className="text-sm text-center text-gray-400">
        Already have an account?{" "}
        <a href="/login" className="text-blue-400 hover:text-blue-300 underline">
          Login here
        </a>
      </p>
    </form>
  );
}
