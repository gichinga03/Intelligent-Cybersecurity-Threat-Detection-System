"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import LogTable from "@/features/logs/log-table";
import LogFilters from "@/features/logs/log-filters";
import NavBar from "@/components/navbar";
import { Menu, Sun, Moon } from "lucide-react";

interface Log {
  timestamp: string;
  message: string;
  severity: string;
  event_code: number;
  computer_name: string;
  reason: string;
  suggested_action: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<Log[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/");
        const data = await response.json();
        setLogs(data);
        // Apply initial filter for high severity logs
        const highSeverityLogs = data.filter(
          (log: Log) => log.severity?.toLowerCase() === "high"
        );
        setFilteredLogs(highSeverityLogs);
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <NavBar />
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <main className={`p-6 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-700"
          >
            <Menu size={24} />
          </button>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg hover:bg-gray-700"
          >
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>

        <h2 className="text-3xl font-bold mb-4">Logs Overview</h2>
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md mb-6`}>
          <LogFilters 
            logs={logs} 
            setFilteredLogs={setFilteredLogs} 
            isDarkMode={isDarkMode}
          />
        </div>
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <LogTable 
            logs={filteredLogs} 
            onSelect={(computer) => router.push(`/logs/${computer}`)}
            isDarkMode={isDarkMode}
          />
        </div>
      </main>
    </div>
  );
}
