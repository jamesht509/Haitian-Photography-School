# 📸 Haitian Photography School - Lead Capture System

A complete lead capture system with admin dashboard for the Haitian Photography School landing page.

## ✨ Features

### 🎯 Lead Capture
- ✅ Beautiful dark editorial themed landing page (Black/Gold)
- ✅ Registration form with validation
- ✅ Automatic device detection (Mobile/Desktop/Tablet)
- ✅ IP address tracking
- ✅ Referrer source tracking
- ✅ User-agent logging
- ✅ Success modal with 90% progress bar
- ✅ WhatsApp group integration

### 📊 Admin Dashboard (`/admin`)
- ✅ Password protected access
- ✅ Total leads counter
- ✅ Device breakdown with visual charts
- ✅ Top cities ranking
- ✅ Complete leads table with all metadata
- ✅ Real-time statistics
- ✅ Export-ready data
- ✅ Dark editorial theme matching landing page

### 🔧 Technical Features
- ✅ Built with Next.js 16 (App Router)
- ✅ TypeScript for type safety
- ✅ PostgreSQL database (Neon)
- ✅ Server-side API routes
- ✅ Vercel-optimized deployment
- ✅ Responsive design (Mobile-first)
- ✅ SEO-friendly

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd my-app
npm install
```

### 2. Setup Database

1. Create a free account at [Neon](https://neon.tech)
2. Create a new project
3. Copy your connection string
4. Run the schema:

```bash
# Connect to your database and execute:
psql "your-postgres-url" < schema.sql
```

### 3. Configure Environment Variables

Create `.env.local`:

```env
POSTGRES_URL="your-neon-postgres-url"
POSTGRES_URL_NON_POOLING="your-neon-postgres-url-non-pooling"
ADMIN_PASSWORD="your-secure-password"
```

### 4. Run Development Server

```bash
npm run dev
```

Visit:
- Landing page: http://localhost:3000
- Admin dashboard: http://localhost:3000/admin

## 📁 Project Structure

```
my-app/
├── app/
│   ├── api/
│   │   └── leads/
│   │       ├── route.ts          # POST /api/leads - Save lead
│   │       └── stats/
│   │           └── route.ts      # GET /api/leads/stats - Dashboard stats
│   ├── admin/
│   │   └── page.tsx              # Admin dashboard UI
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page (main entry)
├── public/
│   └── form-integration.js       # Form handling script
├── schema.sql                    # Database schema
├── ENV_SETUP.md                  # Environment setup guide
├── DEPLOYMENT_GUIDE.md           # Deployment instructions
└── package.json                  # Dependencies
```

## 🗄️ Database Schema

### `leads` table

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL | Primary key |
| `name` | VARCHAR(255) | Full name |
| `whatsapp` | VARCHAR(50) | WhatsApp number |
| `email` | VARCHAR(255) | Email address |
| `city_from_form` | VARCHAR(255) | City entered in form |
| `ip_address` | VARCHAR(45) | User's IP address |
| `device_type` | VARCHAR(20) | mobile/desktop/tablet/unknown |
| `user_agent` | TEXT | Full user-agent string |
| `referrer` | TEXT | Where they came from |
| `created_at` | TIMESTAMP | When lead was captured |
| `updated_at` | TIMESTAMP | Last update time |

## 🔌 API Endpoints

### `POST /api/leads`

Save a new lead with automatic metadata capture.

**Request:**
```json
{
  "name": "Jean Baptiste",
  "whatsapp": "+1 (617) 555-0123",
  "email": "jean@example.com",
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
    "created_at": "2025-01-10T12:00:00Z",
    "device_type": "mobile"
  }
}
```

### `GET /api/leads`

Retrieve all leads (requires authentication).

**Headers:**
```
Authorization: Bearer your-admin-password
```

**Response:**
```json
{
  "success": true,
  "leads": [...],
  "count": 42
}
```

### `GET /api/leads/stats`

Get dashboard statistics (requires authentication).

**Response:**
```json
{
  "success": true,
  "stats": {
    "total_leads": 42,
    "device_breakdown": [...],
    "top_cities": [...],
    "timeline": [...],
    "referrers": [...]
  }
}
```

## 🌐 Deploy to Vercel

### Option 1: Vercel CLI

```bash
npm install -g vercel
vercel
```

### Option 2: GitHub Integration

1. Push code to GitHub
2. Import in Vercel dashboard
3. Add environment variables
4. Deploy!

### Option 3: Manual

1. Build the project:
   ```bash
   npm run build
   ```
2. Deploy the `.next` folder to Vercel

### Required Environment Variables (Vercel)

Set these in Vercel Dashboard → Settings → Environment Variables:

- `POSTGRES_URL`
- `POSTGRES_URL_NON_POOLING`
- `ADMIN_PASSWORD`

## 🔐 Security

### Admin Dashboard Protection

The admin dashboard is protected by password authentication. The password is set via the `ADMIN_PASSWORD` environment variable.

**Best Practices:**
- Use a strong, unique password
- Store password in environment variables only
- Never commit passwords to git
- Rotate passwords regularly
- Consider adding IP whitelisting for production

### Database Security

- Use Neon's connection pooling
- Enable SSL connections
- Use separate read-only credentials for reporting
- Regularly backup your database

## 📱 Landing Page Features

### Success Modal

After form submission, users see:
- 90% progress bar with pulsing gold glow
- Clear next steps
- WhatsApp group CTA button
- Professional, encouraging messaging

### CTA Buttons

All CTA buttons automatically:
- Scroll to the registration form
- Focus the first input field
- Provide smooth animations

### Form Validation

- Required fields validation
- Email format validation
- Phone number formatting
- Real-time error messages
- Loading states during submission

## 🎨 Customization

### Change Colors

Edit the CSS variables in `app/globals.css`:

```css
:root {
  --gold: #D4AF37;
  --dark-bg: #050505;
}
```

### Update WhatsApp Link

Search for `https://tyn.bio/Class8Janvye` and replace with your link.

### Modify Form Fields

Edit the form in `index.html` and update the API route in `app/api/leads/route.ts`.

## 📈 Analytics Integration

### Google Analytics

Add to your layout:

```typescript
// app/layout.tsx
<Script src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID" />
```

### Facebook Pixel

Add to your layout:

```typescript
// app/layout.tsx
<Script id="facebook-pixel">
  {`!function(f,b,e,v,n,t,s)...`}
</Script>
```

## 🐛 Troubleshooting

### Database Connection Error

- Verify `POSTGRES_URL` is correct
- Check Neon dashboard for connection status
- Ensure IP is whitelisted (if using)

### Admin Login Not Working

- Verify `ADMIN_PASSWORD` environment variable is set
- Clear browser localStorage
- Check browser console for errors

### Form Not Submitting

- Open browser console for errors
- Verify API route is accessible
- Check network tab for failed requests
- Ensure all required fields have `name` attributes

## 📞 Support

For issues:
1. Check the logs: `vercel logs` or Neon dashboard
2. Verify environment variables are set
3. Review browser console errors
4. Check database connection

## 🎉 What's Included

- ✅ Complete landing page with book preview
- ✅ Registration form with validation
- ✅ Success modal with progress bar
- ✅ Admin dashboard with statistics
- ✅ PostgreSQL database schema
- ✅ API routes for lead capture
- ✅ Device and IP tracking
- ✅ Referrer tracking
- ✅ WhatsApp integration
- ✅ Mobile-responsive design
- ✅ Dark editorial theme
- ✅ Ready for Vercel deployment

## 📝 License

This project is private and proprietary to Haitian Photography School.

## 🙏 Credits

Built with love for Haitian Photography School 📸✨
