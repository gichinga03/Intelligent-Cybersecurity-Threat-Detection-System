"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import LogTable from "@/features/logs/log-table";
import NavBar from "@/components/navbar";
export default function ComputerLogsPage() {
  const { computer_name } = useParams();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const response = await fetch(`http://127.0.0.1:5000/logs?computer_name=${computer_name}`);
      const data = await response.json();
      setLogs(data);
    };

    fetchLogs();
  }, [computer_name]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NavBar />
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-bold mb-4">Logs for {computer_name}</h2>
        <LogTable logs={logs} />
      </div>
    </div>
  );
}
