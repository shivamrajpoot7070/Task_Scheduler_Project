export const TASK_STATUS = {
  PENDING: "PENDING",
  QUEUED: "QUEUED",
  PROCESSING: "PROCESSING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  DEAD: "DEAD"
};

export const TASK_TYPES = {
  EMAIL: "EMAIL",
  DATA_PROCESSING: "DATA_PROCESSING"
};

// DB table schema reference (PostgreSQL)
// We will create this table later using SQL

/*
CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  payload JSONB NOT NULL,

  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',

  scheduled_at TIMESTAMP NOT NULL,
  next_run_at TIMESTAMP NOT NULL,

  retry_count INT DEFAULT 0,
  max_retries INT DEFAULT 3,

  last_error TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
*/