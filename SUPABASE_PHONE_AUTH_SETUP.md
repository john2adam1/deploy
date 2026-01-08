# Supabase Phone Authentication Setup (No SMS OTP)

To complete the migration to Phone-based authentication, you must update your Supabase Project Settings.

## 1. Dashboard Settings

Go to your Supabase Project Dashboard -> **Authentication** -> **Providers** -> **Phone**.

1.  **Enable Phone Provider**: Toggle "Enable Phone provider" to **ON**.
2.  **SMS Provider**: Leave as default (Twilio) or whatever it is set to. **Do not configure Twilio** if you don't want to send SMS.
3.  **Confirm Phone**:
    *   **IMPORTANT**: In **Authentication** -> **URL Configuration** -> **Site URL**, ensure your site URL is correct (e.g., `http://localhost:3000`).
    *   Go to **Authentication** -> **Providers** -> **Phone** -> **Phone Confirmations**.
    *   **DISABLE** "Enable Phone Confirmations" if possible.
    *   *However*, typically for "Status: Verified" without sending SMS, we use the Admin API (which we implemented).
    *   Make sure **"Enable Phone Provider"** is standard.

## 2. Environment Variables

You must add your `SUPABASE_SERVICE_ROLE_KEY` to your `.env.local` file for the server-side registration to work.

1.  Go to Supabase Dashboard -> **Project Settings** -> **API**.
2.  Find `service_role` key (secret).
3.  Add it to your `.env.local`:

```env
SUPABASE_SERVICE_ROLE_KEY=eyJh... (your secret key)
```

> **WARNING**: NEVER expose this key in `NEXT_PUBLIC_` variables or commit it to Git. It allows full access to your database, bypassing Row Level Security.

## 3. Database Schema

Ensure your `public.users` table has a `phone` column if you want to query it easily, although our code currently stores the phone number in the `phone` column and generates a placeholder email.

If you encounter errors about missing columns in `public.users`, run this SQL in the Supabase SQL Editor:

```sql
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone TEXT;
```

## 4. Security Tradeoffs

*   **No Verification**: Since we are bypassing SMS verification (`phone_confirm: true` in Admin API), anyone can register with any phone number (e.g., someone else's number). This is acceptable for your stated use case but be aware of it.
*   **Enumeration**: Malicious actors could potentially enumerate registered phone numbers by trying to register and checking for "User already exists" errors.

## 5. What We Implemented

*   **Server Action (`app/auth/actions.ts`)**: securely creates a user with `admin.createUser`, marking the phone as verified immediately.
*   **Admin Client (`lib/supabase/admin.ts`)**: Safe wrapper for the Service Role client.
*   **Register Page**: Now accepts Phone/Password and calls the Server Action.
*   **Login Page**: Now accepts Phone/Password.

## Troubleshooting

*   **"AuthApiError: Phone provider is not enabled"**: Turn on Phone provider in Supabase Dashboard.
*   **"Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"**: Check your `.env.local`.
*   **Login fails**: Ensure you are using the correct format (e.g. `+998901234567`). The code strips spaces automatically.
