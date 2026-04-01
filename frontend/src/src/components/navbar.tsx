"use client";

import Link from "next/link";
import { Newspaper } from "lucide-react";

export default function NavBar() {
  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">Log Tracker</h1>
        <div className="flex items-center space-x-2">
          <Link href="/logs" className="text-white px-4 hover:text-green-400">Logs</Link>
          <Link href="/Report" className="text-white px-4 hover:text-green-400">Reports</Link>
          <Link href="/news_app" className="text-white px-4 hover:text-green-400 flex items-center">
            <Newspaper size={18} className="mr-1" />
            Threat Feed
          </Link>
          <Link href="/settings" className="text-white px-4 hover:text-green-400">Settings</Link>
        </div>
      </div>
    </nav>
  );
}
