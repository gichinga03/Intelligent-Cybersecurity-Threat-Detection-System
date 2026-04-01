"use client";

import { useEffect, useState } from "react";
import { auth } from "../login/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [error, setError] = useState("");
  const [blockedIps, setBlockedIps] = useState<any[]>([]);
  const [blockedIpsLoading, setBlockedIpsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const isAdmin = user && user.email === "threatdetectai@gmail.com";

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchBlockedIps();
    }
    // eslint-disable-next-line
  }, [isAdmin]);

  const fetchUsers = async () => {
    setUsersLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    }
    setUsersLoading(false);
  };

  const fetchBlockedIps = async () => {
    setBlockedIpsLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/blocked-ips");
      if (!res.ok) throw new Error("Failed to fetch blocked IPs");
      const data = await res.json();
      setBlockedIps(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message);
      setBlockedIps([]);
    }
    setBlockedIpsLoading(false);
  };

  const handleDelete = async (email: string) => {
    if (!window.confirm(`Delete user ${email}?`)) return;
    try {
      const res = await fetch(`http://localhost:5000/api/users/${email}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete user");
      await fetchUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white">Admin Dashboard</h1>
        {isAdmin ? (
          <>
            <div className="flex items-center space-x-4 mb-8">
              <p className="text-gray-300">Welcome, Admin!</p>
              <Link href="/logs" className="text-blue-400 hover:text-blue-300 transition-colors">
                Go to Logs
              </Link>
              <Link href="/settings" className="text-blue-400 hover:text-blue-300 transition-colors">
                Go to Settings
              </Link>
            </div>

            {/* Blocked IPs Section */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">Blocked IP Addresses</h2>
              {blockedIpsLoading ? (
                <div className="text-gray-400">Loading blocked IPs...</div>
              ) : error ? (
                <div className="text-red-400">{error}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-700">
                        <th className="p-3 text-left text-gray-200 font-medium">IP Address</th>
                        <th className="p-3 text-left text-gray-200 font-medium">Process Name</th>
                        <th className="p-3 text-left text-gray-200 font-medium">Reason</th>
                        <th className="p-3 text-left text-gray-200 font-medium">Blocked At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blockedIps.map((ip, idx) => (
                        <tr key={idx} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                          <td className="p-3 text-gray-300">{ip.ip_address}</td>
                          <td className="p-3 text-gray-300">{ip.process_name}</td>
                          <td className="p-3 text-gray-300">{ip.reason}</td>
                          <td className="p-3 text-gray-300">
                            {new Date(ip.timestamp).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* User Management Section */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-white">User Management</h2>
              {usersLoading ? (
                <div className="text-gray-400">Loading users...</div>
              ) : error ? (
                <div className="text-red-400">{error}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-700">
                        <th className="p-3 text-left text-gray-200 font-medium">Username</th>
                        <th className="p-3 text-left text-gray-200 font-medium">Email</th>
                        <th className="p-3 text-left text-gray-200 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u, idx) => (
                        <tr key={u._id || u.username || idx} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                          <td className="p-3 text-gray-300">{u.username}</td>
                          <td className="p-3 text-gray-300">{u.email}</td>
                          <td className="p-3">
                            <button
                              onClick={() => handleDelete(u.email)}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <p className="text-gray-300">You do not have admin access.</p>
          </div>
        )}
      </div>
    </div>
  );
} 