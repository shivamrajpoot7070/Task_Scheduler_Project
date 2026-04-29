"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // ✅ FIX
import { fetchTaskById, fetchTaskLogs } from "@/lib/api";
import Link from "next/link";

// ===============================
// STATUS HELPERS
// ===============================
const getStatusStyle = (status) => {
  switch (status) {
    case "SUCCESS":
      return "bg-green-500/20 text-green-400";
    case "PENDING":
      return "bg-yellow-500/20 text-yellow-400";
    case "PROCESSING":
      return "bg-blue-500/20 text-blue-400";
    case "FAILED":
      return "bg-red-500/20 text-red-400";
    case "DEAD":
      return "bg-red-700/20 text-red-500";
    default:
      return "bg-gray-500/20 text-gray-400";
  }
};

const getStatusTextColor = (status) => {
  switch (status) {
    case "SUCCESS":
      return "text-green-400";
    case "PENDING":
      return "text-yellow-400";
    case "PROCESSING":
      return "text-blue-400";
    case "FAILED":
      return "text-red-400";
    case "DEAD":
      return "text-red-500";
    default:
      return "text-gray-400";
  }
};

const formatStatus = (status) => {
  return status.charAt(0) + status.slice(1).toLowerCase();
};

// ===============================
// PAGE
// ===============================
export default function TaskDetail() {
  const params = useParams(); // ✅ FIX
  const id = params.id;       // ✅ FIX

  const [task, setTask] = useState(null);
  const [logs, setLogs] = useState([]);

  const loadData = async () => {
    if (!id) return;

    const taskData = await fetchTaskById(id);
    const logsData = await fetchTaskLogs(id);

    setTask(taskData?.data);
    setLogs(logsData?.data || []);
  };

  useEffect(() => {
    loadData();

    const interval = setInterval(() => {
      loadData();
    }, 3000); // ✅ auto refresh

    return () => clearInterval(interval); // cleanup
  }, [id]);

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p className="text-lg">❌ Task not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      
      {/* 🔥 Top Navigation */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-wide">
            📌 Task Details
          </h1>
          <p className="text-gray-400 text-sm">
            Track execution timeline
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
            📋 All Tasks
          </Link>
        </div>
      </div>

      {/* ===============================
          TASK INFO CARD
      =============================== */}
      <div className="bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-lg mb-8">
        <div className="grid md:grid-cols-3 gap-4">
          
          {/* ID */}
          <div>
            <p className="text-gray-400 text-xs">TASK ID</p>
            <p className="text-sm font-semibold text-indigo-400 break-all">
              {task.id}
            </p>
          </div>

          {/* STATUS */}
          <div>
            <p className="text-gray-400 text-xs">STATUS</p>
            <span
              className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusStyle(
                task.status
              )}`}
            >
              {formatStatus(task.status)}
            </span>
          </div>

          {/* LAST UPDATED */}
          <div>
            <p className="text-gray-400 text-xs">LAST UPDATED</p>
            <p className="text-sm text-gray-300">
              {logs[logs.length - 1]?.created_at || "N/A"}
            </p>
          </div>

          {/* EMAIL (if EMAIL task) */}
          {task.type === "EMAIL" && (
            <div>
              <p className="text-gray-400 text-xs">EMAIL</p>
              <p className="text-sm text-white">
                {task.payload?.email}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ===============================
          TIMELINE
      =============================== */}
      <h2 className="text-xl font-semibold mb-4">
        🕒 Execution Timeline
      </h2>

      <div className="relative border-l border-gray-700 pl-6 space-y-6">
        {logs.map((log, index) => (
          <div key={index} className="relative group">
            
            {/* Dot */}
            <div className="absolute -left-[11px] top-2 w-4 h-4 bg-indigo-500 rounded-full border-2 border-gray-900"></div>

            {/* Card */}
            <div className="bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-xl p-4 shadow-md transition-all duration-300 hover:shadow-xl hover:border-indigo-500">
              
              {/* STATUS */}
              <p className={`font-semibold ${getStatusTextColor(log.status)}`}>
                {formatStatus(log.status)}
              </p>

              {/* MESSAGE */}
              <p className="text-sm text-gray-300 mt-1">
                {log.message}
              </p>

              {/* TIME */}
              <p className="text-xs text-gray-500 mt-2">
                {log.created_at}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}