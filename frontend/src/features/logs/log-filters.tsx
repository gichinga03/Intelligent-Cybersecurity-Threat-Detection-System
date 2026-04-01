"use client";

import { useState, useEffect } from "react";

interface LogFiltersProps {
  logs: any[];
  setFilteredLogs: (logs: any[]) => void;
  isDarkMode?: boolean;
}

export default function LogFilters({ logs, setFilteredLogs, isDarkMode = false }: LogFiltersProps) {
  const [severity, setSeverity] = useState("High"); // Set default severity to High

  // Function to get unique logs
  const getUniqueLogs = (logsToFilter: any[]) => {
    const seenKeys = new Set<string>();
    return logsToFilter.filter((log) => {
      if (!log.event_code) return false; // Ensure event_code exists
      if (!log.computer_name || log.computer_name.toLowerCase() === "unknown") return false;

      const key = `${log.event_code}::${String(log.computer_name)}`;
      if (seenKeys.has(key)) return false;
      seenKeys.add(key);
      return true;
    });
  };

  // Apply initial filter when component mounts
  useEffect(() => {
    let filteredLogs = logs;
    if (severity) {
      filteredLogs = logs.filter((log) => {
        const s = (log.severity || "").toString().toLowerCase();
        const sel = severity.toLowerCase();
        // Treat "High" filter as inclusive of "Critical" so Critical detections show up.
        if (sel === "high") return s === "high" || s === "critical";
        return s === sel;
      });
    }
    setFilteredLogs(getUniqueLogs(filteredLogs));
  }, [logs, severity, setFilteredLogs]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSeverity = event.target.value;
    setSeverity(selectedSeverity);
  };

  return (
    <div className="mb-4">
      <label className={`block ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Filter by Severity:</label>
      <select
        className={`w-full px-3 py-2 ${
          isDarkMode 
            ? 'bg-gray-700 text-white border-gray-600' 
            : 'bg-white text-gray-900 border-gray-300'
        } border rounded focus:ring-2 focus:ring-green-400`}
        value={severity}
        onChange={handleFilterChange}
      >
        <option value="">All</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
        <option value="Critical">Critical</option>
      </select>
    </div>
  );
}
