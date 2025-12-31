# Deployment Guide - Haitian Photography School

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Neon PostgreSQL account (free tier available)
- Vercel account (optional, for deployment)

## 📦 Installation

```bash
cd my-app
npm install
```

## 🗄️ Database Setup

### 1. Create Neon Database

1. Sign up at [https://neon.tech](https://neon.tech)
2. Create a new project
3. Copy your connection string (starts with `postgres://`)

### 2. Run Database Schema

Connect to your Neon database and run the SQL from `schema.sql`:

```sql
-- Copy and paste the contents of schema.sql into the Neon SQL Editor
```

Or use the Neon CLI:
```bash
psql "your-connection-string-here" < schema.sql
```

## ⚙️ Configuration

### 1. Environment Variables

Create `.env.local` in the `my-app` directory:

```env
POSTGRES_URL="your-neon-connection-string"
POSTGRES_URL_NON_POOLING="your-neon-non-pooling-connection-string"
ADMIN_PASSWORD="your-secure-password"
```

### 2. Test Locally

```bash
npm run dev
```

Visit:
- Landing page: http://localhost:3000
- Admin dashboard: http://localhost:3000/admin

## 🌐 Deploy to Vercel

### Option 1: Vercel CLI

```bash
npm install -g vercel
vercel
```

### Option 2: Vercel Dashboard

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `POSTGRES_URL`
   - `POSTGRES_URL_NON_POOLING`
   - `ADMIN_PASSWORD`
4. Deploy!

### Option 3: Deploy Button

Click the button below:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/yourrepo)

## 🔐 Admin Dashboard

Access the admin panel at `/admin`:

**Features:**
- View all captured leads
- See device breakdown (mobile vs desktop)
- Track top cities
- View IP addresses and referrers
- Real-time statistics

**Default Password:** Set in `ADMIN_PASSWORD` env variable

## 📊 API Endpoints

### POST /api/leads
Capture a new lead with automatic metadata detection.

**Request:**
```json
{
  "name": "John Doe",
  "whatsapp": "+1234567890",
  "email": "john@example.com",
  "city": "Boston, MA"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Lead captured successfully",
  "data": {
    "id": 1,
    "created_at": "2025-01-01T00:00:00Z",
    "device_type": "mobile"
  }
}
```

### GET /api/leads
Get all leads (requires auth).

**Headers:**
```
Authorization: Bearer your-admin-password
```

### GET /api/leads/stats
Get dashboard statistics (requires auth).

## 🎨 Features

### Lead Capture
- ✅ Automatic device detection (mobile/desktop/tablet)
- ✅ IP address tracking
- ✅ Referrer tracking
- ✅ User-agent logging
- ✅ Success modal with WhatsApp CTA

### Admin Dashboard
- ✅ Dark editorial theme (Black/Gold)
- ✅ Password protection
- ✅ Total leads counter
- ✅ Device type breakdown with charts
- ✅ Top cities ranking
- ✅ Complete lead table with all details
- ✅ Responsive design

### CTA Buttons
- ✅ All buttons scroll to form
- ✅ Form submission triggers success modal
- ✅ WhatsApp link integration
- ✅ Mobile-optimized

## 🔧 Customization

### Change Admin Password
Update `ADMIN_PASSWORD` in `.env.local` or Vercel settings.

### Modify Database Schema
Edit `schema.sql` and run migrations on your database.

### Update WhatsApp Link
Change the link in the success modal (search for `https://tyn.bio/Class8Janvye`).

## 🐛 Troubleshooting

### Database Connection Error
- Verify `POSTGRES_URL` is correct
- Check Neon dashboard for connection strings
- Ensure IP allowlist is configured (if using)

### Admin Login Not Working
- Verify `ADMIN_PASSWORD` environment variable is set
- Clear browser localStorage
- Check browser console for errors

### Form Not Submitting
- Check browser console for errors
- Verify API route is accessible
- Test API endpoint directly with curl/Postman

## 📈 Monitoring

### View Logs
**Vercel:**
```bash
vercel logs
```

### Database Queries
Use Neon's built-in query editor to analyze data:

```sql
-- Total leads
SELECT COUNT(*) FROM leads;

-- Leads by device
SELECT device_type, COUNT(*) FROM leads GROUP BY device_type;

-- Leads by city
SELECT city_from_form, COUNT(*) FROM leads GROUP BY city_from_form ORDER BY COUNT(*) DESC;
```

## 📞 Support

For issues or questions:
- Check the database logs in Neon
- Review Vercel deployment logs
- Verify all environment variables are set correctly

## 🎉 Success!

Your lead capture system is now live! Monitor your leads at `/admin`.

