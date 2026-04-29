const BASE_URL = "http://localhost:5000/api";

export async function fetchTasks(page = 1) {
  const res = await fetch(
    `http://localhost:5000/api/tasks?page=${page}&limit=6`,
    { cache: "no-store" }
  );

  return res.json();
}

export async function createTask(data) {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function fetchTaskById(id) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    cache: "no-store"
  });
  return res.json();
}


export async function fetchTaskLogs(id) {
  const res = await fetch(`http://localhost:5000/api/tasks/${id}/logs`, {
    cache: "no-store"
  });
  return res.json();
}


export async function deleteTask(id) {
  const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
    method: "DELETE"
  });

  return res.json();
}


export async function fetchTaskStats() {
  const res = await fetch("http://localhost:5000/api/tasks/stats/summary", {
    cache: "no-store"
  });
  return res.json();
}

export async function fetchDLQTasks() {
  const res = await fetch("http://localhost:5000/api/tasks/dlq/db", {
    cache: "no-store"
  });

  return res.json();
}

// ===============================
// RETRY TASK (admin action) moves task from DEAD back to PENDING with reset retry count
// ===============================

export async function retryTask(id) {
  const res = await fetch(`http://localhost:5000/api/tasks/${id}/retry`, {
    method: "POST"
  });

  return res.json();
  
}

// ===============================
// GET METRICS FOR DASHBOARD
// ===============================

export async function fetchMetrics() {
  const res = await fetch("http://localhost:5000/api/tasks/metrics", {
    cache: "no-store"
  });

  return res.json();
}
