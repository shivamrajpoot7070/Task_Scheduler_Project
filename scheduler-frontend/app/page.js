"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchTaskStats } from "@/lib/api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetchTaskStats();
      setStats(res.data);
    };
    load();
  }, []);

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  const cards = [
    { label: "Total Tasks", value: stats.total, color: "text-indigo-400" },
    { label: "Success", value: stats.success, color: "text-green-400" },
    { label: "Failed", value: stats.failed, color: "text-red-400" },
    { label: "Processing", value: stats.processing, color: "text-blue-400" },
    { label: "Pending", value: stats.pending, color: "text-yellow-400" },
    { label: "Dead Tasks", value: stats.dead, color: "text-red-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      
      {/* Header */}
      <h1 className="text-4xl font-bold mb-8">
        📊 Scheduler Dashboard
      </h1>

      {/* Stats */}
      <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">
       {cards.map((card, i) => {
  const isDLQ = card.label === "Dead Tasks";

  const content = (
    <div className="p-5 rounded-2xl bg-gray-800 border border-gray-700 shadow-lg">
      <p className="text-gray-400 text-sm">{card.label}</p>
      <p className={`text-2xl font-bold ${card.color}`}>
        {card.value}
      </p>
    </div>
  );

  return isDLQ ? (
    <Link key={i} href="/tasks/dlq">
      <div className="cursor-pointer hover:border-red-500 transition border border-transparent rounded-2xl">
        {content}
      </div>
    </Link>
  ) : (
    <div key={i}>{content}</div>
  );
})}
      </div>

      {/* Navigation */}
      <h2 className="text-2xl font-semibold mb-4">
        🚀 Quick Actions
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <Link href="/tasks">
          <div className="p-6 bg-gray-800 border border-gray-700 rounded-2xl hover:border-indigo-500 cursor-pointer transition">
            <h3 className="text-xl font-semibold mb-2">📋 View Tasks</h3>
            <p className="text-gray-400 text-sm">
              See all scheduled tasks
            </p>
          </div>
        </Link>

        <Link href="/tasks/create">
          <div className="p-6 bg-gray-800 border border-gray-700 rounded-2xl hover:border-green-500 cursor-pointer transition">
            <h3 className="text-xl font-semibold mb-2">➕ Create Task</h3>
            <p className="text-gray-400 text-sm">
              Schedule a new task
            </p>
          </div>
        </Link>

        <Link href="/tasks/dlq">
  <div className="p-6 bg-gray-800 border border-gray-700 rounded-2xl hover:border-red-500 cursor-pointer transition">
    <h3 className="text-xl font-semibold mb-2">☠️ Dead Tasks</h3>
    <p className="text-gray-400 text-sm">
      View failed tasks
    </p>
  </div>
</Link>

<Link href="/metrics">
  <div className="p-6 bg-gray-800 border border-gray-700 rounded-2xl hover:border-indigo-500 cursor-pointer transition">
    <h3 className="text-xl font-semibold mb-2">📊 Metrics</h3>
    <p className="text-gray-400 text-sm">
      System performance overview
    </p>
  </div>
</Link>

      </div>
    </div>
  );
}