-- ============================================
-- COMPLETE DATABASE SCHEMA (RUN THIS ONLY)
-- ============================================
-- This file defines the full schema from scratch for the project.
-- Run it once in a new Supabase project, or after dropping existing
-- custom tables if you are resetting the database.
--
-- Structure: Topics → Tests, Tickets → Tests
-- No categories - topics are standalone
--
-- UPDATES:
-- - Adjusted 'users' table for Phone-Auth-First approach:
--   - 'email' is now NULLABLE (we might store a dummy email, but DB allows null).
--   - 'phone' is now NOT NULL (primary identifier).
-- ============================================

-- ============================================
-- STEP 1: Enable UUID Extension
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- STEP 2: Core Tables
-- ============================================

-- Users table (metadata; credentials live in auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Email is nullable because we are using Phone Auth primarily
  email TEXT UNIQUE, 
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  -- Kept for backward compatibility; not used for access control
  trial_end TIMESTAMP WITH TIME ZONE NOT NULL,
  subscription_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Profile fields
  first_name TEXT,
  last_name TEXT,
  -- Phone is UNIQUE and NOT NULL as it is our primary ID
  phone TEXT UNIQUE NOT NULL,
  -- Single-device session fields
  active_device_id UUID,
  last_login_at TIMESTAMP WITH TIME ZONE
);

-- Topics table (standalone, no categories)
CREATE TABLE IF NOT EXISTS topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tests table (belongs to topics)
CREATE TABLE IF NOT EXISTS tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  audio_url TEXT,
  question TEXT NOT NULL,
  answers TEXT[] NOT NULL,
  correct_answer INTEGER NOT NULL CHECK (correct_answer >= 0 AND correct_answer <= 3),
  time_limit INTEGER NOT NULL DEFAULT 300,
  explanation_title TEXT,
  explanation_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tickets (Bilets)
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ticket tests junction table (ticket contains exactly 20 questions, enforced in app)
CREATE TABLE IF NOT EXISTS ticket_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(ticket_id, test_id)
);

-- Test results (per attempt)
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

-- Site content table (for dynamic content like contact info, carousel, prices)
CREATE TABLE IF NOT EXISTS site_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Carousel images table
CREATE TABLE IF NOT EXISTS carousel_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STEP 3: Statistics & Settings
-- ============================================

-- Topic statistics (last attempt per user/topic)
CREATE TABLE IF NOT EXISTS topic_statistics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  correct_count INTEGER NOT NULL DEFAULT 0,
  wrong_count INTEGER NOT NULL DEFAULT 0,
  unanswered_count INTEGER NOT NULL DEFAULT 0,
  percentage INTEGER NOT NULL DEFAULT 0,
  last_attempt_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, topic_id)
);

-- Ticket statistics (last attempt per user/ticket)
CREATE TABLE IF NOT EXISTS ticket_statistics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
  correct_count INTEGER NOT NULL DEFAULT 0,
  wrong_count INTEGER NOT NULL DEFAULT 0,
  unanswered_count INTEGER NOT NULL DEFAULT 0,
  percentage INTEGER NOT NULL DEFAULT 0,
  last_attempt_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, ticket_id)
);

-- Exam statistics (20/50/100) per user
CREATE TABLE IF NOT EXISTS exam_statistics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  exam_type INTEGER NOT NULL CHECK (exam_type IN (20, 50, 100)),
  correct_count INTEGER NOT NULL DEFAULT 0,
  wrong_count INTEGER NOT NULL DEFAULT 0,
  unanswered_count INTEGER NOT NULL DEFAULT 0,
  percentage INTEGER NOT NULL DEFAULT 0,
  last_attempt_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, exam_type)
);

-- User settings (font size + language)
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  question_font_size INTEGER NOT NULL DEFAULT 16,
  answer_font_size INTEGER NOT NULL DEFAULT 14,
  language TEXT NOT NULL DEFAULT 'uz-lat' CHECK (language IN ('uz-lat', 'uz-cyr', 'ru')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STEP 4: Indexes
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_tests_topic_id ON tests(topic_id);
CREATE INDEX IF NOT EXISTS idx_ticket_tests_ticket_id ON ticket_tests(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ticket_tests_test_id ON ticket_tests(test_id);
CREATE INDEX IF NOT EXISTS idx_test_results_user_id ON test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_test_results_test_id ON test_results(test_id);
CREATE INDEX IF NOT EXISTS idx_site_content_type ON site_content(type);
CREATE INDEX IF NOT EXISTS idx_topic_statistics_user_id ON topic_statistics(user_id);
CREATE INDEX IF NOT EXISTS idx_topic_statistics_topic_id ON topic_statistics(topic_id);
CREATE INDEX IF NOT EXISTS idx_ticket_statistics_user_id ON ticket_statistics(user_id);
CREATE INDEX IF NOT EXISTS idx_ticket_statistics_ticket_id ON ticket_statistics(ticket_id);
CREATE INDEX IF NOT EXISTS idx_exam_statistics_user_id ON exam_statistics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_carousel_images_order ON carousel_images(order_index);

-- ============================================
-- STEP 5: Triggers
-- ============================================

-- Generic function to keep updated_at in sync
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_topic_statistics_updated_at
  BEFORE UPDATE ON topic_statistics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ticket_statistics_updated_at
  BEFORE UPDATE ON ticket_statistics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exam_statistics_updated_at
  BEFORE UPDATE ON exam_statistics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Separate trigger function for site_content
CREATE OR REPLACE FUNCTION update_site_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_site_content_updated_at
  BEFORE UPDATE ON site_content
  FOR EACH ROW
  EXECUTE FUNCTION update_site_content_updated_at();

-- ============================================
-- STEP 6: Storage Buckets & Policies
-- ============================================

-- Images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('test-images', 'test-images', true)
ON CONFLICT (id) DO NOTHING;

-- Audio bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('test-audio', 'test-audio', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist (to avoid conflicts when re-running)
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
-- SCHEMA FULLY INITIALIZED
-- ============================================
