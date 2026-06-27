"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchTasks, deleteTask } from "@/lib/api";


export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const router = useRouter();
  const [page, setPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);

  // ===============================
  // FETCH TASKS
  // ===============================
  const loadTasks = async () => {
  const data = await fetchTasks(page);

  setTasks(data.data || []);
  setTotalPages(data.totalPages || 1);
};

  useEffect(() => {
  loadTasks(); // initial load

  const interval = setInterval(() => {
    loadTasks();
  }, 3000); // every 3 seconds

  return () => clearInterval(interval); // 🔥 cleanup
}, [page]);

  // ===============================
  // DELETE HANDLER
  // ===============================
  const handleDelete = async (e, id) => {
    e.preventDefault(); // prevent navigation

    await deleteTask(id);
    // refresh list
    loadTasks();
  };

  // ===============================
  // STATUS COLOR
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
      case "DEAD":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-wide">
          🚀 Tasks Dashboard
        </h1>
        <span className="text-sm text-gray-400">
          Total: {tasks.length}
        </span>

         <span className="text-sm text-gray-400">
          <Link href="/" className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded hover:bg-indigo-500/40 transition">
            Go To Dashboard
          </Link>
        </span>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <Link key={task.id} href={`/tasks/${task.id}`}>
            
            <div className="group relative p-5 rounded-2xl bg-gray-800/60 backdrop-blur-md border border-gray-700 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-indigo-500 cursor-pointer">
              
              {/* Glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-10 transition duration-300"></div>

              <div className="relative z-10 space-y-2">
                
                <p className="text-xs text-gray-400">TASK ID</p>
                <p className="text-sm font-semibold text-indigo-400 break-all">
                  {task.id}
                </p>

                {/* Email */}
                {task.type === "EMAIL" && (
                  <p className="text-sm">
                    <span className="text-gray-400">Email:</span>{" "}
                    <span className="text-white">
                      {task.payload?.to}
                    </span>
                  </p>
                )}

                <p className="text-sm">
                  <span className="text-gray-400">Type:</span>{" "}
                  <span className="text-purple-400">{task.type}</span>
                </p>

                {/* Status */}
                <div className="pt-2 flex items-center justify-between">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusStyle(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>

                  {/* DELETE BUTTON */}
                  <button
                    onClick={(e) => handleDelete(e, task.id)}
                    className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/40"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Arrow */}
              
            </div>
          </Link>
        ))}
      </div>


      <div className="flex justify-center items-center mt-10 gap-4">

  <button
    onClick={() => setPage((p) => Math.max(p - 1, 1))}
    disabled={page === 1}
    className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50 hover:bg-gray-600"
  >
    ← Prev
  </button>

  <span className="text-gray-300 text-sm">
    Page {page} of {totalPages}
  </span>

  <button
    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
    disabled={page === totalPages}
    className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50 hover:bg-gray-600"
  >
    Next →
  </button>

</div>
    </div>
  );
}