-- ==========================================
-- Enable UUID Extension
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- Tasks Table
-- ==========================================
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    type VARCHAR(50) NOT NULL,

    payload JSONB NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',

    scheduled_at TIMESTAMPTZ NOT NULL,

    next_run_at TIMESTAMPTZ NOT NULL,

    retry_count INT NOT NULL DEFAULT 0,

    max_retries INT NOT NULL DEFAULT 3,

    last_error TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- Task Logs
-- ==========================================
CREATE TABLE IF NOT EXISTS task_logs (

    id BIGSERIAL PRIMARY KEY,

    task_id UUID NOT NULL,

    status VARCHAR(20) NOT NULL,

    message TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_task
        FOREIGN KEY(task_id)
        REFERENCES tasks(id)
        ON DELETE CASCADE
);

-- ==========================================
-- Indexes
-- ==========================================

-- Scheduler
CREATE INDEX IF NOT EXISTS idx_tasks_scheduler
ON tasks(status, next_run_at);

-- DLQ
CREATE INDEX IF NOT EXISTS idx_tasks_dead
ON tasks(status);

-- Logs
CREATE INDEX IF NOT EXISTS idx_task_logs_task
ON task_logs(task_id);

-- Metrics
CREATE INDEX IF NOT EXISTS idx_tasks_status
ON tasks(status);