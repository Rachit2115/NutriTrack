-- Enhanced Meal Tracking Schema
-- Run this in your Supabase SQL Editor to add/update meal tables

-- Update the existing meals table with additional fields
ALTER TABLE meals 
ADD COLUMN IF NOT EXISTS food_category TEXT,
ADD COLUMN IF NOT EXISTS brand TEXT,
ADD COLUMN IF NOT EXISTS barcode TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS meal_time TIME,
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT FALSE;

-- Create meal categories table
CREATE TABLE IF NOT EXISTS meal_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create food database table (for common foods)
CREATE TABLE IF NOT EXISTS food_database (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT,
    category TEXT,
    calories_per_100g DECIMAL(8,2),
    protein_per_100g DECIMAL(6,2),
    carbs_per_100g DECIMAL(6,2),
    fat_per_100g DECIMAL(6,2),
    fiber_per_100g DECIMAL(6,2),
    sugar_per_100g DECIMAL(6,2),
    sodium_per_100g DECIMAL(6,2),
    serving_size TEXT,
    serving_unit TEXT,
    barcode TEXT,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meal plans table
CREATE TABLE IF NOT EXISTS meal_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    plan_name TEXT NOT NULL,
    plan_date DATE,
    target_calories INTEGER,
    target_protein DECIMAL(6,2),
    target_carbs DECIMAL(6,2),
    target_fat DECIMAL(6,2),
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meal_plan_items table (meals within a plan)
CREATE TABLE IF NOT EXISTS meal_plan_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    meal_plan_id UUID REFERENCES meal_plans(id) ON DELETE CASCADE NOT NULL,
    meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    food_name TEXT NOT NULL,
    calories INTEGER NOT NULL,
    protein DECIMAL(6,2) NOT NULL,
    carbs DECIMAL(6,2) NOT NULL,
    fat DECIMAL(6,2) NOT NULL,
    serving_size TEXT NOT NULL,
    time_of_day TIME,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create nutrition_goals table
CREATE TABLE IF NOT EXISTS nutrition_goals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    goal_date DATE NOT NULL,
    target_calories INTEGER,
    target_protein DECIMAL(6,2),
    target_carbs DECIMAL(6,2),
    target_fat DECIMAL(6,2),
    target_fiber DECIMAL(6,2),
    target_water_ml INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meal_photos table (for food image analysis)
CREATE TABLE IF NOT EXISTS meal_photos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    meal_id UUID REFERENCES meals(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    photo_url TEXT NOT NULL,
    analysis_result JSONB,
    confidence_score DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_meals_user_id ON meals(user_id);
CREATE INDEX IF NOT EXISTS idx_meals_profile_id ON meals(profile_id);
CREATE INDEX IF NOT EXISTS idx_meals_consumed_at ON meals(consumed_at);
CREATE INDEX IF NOT EXISTS idx_meals_meal_type ON meals(meal_type);
CREATE INDEX IF NOT EXISTS idx_meals_food_category ON meals(food_category);

CREATE INDEX IF NOT EXISTS idx_food_database_name ON food_database(name);
CREATE INDEX IF NOT EXISTS idx_food_database_category ON food_database(category);
CREATE INDEX IF NOT EXISTS idx_food_database_barcode ON food_database(barcode);

CREATE INDEX IF NOT EXISTS idx_meal_plans_user_id ON meal_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_meal_plans_profile_id ON meal_plans(profile_id);
CREATE INDEX IF NOT EXISTS idx_meal_plans_plan_date ON meal_plans(plan_date);

CREATE INDEX IF NOT EXISTS idx_nutrition_goals_user_id ON nutrition_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_nutrition_goals_profile_id ON nutrition_goals(profile_id);
CREATE INDEX IF NOT EXISTS idx_nutrition_goals_goal_date ON nutrition_goals(goal_date);

-- Enable Row Level Security (RLS) for new tables
ALTER TABLE meal_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_database ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plan_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_photos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for meal_categories (read-only for all users)
CREATE POLICY "Anyone can view meal categories" ON meal_categories
    FOR SELECT USING (true);

-- RLS Policies for food_database (read-only for all users)
CREATE POLICY "Anyone can view food database" ON food_database
    FOR SELECT USING (true);

-- RLS Policies for meal_plans
CREATE POLICY "Users can view own meal plans" ON meal_plans
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meal plans" ON meal_plans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meal plans" ON meal_plans
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own meal plans" ON meal_plans
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for meal_plan_items
CREATE POLICY "Users can view own meal plan items" ON meal_plan_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM meal_plans 
            WHERE meal_plans.id = meal_plan_items.meal_plan_id 
            AND meal_plans.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own meal plan items" ON meal_plan_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM meal_plans 
            WHERE meal_plans.id = meal_plan_items.meal_plan_id 
            AND meal_plans.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own meal plan items" ON meal_plan_items
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM meal_plans 
            WHERE meal_plans.id = meal_plan_items.meal_plan_id 
            AND meal_plans.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own meal plan items" ON meal_plan_items
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM meal_plans 
            WHERE meal_plans.id = meal_plan_items.meal_plan_id 
            AND meal_plans.user_id = auth.uid()
        )
    );

-- RLS Policies for nutrition_goals
CREATE POLICY "Users can view own nutrition goals" ON nutrition_goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own nutrition goals" ON nutrition_goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own nutrition goals" ON nutrition_goals
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own nutrition goals" ON nutrition_goals
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for meal_photos
CREATE POLICY "Users can view own meal photos" ON meal_photos
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meal photos" ON meal_photos
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own meal photos" ON meal_photos
    FOR DELETE USING (auth.uid() = user_id);

-- Insert default meal categories
INSERT INTO meal_categories (name, description, icon, color) VALUES
('Breakfast', 'Morning meals', '🌅', '#FFA500'),
('Lunch', 'Midday meals', '☀️', '#FFD700'),
('Dinner', 'Evening meals', '🌙', '#4B0082'),
('Snack', 'Between meals', '🍎', '#32CD32')
ON CONFLICT (name) DO NOTHING;

-- Insert some common foods into the database
INSERT INTO food_database (name, category, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, serving_size, serving_unit) VALUES
('Apple', 'Fruit', 52, 0.3, 14, 0.2, '1 medium', 'piece'),
('Banana', 'Fruit', 89, 1.1, 23, 0.3, '1 medium', 'piece'),
('Chicken Breast', 'Protein', 165, 31, 0, 3.6, '100', 'grams'),
('Rice', 'Grains', 130, 2.7, 28, 0.3, '1 cup', 'cooked'),
('Egg', 'Protein', 155, 13, 1.1, 11, '2 large', 'pieces'),
('Milk', 'Dairy', 42, 3.4, 5, 1, '1 cup', 'liquid'),
('Bread', 'Grains', 265, 9, 49, 3.2, '2 slices', 'pieces'),
('Yoghurt', 'Dairy', 59, 10, 3.6, 0.4, '1 cup', 'container')
ON CONFLICT (name) DO NOTHING;

-- Create updated_at trigger for meal_plans and nutrition_goals
CREATE TRIGGER update_meal_plans_updated_at 
    BEFORE UPDATE ON meal_plans 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nutrition_goals_updated_at 
    BEFORE UPDATE ON nutrition_goals 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
