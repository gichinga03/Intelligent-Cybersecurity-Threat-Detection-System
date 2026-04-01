"use client";

interface LogTableProps {
  logs: any[];
  onSelect?: (computer: string) => void;
  isDarkMode?: boolean;
}

export default function LogTable({ logs, onSelect, isDarkMode = false }: LogTableProps) {
  return (
    <div className={`overflow-x-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-md`}>
      <table className="w-full border-collapse">
        <thead>
          <tr className={`${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}>
            <th className="p-2 text-left">Event Code</th>
            <th className="p-2 text-left">Computer</th>
            <th className="p-2 text-left">Severity</th>
            <th className="p-2 text-left">Reason</th>
            <th className="p-2 text-left">Recommended Action</th>
            <th className="p-2 text-left">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr
              key={index}
              className={`${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'} ${onSelect && log.computer_name ? "cursor-pointer" : ""}`}
              onClick={() => onSelect && log.computer_name && onSelect(log.computer_name)}
            >
              <td className={`p-2 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>{log.event_code}</td>
              <td className={`p-2 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>{log.computer_name}</td>
              <td
                className={`p-2 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} ${
                  log.severity === "High" ? "text-red-500 font-bold" : "text-green-400"
                }`}
              >
                {log.severity}
              </td>
              <td className={`p-2 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>{log.reason}</td>
              <td className={`p-2 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>{log.suggested_action}</td>
              <td className={`p-2 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} whitespace-nowrap`}>{log.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
