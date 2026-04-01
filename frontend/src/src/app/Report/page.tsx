"use client";

import { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import NavBar from "@/components/navbar";
import Sidebar from "@/components/Sidebar";
import GraphSettings from "@/components/GraphSettings"; // Import new settings component

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export default function Reports() {
  const [logs, setLogs] = useState<any[]>([]);
  const [severity, setSeverity] = useState("");
  const [eventCode, setEventCode] = useState("");
  const [graphType, setGraphType] = useState("bar");
  const [darkMode, setDarkMode] = useState(false);
  const [graphSize, setGraphSize] = useState(300); // Default size for graph
  const [graphColors, setGraphColors] = useState(["#4CAF50", "#FFC107", "#F44336"]); // Default colors
  const [sidebarVisible, setSidebarVisible] = useState(false); // Control sidebar visibility

  const chartRef = useRef<any>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLogs(data);
        } else {
          console.error("Invalid API response:", data);
        }
      })
      .catch((error) => console.error("Error fetching logs:", error));
  }, []);

  const summarizedLogs = logs.reduce((acc: any, log: any) => {
    const key = log.event_code;
    if (!acc[key]) {
      acc[key] = {
        event_code: log.event_code,
        severity: log.severity,
        reason: log.reason,
        computers: new Set(),
        count: 0,
      };
    }
    acc[key].computers.add(log.computer_name || "Unknown");
    acc[key].count += 1;
    return acc;
  }, {});

  // Apply filters
  const filteredLogs = Object.values(summarizedLogs).filter((log: any) => {
    const matchesSeverity = severity ? log.severity === severity : true;
    const matchesEventCode = eventCode ? log.event_code === eventCode : true;
    return matchesSeverity && matchesEventCode;
  });

  const graphData = {
    labels: filteredLogs.map((log: any) => log.event_code),
    datasets: [
      {
        label: "Number of Events",
        data: filteredLogs.map((log: any) => log.count),
        backgroundColor: graphColors,
      },
    ],
  };

  const generatePDF = () => {
    if (filteredLogs.length === 0) {
      alert("No data to generate a report.");
      return;
    }

    const doc = new jsPDF();
    const currentDate = new Date().toLocaleString(); // Timestamp

    const img = new Image();
    img.src = "/logo.png"; 
    img.onload = () => {
      doc.addImage(img, "PNG", 10, 5, 30, 15);
      doc.text("Security Logs Report", 10, 30);
      doc.text(`Generated on: ${currentDate}`, 10, 40);
      doc.text(`Template: Detailed Event`, 10, 50);

      autoTable(doc, {
        startY: 55,
        head: [["Event Code", "Severity", "Reason", "Computers", "Occurrences"]],
        body: filteredLogs.map((log: any) => [
          log.event_code,
          log.severity,
          log.reason,
          [...log.computers].join(", "),
          log.count,
        ]),
      });

      setTimeout(() => {
        const canvas = document.querySelector("canvas");
        if (canvas) {
          const chartImage = canvas.toDataURL("image/png");
          doc.addImage(chartImage, "PNG", 10, doc.lastAutoTable.finalY + 10, 180, 80);
        }
        doc.save("security_report.pdf");
      }, 500);
    };
  };

  return (
    <div 
    className={`p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <NavBar />
      <Sidebar />

      <h1 className="text-2xl font-bold">Generate Reports</h1>

      {/* Filters */}
      <div className="flex space-x-4 my-4">
        <select 
          className={`border p-2 rounded ${
            darkMode 
              ? "bg-gray-800 text-white border-gray-600" 
              : "bg-white text-black border-gray-300"
          }`} 
          onChange={(e) => setSeverity(e.target.value)}
        >
          <option value="">All Severities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <select 
          className={`border p-2 rounded ${
            darkMode 
              ? "bg-gray-800 text-white border-gray-600" 
              : "bg-white text-black border-gray-300"
          }`} 
          onChange={(e) => setEventCode(e.target.value)}
        >
          <option value="">All Event Codes</option>
          {filteredLogs.map((log) => (
            <option key={log.event_code} value={log.event_code}>
              {log.event_code}
            </option>
          ))}
        </select>

        <select 
          className={`border p-2 rounded ${
            darkMode 
              ? "bg-gray-800 text-white border-gray-600" 
              : "bg-white text-black border-gray-300"
          }`} 
          onChange={(e) => setGraphType(e.target.value)}
        >
          <option value="bar">Bar Chart</option>
          <option value="pie">Pie Chart</option>
          <option value="line">Line Chart</option>
        </select>
      </div>

      {/* Sidebar Toggle Button */}
      <button 
        onClick={() => setSidebarVisible(!sidebarVisible)} 
        className="bg-blue-500 text-white p-2 rounded mb-4"
      >
        {sidebarVisible ? "Close Settings" : "Open Settings"}
      </button>

      {/* Sidebar */}
      {sidebarVisible && (
        <div className="absolute top-0 left-0 bg-gray-700 text-white w-64 h-full p-4 shadow-md">
          <h2 className="text-xl mb-4">Graph Settings</h2>
          
          <GraphSettings
            setGraphSize={setGraphSize}
            setGraphColors={setGraphColors}
            setDarkMode={setDarkMode}
          />

          {/* Save Button to apply changes and close */}
          <button 
            onClick={() => setSidebarVisible(false)} 
            className="mt-6 bg-green-500 p-2 w-full rounded flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="white">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11H9v6a1 1 0 102 0V7zm-1 9a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z" />
            </svg>
            Save & Close
          </button>
        </div>
      )}

      {/* Report Preview */}
      <div className={`bg-gray-100 p-4 rounded mb-6 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
        <h2 className="text-xl font-semibold">Report Preview</h2>

        <table className="table-auto w-full mt-4 border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Event Code</th>
              <th className="border px-2 py-1">Severity</th>
              <th className="border px-2 py-1">Reason</th>
              <th className="border px-2 py-1">Impacted Computers</th>
              <th className="border px-2 py-1">Occurrences</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log, index) => (
              <tr key={index}>
                <td className="border px-2 py-1">{log.event_code}</td>
                <td className="border px-2 py-1">{log.severity}</td>
                <td className="border px-2 py-1">{log.reason}</td>
                <td className="border px-2 py-1">{[...log.computers].join(", ")}</td>
                <td className="border px-2 py-1">{log.count}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Graph */}
        <div className="mt-6">
          {graphType === "bar" && (
            <Bar 
              ref={chartRef} 
              data={graphData} 
              options={{ 
                responsive: true,
                scales: {
                  x: {
                    grid: {
                      color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                      borderColor: darkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                    },
                    ticks: {
                      color: darkMode ? 'white' : 'black',
                    }
                  },
                  y: {
                    grid: {
                      color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                      borderColor: darkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                    },
                    ticks: {
                      color: darkMode ? 'white' : 'black',
                    }
                  }
                },
                plugins: {
                  legend: {
                    labels: {
                      color: darkMode ? 'white' : 'black',
                    }
                  }
                }
              }} 
            />
          )}
          {graphType === "pie" && (
            <Pie 
              ref={chartRef} 
              data={graphData} 
              options={{ 
                responsive: true,
                plugins: {
                  legend: {
                    labels: {
                      color: darkMode ? 'white' : 'black',
                    }
                  }
                }
              }} 
            />
          )}
          {graphType === "line" && (
            <Line 
              ref={chartRef} 
              data={graphData} 
              options={{ 
                responsive: true,
                scales: {
                  x: {
                    grid: {
                      color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                      borderColor: darkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                    },
                    ticks: {
                      color: darkMode ? 'white' : 'black',
                    }
                  },
                  y: {
                    grid: {
                      color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                      borderColor: darkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                    },
                    ticks: {
                      color: darkMode ? 'white' : 'black',
                    }
                  }
                },
                plugins: {
                  legend: {
                    labels: {
                      color: darkMode ? 'white' : 'black',
                    }
                  }
                }
              }} 
            />
          )}
        </div>
      </div>

      {/* Download Report */}
      <button onClick={generatePDF} className="bg-blue-500 text-white p-2 rounded">
        Download Report
      </button>
    </div>
  );
}
