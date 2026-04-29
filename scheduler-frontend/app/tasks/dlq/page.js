"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchDLQTasks, retryTask } from "@/lib/api";

const getStatusStyle = (status) => {
  return "bg-red-700/20 text-red-500";
};

export default function DLQPage() {
  const [tasks, setTasks] = useState([]);
  const router = useRouter();

  const loadTasks = async () => {
    const data = await fetchDLQTasks();
    setTasks(data.data || []);
  };

  const handleRetry = async (e, id) => {
    e.stopPropagation();

    try {
      await retryTask(id);

      // ✅ Toast (simple version)
      showToast("🔁 Task moved back to queue");

      // ✅ Navigate to task detail page
      router.push(`/tasks/${id}`);
    } catch (err) {
      console.error(err);
      showToast("❌ Retry failed");
    }
  };

  // 🔥 Simple toast system (no lib needed)
  const showToast = (msg) => {
    const toast = document.createElement("div");
    toast.innerText = msg;
    toast.className =
      "fixed bottom-6 right-6 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg border border-gray-700 z-50 animate-fadeIn";

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 2500);
  };

  useEffect(() => {
    loadTasks();
    const interval = setInterval(loadTasks, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">☠️ Dead Letter Queue</h1>
          <p className="text-gray-400 text-sm">
            Failed tasks that exceeded retry limit
          </p>
        </div>

        <div className="flex gap-3">
          <Link href="/" className="px-4 py-2 text-sm rounded-lg bg-indigo-500/20 text-indigo-400">
            🏠 Dashboard
          </Link>

          <Link href="/tasks" className="px-4 py-2 text-sm rounded-lg bg-purple-500/20 text-purple-400">
            📋 All Tasks
          </Link>
        </div>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => router.push(`/tasks/${task.id}`)}
            className="group relative p-5 rounded-2xl bg-gray-800/60 backdrop-blur-md border border-gray-700 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-red-500 cursor-pointer"
          >
            
            {/* Glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 opacity-0 group-hover:opacity-10 transition"></div>

            <div className="relative z-10 space-y-2">

              <p className="text-xs text-gray-400">TASK ID</p>
              <p className="text-sm font-semibold text-red-400 break-all">
                {task.id}
              </p>

              {task.type === "EMAIL" && (
                <p className="text-sm">
                  <span className="text-gray-400">Email:</span>{" "}
                  <span className="text-white">{task.payload?.email}</span>
                </p>
              )}

              <p className="text-sm">
                <span className="text-gray-400">Type:</span>{" "}
                <span className="text-purple-400">{task.type}</span>
              </p>

              {/* 🔥 STATUS + RETRY (same row) */}
              <div className="flex justify-between items-center pt-3">
                
                <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusStyle("DEAD")}`}>
                  DEAD
                </span>

                <button
                  onClick={(e) => handleRetry(e, task.id)}
                  className="px-3 py-1 text-xs bg-indigo-500/20 text-indigo-400 rounded hover:bg-indigo-500/40 transition"
                >
                  🔁 Retry
                </button>
              </div>
            </div>

            
          </div>
        ))}
      </div>

      {tasks.length === 0 && (
        <p className="text-center text-gray-400 mt-10">
          No tasks in DLQ 🚀
        </p>
      )}
    </div>
  );
}