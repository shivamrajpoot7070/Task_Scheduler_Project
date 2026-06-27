"use client";

import { useState } from "react";
import { createTask } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateTask() {
  const router = useRouter();
  const [to, setTo] = useState("");
const [subject, setSubject] = useState("");
const [text, setText] = useState("");
const [loading, setLoading] = useState(false);
const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);

  const payload = {
    type: "EMAIL",

    payload: {
      to,
      subject,
      text,
    },

    scheduledAt: new Date().toISOString(),

    maxRetries: 3,
  };

  try {
    const res = await createTask(payload);

    const createdTask = res?.data;

    router.push(`/tasks/${createdTask.id}`);
  } catch (err) {
    console.error(err);
    alert("❌ Failed to create task");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4 py-6">

      {/* 🔥 Top Navigation */}
      <div className="flex justify-between items-center max-w-4xl mx-auto mb-6">
        <h1 className="text-lg font-semibold text-gray-300">
          ⚙️ Task Creator
        </h1>

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

      {/* Card */}
      <div className="flex justify-center">
        <div className="w-full max-w-md bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl p-8">
          
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold">📨 Create Task</h1>
            <p className="text-sm text-gray-400 mt-1">
              Schedule an email task instantly
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div>
  <label className="block text-xs text-gray-400 mb-2">
    RECIPIENT EMAIL
  </label>

  <input
    type="email"
    placeholder="recipient@gmail.com"
    value={to}
    onChange={(e) => setTo(e.target.value)}
    required
    className="w-full px-4 py-3 rounded-lg bg-gray-900/60 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
  />
</div>

<div>
  <label className="block text-xs text-gray-400 mb-2">
    SUBJECT
  </label>

  <input
    type="text"
    placeholder="Interview Reminder"
    value={subject}
    onChange={(e) => setSubject(e.target.value)}
    required
    className="w-full px-4 py-3 rounded-lg bg-gray-900/60 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
  />
</div>

<div>
  <label className="block text-xs text-gray-400 mb-2">
    MESSAGE
  </label>

  <textarea
    rows={6}
    placeholder="Write your email..."
    value={text}
    onChange={(e) => setText(e.target.value)}
    required
    className="w-full px-4 py-3 rounded-lg bg-gray-900/60 border border-gray-700 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
  />
</div>

            <button
  disabled={loading}
  type="submit"
  className="w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
>
  {loading ? "Creating..." : "🚀 Create Email Task"}
</button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            Task will be executed immediately after creation
          </div>
        </div>
      </div>
    </div>
  );
}