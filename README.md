# TestMaster - Online Test Platform

A full-stack web application for online testing with authentication, free trials, subscriptions, and admin management.

## Features

- ✅ Email & Password Authentication
- ✅ 24-Hour Free Trial System
- ✅ Admin-Managed Subscriptions
- ✅ Test Categories & Management
- ✅ Real-time Countdown Timers
- ✅ Test Statistics & Results
- ✅ Role-Based Access Control
- ✅ Responsive Design

## Tech Stack

- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **UI Components:** shadcn/ui
- **Authentication:** Supabase Auth

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- Git (optional)

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in:
   - **Project Name:** testmaster (or any name)
   - **Database Password:** Create a strong password (save it!)
   - **Region:** Choose closest to you
4. Click "Create new project" and wait ~2 minutes

### 2. Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public key** (starts with `eyJhbG...`)

### 3. Set Up the Database

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the contents of `scripts/001_create_tables.sql` from this project
4. Paste into the SQL Editor and click **Run**
5. Repeat for `scripts/002_seed_sample_data.sql`

### 4. Configure Environment Variables

1. In the project root, create a file named `.env.local`
2. Add these lines (replace with your actual values):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/dashboard
```

### 5. Install Dependencies

```bash
npm install
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 7. Assign Admin Role

1. Register a new account through the app
2. Go to Supabase dashboard → **Table Editor** → **users** table
3. Find your user row and click **Edit**
4. Change `role` from `user` to `admin`
5. Click **Save**
6. Refresh the app and you'll see the "Admin Panel" button

## Usage Guide

### For Users

1. **Register:** Create an account to get a 24-hour free trial
2. **Dashboard:** View available test categories
3. **Take Tests:** Click "Start Test" to begin
4. **View Results:** See your score and statistics after completing a test

### For Admins

1. **User Management:**
   - View all users
   - Grant 1-month subscriptions
   - Revoke subscriptions

2. **Category Management:**
   - Create new test categories
   - Delete existing categories

3. **Test Management:**
   - Create tests with images, questions, and 4 answers
   - Set correct answer and time limits
   - Assign tests to categories

## Project Structure

```
├── app/
│   ├── admin/              # Admin panel pages
│   ├── dashboard/          # User dashboard
│   ├── login/              # Login page
│   ├── register/           # Registration page
│   ├── test/               # Test interface
│   └── layout.tsx          # Root layout
├── components/
│   ├── admin/              # Admin management components
│   ├── ui/                 # shadcn/ui components
│   ├── countdown-timer.tsx # Timer component
│   ├── navbar.tsx          # Navigation bar
│   └── test-interface.tsx  # Test UI
├── lib/
│   ├── supabase/           # Supabase clients
│   ├── access-control.ts   # Trial/subscription logic
│   └── types.ts            # TypeScript types
├── scripts/
│   └── *.sql               # Database setup scripts
└── middleware.ts           # Auth & role protection
```

## Database Schema

### users
- `id` (UUID, Primary Key)
- `email` (Text, Unique)
- `role` (Text: 'user' | 'admin')
- `trial_end` (Timestamp)
- `subscription_end` (Timestamp, Nullable)

### categories
- `id` (UUID, Primary Key)
- `title` (Text)

### tests
- `id` (UUID, Primary Key)
- `category_id` (UUID, Foreign Key)
- `image_url` (Text)
- `question` (Text)
- `answers` (Text Array)
- `correct_answer` (Integer: 0-3)
- `time_limit` (Integer, seconds)

### test_results
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `test_id` (UUID, Foreign Key)
- `score` (Integer, percentage)
- `total_questions` (Integer)
- `correct_answers` (Integer)
- `wrong_answers` (Integer)

## Customization

### Change Trial Duration

Edit `app/register/page.tsx`:
```typescript
const trialEnd = new Date()
trialEnd.setHours(trialEnd.getHours() + 48) // Change 24 to 48 for 2 days
```

### Change Subscription Duration

Edit `components/admin/users-management.tsx`:
```typescript
subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 3) // Change 1 to 3 for 3 months
```

### Update Telegram Link

Edit `app/dashboard/page.tsx` and find:
```typescript
<a href="https://t.me/admin">
```
Replace `admin` with your Telegram username.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

## Troubleshooting

### "Invalid API key" error
- Double-check your `.env.local` file
- Make sure there are no extra spaces
- Restart the dev server after changing `.env.local`

### Can't see admin panel
- Make sure you updated the `role` to `admin` in the database
- Clear browser cache and cookies
- Sign out and sign back in

### Tests not loading
- Check that categories exist in the database
- Check that tests are assigned to the correct category
- Open browser console (F12) to see errors

## Security Notes

- Never commit `.env.local` to version control
- Use Row Level Security (RLS) in production
- Keep your Supabase keys secure
- Use strong passwords for admin accounts

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Supabase logs in your dashboard
3. Check browser console for errors

## License

MIT License - feel free to use for personal or commercial projects.
