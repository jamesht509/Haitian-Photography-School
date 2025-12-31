# Environment Variables Setup

## Required Environment Variables

Create a `.env.local` file in the root of the `my-app` directory with the following variables:

```env
# Database Configuration (Neon PostgreSQL)
# Get your connection string from: https://console.neon.tech
POSTGRES_URL="postgres://username:password@hostname/database"
POSTGRES_URL_NON_POOLING="postgres://username:password@hostname/database"

# Admin Dashboard Password
# Change this to a secure password for production
ADMIN_PASSWORD="your-secure-password-here"
```

## Setup Instructions

### 1. Create Neon PostgreSQL Database

1. Go to [https://console.neon.tech](https://console.neon.tech)
2. Create a new project
3. Copy the connection string
4. Run the SQL schema from `schema.sql` to create the tables

### 2. Set Environment Variables

**For Local Development:**
- Create `.env.local` in the `my-app` directory
- Add the variables above with your actual values

**For Vercel Deployment:**
1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add each variable:
   - `POSTGRES_URL`
   - `POSTGRES_URL_NON_POOLING`
   - `ADMIN_PASSWORD`
4. Make sure to select "Production", "Preview", and "Development" environments

### 3. Admin Access

To access the admin dashboard:
1. Navigate to `/admin`
2. Enter the password you set in `ADMIN_PASSWORD`
3. The password will be saved in localStorage for convenience

### 4. Security Notes

- Never commit `.env.local` to git
- Use a strong password for `ADMIN_PASSWORD`
- Consider adding IP whitelisting for the admin route in production
- Rotate your database credentials regularly

