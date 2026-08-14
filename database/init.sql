-- PostgreSQL initialization script
-- This runs once when the container is first created.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create application schema (optional, uses public by default)
-- All tables are created by Alembic migrations at runtime.
