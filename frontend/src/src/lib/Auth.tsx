import React, { useState } from "react";
import axios from "axios";
import fs from "fs";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [computerName, setComputerName] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/authenticate", {
        email,
        computer_name: computerName,
      });

      if (response.status === 200) {
        // Save email to config.json
        fs.writeFileSync("config.json", JSON.stringify({ email }, null, 4));

        setMessage("Login Successful! You can close this window.");
      } else {
        setMessage("Authentication failed. Please try again.");
      }
    } catch (error) {
      setMessage("Error: Unable to authenticate.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <input
        type="text"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-2 p-2 border border-gray-600 rounded"
      />
      <input
        type="text"
        placeholder="Enter your computer name"
        value={computerName}
        onChange={(e) => setComputerName(e.target.value)}
        className="mb-2 p-2 border border-gray-600 rounded"
      />
      <button
        onClick={handleLogin}
        className="bg-green-500 px-4 py-2 rounded text-black font-semibold"
      >
        Authenticate
      </button>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default Auth;
