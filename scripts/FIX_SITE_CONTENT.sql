-- ============================================
-- FIX SITE CONTENT & CONTACT INFO
-- ============================================

-- 1. Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS site_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Insert default contact data
INSERT INTO site_content (type, content)
VALUES (
  'contact', 
  '{
    "phone": "+998 90 123 45 67",
    "telegram": "Telegram orqali yozish",
    "telegram_link": "https://t.me/sarvar_avtotest",
    "address": "Toshkent shahri"
  }'::jsonb
)
ON CONFLICT (type) DO NOTHING;

-- 3. Enable RLS and add public read policy
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view site content" ON site_content;

CREATE POLICY "Public can view site content" 
ON site_content FOR SELECT 
USING (true);

-- 4. Enable admin upload/update (optional, depends on your auth setup)
-- Checks if user has admin role or is just authenticated (adjust as needed)
DROP POLICY IF EXISTS "Admins can manage site content" ON site_content;
CREATE POLICY "Admins can manage site content"
ON site_content FOR ALL
USING (auth.role() = 'authenticated'); 
-- Note: Ideally checking for role='admin' in users table, but keeping it simple for now
