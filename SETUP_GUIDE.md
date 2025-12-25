# Online Test Platform Setup Guide

Follow these steps to get the project running locally on your computer.

## 1. Local Environment Setup

Open your terminal in the project root and run:

```bash
# Install dependencies
npm install

# Install shadcn/ui components (if missing)
npx shadcn@latest init
```

## 2. Supabase Setup

1. **Create a Project:** Go to [Supabase](https://supabase.com/) and create a new project.
2. **Database Schema:** 
   - Go to the **SQL Editor** in the Supabase dashboard.
   - Click "New Query" and paste the contents of `scripts/schema.sql`.
   - Run the query to create your tables, triggers, and RLS policies.
3. **Environment Variables:**
   - Create a file named `.env.local` in your root directory.
   - Copy the values from your Supabase project settings (Settings > API):
     ```env
     NEXT_PUBLIC_SUPABASE_URL=your_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
     ```

## 3. Run the Project

```bash
# Start the development server
npm run dev
```

Your app should now be running at `http://localhost:3000`.

## 4. Admin Access (Manual)

To make yourself an admin:
1. Go to the **Table Editor** in Supabase.
2. Open the `profiles` table.
3. Find your user ID and change the `role` column from `'user'` to `'admin'`.
