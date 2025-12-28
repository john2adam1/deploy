-- ============================================
-- COMPLETE SUPABASE SETUP SCRIPT
-- ============================================
-- Run this entire script in Supabase SQL Editor
-- This combines all setup steps into one file
-- ============================================

-- ============================================
-- STEP 1: Enable UUID Extension
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- STEP 2: Create Database Tables
-- ============================================

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

-- Tests table (includes audio_url column)
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

-- Site content table (for dynamic content management)
CREATE TABLE IF NOT EXISTS site_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STEP 3: Create Indexes for Performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_tests_category_id ON tests(category_id);
CREATE INDEX IF NOT EXISTS idx_test_results_user_id ON test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_test_results_test_id ON test_results(test_id);
CREATE INDEX IF NOT EXISTS idx_site_content_type ON site_content(type);

-- ============================================
-- STEP 4: Create Function to Update Timestamps
-- ============================================
CREATE OR REPLACE FUNCTION update_site_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for site_content updated_at
CREATE TRIGGER trigger_update_site_content_updated_at
  BEFORE UPDATE ON site_content
  FOR EACH ROW
  EXECUTE FUNCTION update_site_content_updated_at();

-- ============================================
-- STEP 5: Set Up Storage Buckets
-- ============================================

-- Create images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('test-images', 'test-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create audio bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('test-audio', 'test-audio', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 6: Set Up Storage Policies
-- ============================================
-- Note: Policies must be created manually in Supabase Dashboard
-- Go to Storage > test-images > Policies and create these policies
-- Or use the SQL below (drop existing first to avoid conflicts)

-- Drop existing policies if they exist (to avoid conflicts)
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

-- ============================================
-- STEP 7: Insert Sample Data (Optional)
-- ============================================
INSERT INTO categories (title) VALUES 
  ('Mathematics'),
  ('Science'),
  ('History')
ON CONFLICT DO NOTHING;

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- Next steps:
-- 1. Make a user admin: UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
-- 2. Configure Row Level Security (RLS) if needed
-- 3. Test file uploads in the admin panel
-- ============================================

