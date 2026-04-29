"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchMetrics } from "@/lib/api";

export default function MetricsPage() {
  const [metrics, setMetrics] = useState(null);

  const loadMetrics = async () => {
    const res = await fetchMetrics();
    setMetrics(res.data);
  };

  useEffect(() => {
    loadMetrics();

    const interval = setInterval(() => {
      loadMetrics();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (!metrics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading metrics...
      </div>
    );
  }

  const cards = [
    { label: "Total Tasks", value: metrics.total, color: "text-indigo-400" },
    { label: "Success Rate", value: `${metrics.successRate}%`, color: "text-green-400" },
    { label: "Failure Rate", value: `${metrics.failureRate}%`, color: "text-red-400" },
    { label: "Dead Rate", value: `${metrics.deadRate}%`, color: "text-red-500" },
    { label: "Retried Tasks", value: metrics.retried, color: "text-yellow-400" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-wide">
            📊 System Metrics
          </h1>
          <p className="text-gray-400 text-sm">
            Real-time system performance overview
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/"
            className="px-4 py-2 text-sm rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/40 transition"
          >
            🏠 Dashboard
          </Link>

          <Link
            href="/tasks"
            className="px-4 py-2 text-sm rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/40 transition"
          >
            📋 Tasks
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
        {cards.map((card, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-gray-800/60 backdrop-blur-md border border-gray-700 shadow-lg"
          >
            <p className="text-gray-400 text-sm">{card.label}</p>
            <p className={`text-2xl font-bold ${card.color}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Insight Section */}
      <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">🧠 Insights</h2>

        <ul className="space-y-2 text-sm text-gray-300">
          <li>✔ System success rate is <b>{metrics.successRate}%</b></li>
          <li>⚠ Failure rate is <b>{metrics.failureRate}%</b></li>
          <li>☠ Dead tasks represent <b>{metrics.deadRate}%</b> of total</li>
          <li>🔁 {metrics.retried} tasks required retries</li>
        </ul>
      </div>
    </div>
  );
}