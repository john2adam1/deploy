# SQL Scripts Directory

This directory contains all SQL scripts needed to set up your Supabase database.

## 🎯 Quick Start

**For first-time setup, use:**
- `00_COMPLETE_SETUP.sql` - Run this ONE file to set up everything!

## 📁 File Organization

### Main Setup Scripts

| File | Description | Status |
|------|-------------|--------|
| `00_COMPLETE_SETUP.sql` | **All-in-one setup script** - Run this first! | ✅ Use this |
| `001_create_tables.sql` | Creates database tables | ⚠️ Use only if not using complete setup |
| `002_seed_sample_data.sql` | Inserts sample categories | Optional |
| `005_add_audio_to_tests.sql` | Adds audio_url to existing tests table | ⚠️ Only if tests table exists without audio |
| `006_setup_storage.sql` | Sets up file storage buckets | ⚠️ Only if not using complete setup |

### Documentation

| File | Description |
|------|-------------|
| `SUPABASE_SETUP_GUIDE.md` | Complete setup guide with step-by-step instructions |
| `README.md` | This file |

## 🚀 Recommended Setup Flow

1. **First Time Setup:**
   ```
   Run: 00_COMPLETE_SETUP.sql
   ```

2. **Make Yourself Admin:**
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
   ```

3. **Done!** ✅

## 📝 Script Details

### 00_COMPLETE_SETUP.sql
- Creates all tables (users, categories, tests, test_results, site_content)
- Includes audio_url column in tests table
- Sets up storage buckets (test-images, test-audio)
- Creates storage policies
- Creates indexes for performance
- Inserts sample categories

### 001_create_tables.sql
- Creates core database tables
- Creates indexes
- **Note:** Updated to include audio_url column

### 002_seed_sample_data.sql
- Inserts sample categories (Mathematics, Science, History)
- Optional - only for testing

### 005_add_audio_to_tests.sql
- Adds audio_url column to existing tests table
- Only needed if you already have a tests table without audio support

### 006_setup_storage.sql
- Creates storage buckets for images and audio
- Sets up storage policies for public read and authenticated write

## ⚠️ Important Notes

1. **Always run scripts in Supabase SQL Editor**
2. **Run scripts in order** if not using complete setup
3. **Backup your database** before running migration scripts
4. **Check for errors** after running each script

## 🔄 Migration Path

If you already have a database set up:

1. If tests table exists without audio_url:
   - Run `005_add_audio_to_tests.sql`

2. If storage buckets don't exist:
   - Run `006_setup_storage.sql`

3. Otherwise, you're good to go!

## 📚 More Information

See `SUPABASE_SETUP_GUIDE.md` for detailed setup instructions and troubleshooting.

