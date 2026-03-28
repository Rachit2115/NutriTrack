# NutriTrack Setup Instructions

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Getting Supabase Credentials

1. Go to [supabase.com](https://supabase.com)
2. Create a new project or select an existing one
3. Go to Project Settings > API
4. Copy the Project URL and anon public key

## Database Setup

Run the SQL commands from `database-schema.sql` in your Supabase project's SQL Editor to set up the required tables.

## Fixed Issues

The meal insertion issue has been resolved by:

1. ✅ Fixed import path typo (`ssupabase` → `supabase`)
2. ✅ Replaced mock auth with Supabase auth in layout
3. ✅ Updated meal tracking to use proper Supabase user IDs
4. ✅ Replaced localStorage FoodTracker with Supabase MealTrackingDashboard
5. ✅ Removed incompatible `verified` field from meal tracking service

Your meals should now be properly saved to the Supabase database!
