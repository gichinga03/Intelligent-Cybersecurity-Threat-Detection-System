"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import LogTable from "@/features/logs/log-table";
import NavBar from "@/components/navbar";
export default function ComputerLogsPage() {
  const { computer_name } = useParams();
  const [logs, setLogs] = useState([]);
  const [usernames, setUsernames] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [logsResp, usernamesResp] = await Promise.all([
        fetch(`http://127.0.0.1:5000/api/logs/detections?computer_name=${computer_name}`),
        fetch(`http://127.0.0.1:5000/api/logs/usernames?computer_name=${computer_name}`),
      ]);

      const logsData = await logsResp.json();
      const usernamesData = await usernamesResp.json();

      setLogs(logsData);
      setUsernames(usernamesData?.usernames ?? []);
    };

    fetchData().catch((err) => console.error("Failed to fetch logs/usernames:", err));
  }, [computer_name]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NavBar />
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-bold mb-4">Logs for {computer_name}</h2>
        <div className="mb-4 text-sm text-gray-200">
          <span className="font-semibold">Usernames observed:</span>{" "}
          {usernames.length ? usernames.join(", ") : "N/A"}
        </div>
        <LogTable logs={logs} />
      </div>
    </div>
  );
}
