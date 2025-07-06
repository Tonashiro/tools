-- Initialize the snapshoter database
-- This script runs when the PostgreSQL container starts for the first time

-- Create extensions that might be useful
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE snapshoter TO postgres;

-- Create a dedicated user for the application (optional)
-- CREATE USER snapshoter_user WITH PASSWORD 'snapshoter_password';
-- GRANT ALL PRIVILEGES ON DATABASE snapshoter TO snapshoter_user;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO snapshoter_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO snapshoter_user; 