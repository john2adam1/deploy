# Supabase Setup Guide

This guide will walk you through setting up your Supabase database and storage for the TestMaster application.

## 📋 Table of Contents

1. [Initial Setup](#initial-setup)
2. [Database Setup](#database-setup)
3. [Storage Setup](#storage-setup)
4. [Post-Setup Configuration](#post-setup-configuration)
5. [Troubleshooting](#troubleshooting)

---

## 🚀 Initial Setup

### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Fill in:
   - **Project Name:** testmaster (or any name)
   - **Database Password:** Create a strong password (save it!)
   - **Region:** Choose closest to you
4. Click **"Create new project"** and wait ~2 minutes

### Step 2: Get Your Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public key** (starts with `eyJhbG...`)
3. Add them to your `.env.local` file:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/dashboard
   ```

---

## 🗄️ Database Setup

### Option A: Complete Setup (Recommended)

Run the complete setup script that includes everything:

1. Go to **SQL Editor** in Supabase Dashboard
2. Click **"New Query"**
3. Copy and paste the entire contents of `scripts/00_COMPLETE_SETUP.sql`
4. Click **"Run"** (or press Ctrl+Enter)
5. Wait for all queries to complete successfully

### Option B: Step-by-Step Setup

If you prefer to run scripts individually, follow this order:

1. **001_create_tables.sql** - Creates all database tables
2. **005_add_audio_to_tests.sql** - Adds audio_url column to tests (if not using complete setup)
3. **002_seed_sample_data.sql** - Inserts sample categories (optional)

---

## 📦 Storage Setup

### Automatic Setup (If using complete setup script)

The `00_COMPLETE_SETUP.sql` script automatically creates storage buckets and policies.

### Manual Setup

If you need to set up storage separately:

1. Go to **SQL Editor** in Supabase Dashboard
2. Run `scripts/006_setup_storage.sql`
3. This creates:
   - `test-images` bucket (for test images)
   - `test-audio` bucket (for test audio files)
   - Storage policies for public read and authenticated write

### Verify Storage Buckets

1. Go to **Storage** in Supabase Dashboard
2. You should see two buckets:
   - ✅ `test-images`
   - ✅ `test-audio`
3. Both should be marked as **Public**

---

## ⚙️ Post-Setup Configuration

### 1. Make Yourself an Admin

After registering your account, make yourself an admin:

1. Go to **SQL Editor** in Supabase Dashboard
2. Run this query (replace with your email):
   ```sql
   UPDATE users 
   SET role = 'admin' 
   WHERE email = 'your-email@example.com';
   ```
3. Sign out and sign back in to refresh your session

### 2. Configure Row Level Security (RLS) - Optional

By default, the tables are accessible. For production, you may want to enable RLS:

1. Go to **Authentication** → **Policies**
2. For each table, you can create policies to:
   - Allow public read access for certain tables
   - Restrict write access to authenticated users only
   - Restrict admin operations to admin users only

**Note:** The current setup works without RLS for development. Enable RLS for production security.

### 3. Test File Uploads

1. Log in as admin
2. Go to **Admin Panel** → **Tests** tab
3. Try creating a test with image and audio uploads
4. Verify files appear in **Storage** → **test-images** and **test-audio** buckets

---

## 🔍 Verification Checklist

After setup, verify everything is working:

- [ ] All tables created (users, categories, tests, test_results, site_content)
- [ ] Storage buckets created (test-images, test-audio)
- [ ] Can register a new user
- [ ] Can log in
- [ ] Admin role assigned to your account
- [ ] Can access admin panel
- [ ] Can create categories
- [ ] Can create tests with file uploads
- [ ] Files appear in storage buckets

---

## 🐛 Troubleshooting

### "Relation does not exist" error

- Make sure you ran the complete setup script
- Check that all tables were created in the **Table Editor**

### "Bucket does not exist" error

- Run `scripts/006_setup_storage.sql` again
- Check **Storage** section to verify buckets exist

### "Permission denied" for file uploads

- Verify storage policies were created
- Check that you're logged in (authenticated)
- Ensure buckets are set to **Public**

### Can't access admin panel

- Make sure your user role is set to 'admin'
- Sign out and sign back in after updating role
- Check browser console for errors

### Files not uploading

- Check browser console for errors
- Verify storage buckets exist and are public
- Check network tab for failed requests
- Ensure file size is within limits (Supabase free tier: 50MB per file)

---

## 📝 SQL Scripts Overview

| File | Purpose | When to Run |
|------|---------|-------------|
| `00_COMPLETE_SETUP.sql` | Complete setup (all-in-one) | **First time setup** |
| `001_create_tables.sql` | Creates database tables | If not using complete setup |
| `002_seed_sample_data.sql` | Inserts sample categories | Optional, for testing |
| `005_add_audio_to_tests.sql` | Adds audio_url column | If tests table exists without audio |
| `006_setup_storage.sql` | Creates storage buckets | If storage not set up |

---

## 🎯 Quick Start Summary

1. ✅ Create Supabase project
2. ✅ Copy credentials to `.env.local`
3. ✅ Run `scripts/00_COMPLETE_SETUP.sql` in SQL Editor
4. ✅ Make yourself admin: `UPDATE users SET role = 'admin' WHERE email = 'your-email';`
5. ✅ Sign out and sign back in
6. ✅ Test the application!

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**Need Help?** Check the troubleshooting section or review the SQL scripts for detailed comments.

