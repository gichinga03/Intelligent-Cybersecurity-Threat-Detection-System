"use client";
import { useState, useEffect } from "react";
import NavBar from "@/components/navbar";
import Sidebar from "@/components/Sidebar";
import { Moon, Menu, Save, User, Mail, Key, Laptop, Shield } from "lucide-react";

export default function SettingsPage() {
    const [userData, setUserData] = useState({
        username: localStorage.getItem("username") || "",
        email: localStorage.getItem("email") || "",
        first_name: localStorage.getItem("first_name") || "",
        second_name: localStorage.getItem("second_name") || "",
        last_name: localStorage.getItem("last_name") || "",
        computer_name: localStorage.getItem("computer_name") || "",
        virus_total_api: localStorage.getItem("virus_total_api") || "",
        other_computers: JSON.parse(localStorage.getItem("other_computers") || "[]")
    });
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [darkMode, setDarkMode] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const username = localStorage.getItem("username");
        if (username) {
            fetchUserData(username);
        } else {
            setLoading(false);
            setMessage("❌ No user found. Please log in.");
        }
    }, []);

    const fetchUserData = async (username: string) => {
        try {
            console.log("Fetching user data for:", username);
            const response = await fetch(`http://localhost:5000/settings?username=${username}`);
            const data = await response.json();
            console.log("Received data:", data);
            
            if (response.ok) {
                setUserData(prevData => ({
                    ...prevData,
                    ...data
                }));
            } else {
                setMessage(data.error || "Failed to fetch user data");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            setMessage("❌ Error connecting to server");
        } finally {
            setLoading(false);
        }
    };

    const updateSettings = async () => {
        try {
            const response = await fetch("http://localhost:5000/settings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...userData,
                    new_password: password,
                }),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                setMessage("✅ Settings updated successfully!");
                setPassword("");
                // Update localStorage
                Object.entries(userData).forEach(([key, value]) => {
                    if (value) localStorage.setItem(key, value.toString());
                });
            } else {
                setMessage(`❌ ${data.error || "Failed to update settings"}`);
            }
        } catch (error) {
            setMessage("❌ Error connecting to server");
            console.error("Error:", error);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setUserData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"} min-h-screen`}>
            <NavBar />
            <div className="flex">
                <button 
                    onClick={() => setIsOpen(true)} 
                    className="fixed top-4 left-4 p-2 bg-gray-800 text-white rounded-lg"
                >
                    <Menu size={24} />
                </button>
                <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
                <div className="container mx-auto p-4 max-w-4xl">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold">Account Settings</h1>
                        <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full bg-gray-200 dark:bg-gray-800">
                            <Moon size={24} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="bg-gray-800 p-6 rounded-lg">
                                <h2 className="text-xl font-semibold mb-4 flex items-center">
                                    <User className="mr-2" /> Personal Information
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Username</label>
                                        <input 
                                            type="text" 
                                            value={userData.username} 
                                            onChange={(e) => handleInputChange("username", e.target.value)}
                                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">First Name</label>
                                        <input 
                                            type="text" 
                                            value={userData.first_name} 
                                            onChange={(e) => handleInputChange("first_name", e.target.value)}
                                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Second Name</label>
                                        <input 
                                            type="text" 
                                            value={userData.second_name} 
                                            onChange={(e) => handleInputChange("second_name", e.target.value)}
                                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Last Name</label>
                                        <input 
                                            type="text" 
                                            value={userData.last_name} 
                                            onChange={(e) => handleInputChange("last_name", e.target.value)}
                                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-800 p-6 rounded-lg">
                                <h2 className="text-xl font-semibold mb-4 flex items-center">
                                    <Mail className="mr-2" /> Contact Information
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Email</label>
                                        <input 
                                            type="email" 
                                            value={userData.email} 
                                            onChange={(e) => handleInputChange("email", e.target.value)}
                                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">New Password</label>
                                        <input 
                                            type="password" 
                                            value={password} 
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Leave blank to keep current password"
                                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-800 p-6 rounded-lg">
                                <h2 className="text-xl font-semibold mb-4 flex items-center">
                                    <Laptop className="mr-2" /> System Information
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Computer Name</label>
                                        <input 
                                            type="text" 
                                            value={userData.computer_name} 
                                            onChange={(e) => handleInputChange("computer_name", e.target.value)}
                                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">VirusTotal API Key</label>
                                        <input 
                                            type="text" 
                                            value={userData.virus_total_api} 
                                            onChange={(e) => handleInputChange("virus_total_api", e.target.value)}
                                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button 
                            onClick={updateSettings} 
                            className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
                        >
                            <Save className="mr-2" /> Save Changes
                        </button>
                    </div>

                    {message && (
                        <div className={`mt-4 p-4 rounded-lg ${
                            message.includes("✅") ? "bg-green-900 text-green-100" : "bg-red-900 text-red-100"
                        }`}>
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}