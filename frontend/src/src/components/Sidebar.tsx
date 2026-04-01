"use client";

import Link from "next/link";
import { X } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  return (
    <div
      className={`fixed top-0 left-0 h-screen w-64 bg-gray-800 p-6 transition-transform ${
        isOpen ? "translate-x-0" : "-translate-x-64"
      }`}
    >
      <button
        className="text-white absolute top-4 right-4"
        onClick={() => setIsOpen(false)}
      >
        <X size={24} />
      </button>

      <h2 className="text-white text-2xl font-bold mb-6">Dashboard</h2>
      <ul className="space-y-4">
        <li>
          <Link href="/logs/gichinga03" className="text-gray-300 hover:text-green-400 block">
            📜 View Logs
          </Link>
        </li>
        <li>
          <Link href="/exportlogs" className="text-gray-300 hover:text-green-400 block">
            📤 Export Logs
          </Link>
        </li>
        <li>
          <Link href="/settings" className="text-gray-300 hover:text-green-400 block">
            ⚙ Settings
          </Link>
        </li>
      </ul>
    </div>
  );
}