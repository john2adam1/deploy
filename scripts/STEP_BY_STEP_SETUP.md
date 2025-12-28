# Complete Supabase Setup - Step by Step Guide

Follow these steps **in order** to set up your Supabase project completely.

---

## ✅ STEP 1: Create Database Tables

1. Go to **SQL Editor** in Supabase Dashboard
2. Click **"New Query"**
3. Copy and paste this code:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  trial_end TIMESTAMP WITH TIME ZONE NOT NULL,
  subscription_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tests table
CREATE TABLE IF NOT EXISTS tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  audio_url TEXT,
  question TEXT NOT NULL,
  answers TEXT[] NOT NULL,
  correct_answer INTEGER NOT NULL CHECK (correct_answer >= 0 AND correct_answer <= 3),
  time_limit INTEGER NOT NULL DEFAULT 300,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test results table
CREATE TABLE IF NOT EXISTS test_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  wrong_answers INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site content table
CREATE TABLE IF NOT EXISTS site_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_tests_category_id ON tests(category_id);
CREATE INDEX IF NOT EXISTS idx_test_results_user_id ON test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_test_results_test_id ON test_results(test_id);
CREATE INDEX IF NOT EXISTS idx_site_content_type ON site_content(type);

-- Create function for updated_at trigger
CREATE OR REPLACE FUNCTION update_site_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER trigger_update_site_content_updated_at
  BEFORE UPDATE ON site_content
  FOR EACH ROW
  EXECUTE FUNCTION update_site_content_updated_at();

-- Insert sample categories
INSERT INTO categories (title) VALUES 
  ('Mathematics'),
  ('Science'),
  ('History')
ON CONFLICT DO NOTHING;
```

4. Click **"Run"** (or press Ctrl+Enter)
5. Wait for success message ✅

**Verify:** Go to **Table Editor** - you should see 5 tables: users, categories, tests, test_results, site_content

---

## ✅ STEP 2: Create Storage Buckets

1. Go to **Storage** in Supabase Dashboard (left sidebar)
2. Click **"New bucket"**
3. Create first bucket:
   - **Name:** `test-images`
   - **Public bucket:** ✅ Check this box
   - Click **"Create bucket"**
4. Click **"New bucket"** again
5. Create second bucket:
   - **Name:** `test-audio`
   - **Public bucket:** ✅ Check this box
   - Click **"Create bucket"**

**Verify:** You should see 2 buckets: `test-images` and `test-audio` (both marked as Public)

---

## ✅ STEP 3: Set Up Storage Policies (IMPORTANT!)

### For test-images bucket:

1. Go to **Storage** → Click on **`test-images`** bucket
2. Click **"Policies"** tab
3. Click **"New Policy"**
4. Create these 4 policies one by one:

#### Policy 1: Public View
- **Policy name:** `Public can view images`
- **Allowed operation:** SELECT
- **Policy definition:** 
  ```sql
  (bucket_id = 'test-images')
  ```
- Click **"Review"** → **"Save policy"**

#### Policy 2: Authenticated Upload
- **Policy name:** `Authenticated users can upload images`
- **Allowed operation:** INSERT
- **Policy definition:**
  ```sql
  (bucket_id = 'test-images' AND auth.role() = 'authenticated')
  ```
- Click **"Review"** → **"Save policy"**

#### Policy 3: Authenticated Update
- **Policy name:** `Authenticated users can update images`
- **Allowed operation:** UPDATE
- **Policy definition:**
  ```sql
  (bucket_id = 'test-images' AND auth.role() = 'authenticated')
  ```
- Click **"Review"** → **"Save policy"**

#### Policy 4: Authenticated Delete
- **Policy name:** `Authenticated users can delete images`
- **Allowed operation:** DELETE
- **Policy definition:**
  ```sql
  (bucket_id = 'test-images' AND auth.role() = 'authenticated')
  ```
- Click **"Review"** → **"Save policy"**

### For test-audio bucket:

1. Go to **Storage** → Click on **`test-audio`** bucket
2. Click **"Policies"** tab
3. Create the same 4 policies but change:
   - Replace `test-images` with `test-audio` in all policy definitions
   - Use names like "Public can view audio", etc.

**OR use SQL Editor (easier):**

Go to **SQL Editor** and run this:

```sql
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view audio" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload audio" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update audio" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete audio" ON storage.objects;

-- Images bucket policies
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'test-images');

CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'test-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'test-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
USING (bucket_id = 'test-images' AND auth.role() = 'authenticated');

-- Audio bucket policies
CREATE POLICY "Public can view audio"
ON storage.objects FOR SELECT
USING (bucket_id = 'test-audio');

CREATE POLICY "Authenticated users can upload audio"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'test-audio' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update audio"
ON storage.objects FOR UPDATE
USING (bucket_id = 'test-audio' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete audio"
ON storage.objects FOR DELETE
USING (bucket_id = 'test-audio' AND auth.role() = 'authenticated');
```

---

## ✅ STEP 4: Make Yourself Admin

1. **First, register your account** in the app (go to `/register`)
2. Go to **SQL Editor** in Supabase
3. Run this query (replace with your actual email):

```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

4. **Sign out** from the app
5. **Sign back in** to refresh your session
6. You should now see the **Admin Panel** link!

---

## ✅ STEP 5: Verify Everything Works

### Check Tables:
- Go to **Table Editor**
- Should see: users, categories, tests, test_results, site_content ✅

### Check Storage:
- Go to **Storage**
- Should see: test-images, test-audio (both Public) ✅

### Check Policies:
- Go to **Storage** → **test-images** → **Policies**
- Should see 4 policies ✅
- Go to **Storage** → **test-audio** → **Policies**
- Should see 4 policies ✅

### Test in App:
1. Log in as admin
2. Go to **Admin Panel**
3. Try creating a category ✅
4. Try creating a test with image/audio upload ✅
5. Check **Storage** - files should appear in buckets ✅

---

## 🎯 Quick Checklist

- [ ] Step 1: Database tables created
- [ ] Step 2: Storage buckets created (test-images, test-audio)
- [ ] Step 3: Storage policies created (8 policies total)
- [ ] Step 4: Made yourself admin
- [ ] Step 5: Tested file uploads

---

## 🐛 Common Issues

### "Bucket does not exist"
- Make sure you created both buckets in Storage section
- Check bucket names are exactly: `test-images` and `test-audio`

### "Permission denied" when uploading
- Check storage policies are created
- Make sure buckets are set to **Public**
- Make sure you're logged in

### Can't see Admin Panel
- Make sure you updated your role to 'admin'
- Sign out and sign back in
- Check your email matches in the UPDATE query

---

## 📝 Summary

**What you need to do:**
1. ✅ Run SQL to create tables (Step 1)
2. ✅ Create 2 storage buckets manually (Step 2)
3. ✅ Create 8 storage policies via SQL (Step 3)
4. ✅ Make yourself admin (Step 4)
5. ✅ Test everything (Step 5)

**Total time:** ~10 minutes

That's it! Your Supabase is now fully configured! 🎉

