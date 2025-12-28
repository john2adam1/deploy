# Contact Section Setup in Supabase

The Contact section uses the `site_content` table which should already exist from your initial setup.

## ✅ What's Already Done

The `site_content` table was created in your initial setup script (`00_COMPLETE_SETUP.sql`). No additional database setup is needed!

## 📝 How to Use Contact Management

### Option 1: Use Admin Panel (Recommended)

1. Log in as admin
2. Go to **Admin Panel** → **Contact** tab
3. Fill in:
   - **Telegram Username** (e.g., `@yourusername`)
   - **Telegram Link** (e.g., `https://t.me/yourusername`)
   - **Email Address** (e.g., `support@example.com`)
4. Click **"Save Contact Information"**
5. The contact information will appear on the homepage automatically!

### Option 2: Manual SQL Insert (If needed)

If you prefer to set it up manually via SQL:

1. Go to **SQL Editor** in Supabase Dashboard
2. Run this query (replace with your actual contact info):

```sql
INSERT INTO site_content (type, content)
VALUES (
  'contact',
  '{
    "telegram": "@yourusername",
    "telegram_link": "https://t.me/yourusername",
    "email": "support@example.com"
  }'::jsonb
)
ON CONFLICT (type) 
DO UPDATE SET 
  content = EXCLUDED.content,
  updated_at = NOW();
```

## 🔍 Verify It's Working

1. Go to your homepage (`/`)
2. Scroll down to the **Contact Us** section
3. You should see:
   - Telegram username
   - "Contact via Telegram" button (if link is provided)
   - Email address

## 🐛 Troubleshooting

### Contact section is empty

- Make sure you saved the contact information in the admin panel
- Check that the `site_content` table exists (go to **Table Editor**)
- Verify there's a row with `type = 'contact'`

### Can't see Contact tab in admin panel

- Make sure you're logged in as admin
- Sign out and sign back in
- Check your user role: `SELECT role FROM users WHERE email = 'your-email';`

### Changes not showing on homepage

- Clear browser cache
- Hard refresh the page (Ctrl+F5 or Cmd+Shift+R)
- Check browser console for errors

## 📊 Database Structure

The contact information is stored in the `site_content` table:

```sql
-- Table structure
site_content
├── id (UUID)
├── type (TEXT) - 'contact'
├── content (JSONB) - {
│     "telegram": "...",
│     "telegram_link": "...",
│     "email": "..."
│   }
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

## ✅ That's It!

No additional Supabase setup needed. Just use the admin panel to manage contact information!

