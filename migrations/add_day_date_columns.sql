-- Migration: Add day and date columns to meals table
-- Run this in your Supabase SQL Editor to update existing meals table

-- Step 1: Add the new columns
ALTER TABLE meals 
ADD COLUMN IF NOT EXISTS entry_day TEXT,
ADD COLUMN IF NOT EXISTS entry_date DATE;

-- Step 2: Update existing records to populate the new columns
UPDATE meals 
SET 
    entry_day = TO_CHAR(consumed_at, 'Day'),
    entry_date = DATE(consumed_at)
WHERE entry_day IS NULL OR entry_date IS NULL;

-- Step 3: Convert consumed_at from TIMESTAMP to TIME
-- First, create a temporary column to store the time
ALTER TABLE meals 
ADD COLUMN IF NOT EXISTS consumed_at_time TIME;

-- Update the time column with time from consumed_at
UPDATE meals 
SET consumed_at_time = TO_CHAR(consumed_at, 'HH24:MI:SS')
WHERE consumed_at_time IS NULL;

-- Drop the old consumed_at column
ALTER TABLE meals DROP COLUMN IF EXISTS consumed_at;

-- Rename the time column to consumed_at
ALTER TABLE meals RENAME COLUMN consumed_at_time TO consumed_at;

-- Step 4: Make the new columns NOT NULL (after data is populated)
ALTER TABLE meals 
ALTER COLUMN entry_day SET NOT NULL,
ALTER COLUMN entry_date SET NOT NULL,
ALTER COLUMN consumed_at SET NOT NULL;

-- Step 5: Update the index for better performance
DROP INDEX IF EXISTS idx_meals_consumed_at;
CREATE INDEX IF NOT EXISTS idx_meals_entry_date ON meals(entry_date);
CREATE INDEX IF NOT EXISTS idx_meals_entry_day ON meals(entry_day);

-- Verification query to check the results
SELECT 
    id,
    food_name,
    entry_day,
    entry_date,
    consumed_at,
    created_at
FROM meals 
ORDER BY created_at DESC 
LIMIT 5;
