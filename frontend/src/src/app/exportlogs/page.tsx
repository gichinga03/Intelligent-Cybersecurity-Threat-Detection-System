"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";
import NavBar from "@/components/navbar";
import Sidebar from "@/components/Sidebar";
import { Menu, Sun, Moon } from "lucide-react";

interface Log {
  event_code: string;
  computer_name: string;
  severity: string;
  reason: string;
  timestamp: string;
}

export default function ExportLogs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<Log[]>([]);
  const [severity, setSeverity] = useState("");
  const [date, setDate] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Set today's date as default
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);

  // Fetch logs from API
  useEffect(() => {
    fetch("http://127.0.0.1:5000/")
      .then((response) => response.json())
      .then((data) => setLogs(data))
      .catch((error) => console.error("Error fetching logs:", error));
  }, []);

  // Filter logs
  useEffect(() => {
    const filtered = logs.filter((log) => {
      return (
        (severity ? log.severity === severity : true) &&
        (date ? log.timestamp.startsWith(date) : true)
      );
    });
    setFilteredLogs(filtered);
  }, [severity, date, logs]);

  // Generate CSV
  const generateCSV = () => {
    const csv = Papa.unparse(filteredLogs);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "logs.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Filtered Logs", 10, 10);
    autoTable(doc, {
      head: [["Event Code", "Computer", "Severity", "Reason", "Timestamp"]],
      body: filteredLogs.map((log) => [
        log.event_code,
        log.computer_name,
        log.severity,
        log.reason,
        log.timestamp,
      ]),
    });
    doc.save("logs.pdf");
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <NavBar />
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="p-6">
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

        <h1 className="text-2xl font-bold mb-6">Export Logs</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="date"
            className={`border p-2 rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <select
            className={`border p-2 rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}
            onChange={(e) => setSeverity(e.target.value)}
          >
            <option value="">All Severities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>

        {/* Preview Table */}
        {showPreview && (
          <div className="mb-6 overflow-x-auto">
            <table className={`w-full border-collapse ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <thead>
                <tr>
                  <th className="border p-2">Event Code</th>
                  <th className="border p-2">Computer</th>
                  <th className="border p-2">Severity</th>
                  <th className="border p-2">Reason</th>
                  <th className="border p-2">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, index) => (
                  <tr key={index}>
                    <td className="border p-2">{log.event_code}</td>
                    <td className="border p-2">{log.computer_name}</td>
                    <td className="border p-2">{log.severity}</td>
                    <td className="border p-2">{log.reason}</td>
                    <td className="border p-2">{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Export Buttons */}
        <div className="flex gap-4">
          <button
            onClick={generateCSV}
            className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white`}
          >
            Download CSV
          </button>
          <button
            onClick={generatePDF}
            className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white`}
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
