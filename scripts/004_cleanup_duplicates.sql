-- Clean up duplicate site_content entries
-- This script keeps only the most recent entry for each type

-- For main_section
DELETE FROM site_content
WHERE id NOT IN (
  SELECT id
  FROM site_content
  WHERE type = 'main_section'
  ORDER BY updated_at DESC
  LIMIT 1
)
AND type = 'main_section';

-- For contact
DELETE FROM site_content
WHERE id NOT IN (
  SELECT id
  FROM site_content
  WHERE type = 'contact'
  ORDER BY updated_at DESC
  LIMIT 1
)
AND type = 'contact';

-- For about
DELETE FROM site_content
WHERE id NOT IN (
  SELECT id
  FROM site_content
  WHERE type = 'about'
  ORDER BY updated_at DESC
  LIMIT 1
)
AND type = 'about';

-- For statistics
DELETE FROM site_content
WHERE id NOT IN (
  SELECT id
  FROM site_content
  WHERE type = 'statistics'
  ORDER BY updated_at DESC
  LIMIT 1
)
AND type = 'statistics';

-- For faq (keep all, as multiple FAQs are expected)
-- No cleanup needed for faq type

