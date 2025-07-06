-- Nadtools Database Setup Script
-- This script creates the database schema equivalent to your Prisma schema

-- Enable UUID extension for CUID-like functionality
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom function to generate CUID-like IDs
CREATE OR REPLACE FUNCTION generate_cuid()
RETURNS TEXT AS $$
DECLARE
    timestamp_part TEXT;
    random_part TEXT;
    counter_part TEXT;
BEGIN
    -- Generate timestamp part (base36 encoded)
    timestamp_part := lower(to_char(floor(extract(epoch from now()) * 1000)::bigint, 'FMXXXXXXXXXXXXXXXX'));
    
    -- Generate random part (8 characters)
    random_part := lower(substring(md5(random()::text) from 1 for 8));
    
    -- Generate counter part (4 characters)
    counter_part := lower(substring(md5(random()::text) from 1 for 4));
    
    RETURN 'c' || timestamp_part || random_part || counter_part;
END;
$$ LANGUAGE plpgsql;

-- Create Users table
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT PRIMARY KEY DEFAULT generate_cuid(),
    "discordId" TEXT UNIQUE NOT NULL,
    "username" TEXT NOT NULL,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Snapshots table
CREATE TABLE IF NOT EXISTS "Snapshot" (
    "id" TEXT PRIMARY KEY DEFAULT generate_cuid(),
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contractAddress" TEXT NOT NULL,
    "network" TEXT NOT NULL,
    "totalOwners" INTEGER NOT NULL,
    "totalTokens" INTEGER NOT NULL,
    "tokenType" TEXT NOT NULL,
    "collectionName" TEXT,
    "collectionSymbol" TEXT,
    "snapshotData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraint
    CONSTRAINT "Snapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "Snapshot_userId_idx" ON "Snapshot"("userId");
CREATE INDEX IF NOT EXISTS "Snapshot_contractAddress_idx" ON "Snapshot"("contractAddress");
CREATE INDEX IF NOT EXISTS "Snapshot_createdAt_idx" ON "Snapshot"("createdAt");

-- Create function to automatically update the updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updatedAt
CREATE TRIGGER update_user_updated_at
    BEFORE UPDATE ON "User"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_snapshot_updated_at
    BEFORE UPDATE ON "Snapshot"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data (optional)
-- INSERT INTO "User" ("discordId", "username", "avatar") VALUES 
-- ('123456789', 'testuser', 'https://example.com/avatar.png');

-- INSERT INTO "Snapshot" ("userId", "name", "contractAddress", "network", "totalOwners", "totalTokens", "tokenType", "snapshotData") VALUES 
-- ((SELECT "id" FROM "User" WHERE "discordId" = '123456789'), 'Test Snapshot', '0x1234567890abcdef', 'Monad', 100, 1000, 'ERC721', '{"owners": [], "metadata": {}}');

-- Grant necessary permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_user; 