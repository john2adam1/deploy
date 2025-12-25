-- Insert sample categories
INSERT INTO categories (title) VALUES 
  ('Mathematics'),
  ('Science'),
  ('History')
ON CONFLICT DO NOTHING;

-- Note: Tests will be created through the admin panel
-- To assign admin role to a user, run this query after registration:
-- UPDATE users SET role = 'admin' WHERE email = 'your-admin-email@example.com';
