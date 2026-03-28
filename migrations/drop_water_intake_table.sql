-- Migration: Drop water_intake table
-- Run this in your Supabase SQL Editor to remove the water_intake table

-- Step 1: Drop the table and all its data
DROP TABLE IF EXISTS water_intake CASCADE;

-- Step 2: Verify the table has been dropped
-- This query should return an error if the table doesn't exist (which is what we want)
SELECT 'water_intake table dropped successfully' as status;

-- Step 3: Clean up any remaining indexes (should be handled by CASCADE above)
-- But just in case, let's try to drop any remaining indexes
DROP INDEX IF EXISTS idx_water_intake_user_id;
DROP INDEX IF EXISTS idx_water_intake_profile_id;
DROP INDEX IF EXISTS idx_water_intake_consumed_at;

-- Step 4: Verify the current tables in your database
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
