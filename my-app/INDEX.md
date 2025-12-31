# 📚 Project Index

Complete overview of all files and their purposes in the Haitian Photography School Lead Capture System.

## 🚀 Getting Started Files

| File | Purpose |
|------|---------|
| `QUICK_START.md` | ⚡ **Start here!** 5-minute setup guide |
| `README.md` | Complete documentation and feature list |
| `DEPLOYMENT_GUIDE.md` | Step-by-step deployment instructions |
| `ENV_SETUP.md` | Environment variables explained |
| `INTEGRATION_STEPS.md` | How to integrate HTML with Next.js |

## 🗄️ Database Files

| File | Purpose |
|------|---------|
| `schema.sql` | PostgreSQL database schema (run this first!) |
| `USEFUL_QUERIES.sql` | Collection of SQL queries for analytics |

## 🎨 Frontend Files

### Landing Page
| File | Purpose |
|------|---------|
| `public/landing.html` | Main landing page (copied from root) |
| `public/images/` | All images for the landing page |
| `public/form-integration.js` | Form handling and API integration script |

### Next.js Pages
| File | Purpose |
|------|---------|
| `app/page.tsx` | Homepage (redirects to landing.html) |
| `app/admin/page.tsx` | Admin dashboard UI |
| `app/layout.tsx` | Root layout (wraps all pages) |
| `app/globals.css` | Global styles |

## 🔌 Backend Files (API)

| File | Purpose |
|------|---------|
| `app/api/leads/route.ts` | Main API endpoint (POST to save, GET to retrieve leads) |
| `app/api/leads/stats/route.ts` | Statistics API for admin dashboard |

## ⚙️ Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies and scripts |
| `tsconfig.json` | TypeScript configuration |
| `next.config.ts` | Next.js configuration |
| `vercel.json` | Vercel deployment config |
| `.gitignore` | Files to ignore in git |
| `.env.local` | Environment variables (you create this) |

## 📁 Folder Structure

```
my-app/
├── 📖 Documentation
│   ├── QUICK_START.md          ⚡ Start here!
│   ├── README.md               📚 Complete docs
│   ├── DEPLOYMENT_GUIDE.md     🚀 Deploy guide
│   ├── ENV_SETUP.md            🔐 Environment setup
│   ├── INTEGRATION_STEPS.md    🔗 Integration guide
│   └── INDEX.md                📋 This file
│
├── 🗄️ Database
│   ├── schema.sql              🏗️  Database structure
│   └── USEFUL_QUERIES.sql      📊 Analytics queries
│
├── 🎨 Frontend
│   ├── app/
│   │   ├── page.tsx            🏠 Homepage (redirects)
│   │   ├── layout.tsx          🎯 Root layout
│   │   ├── globals.css         🎨 Global styles
│   │   └── admin/
│   │       └── page.tsx        👨‍💼 Admin dashboard
│   │
│   └── public/
│       ├── landing.html        📄 Landing page
│       ├── form-integration.js 📝 Form handler
│       └── images/             🖼️  Images folder
│
├── 🔌 Backend
│   └── app/api/leads/
│       ├── route.ts            💾 Save/Get leads
│       └── stats/
│           └── route.ts        📊 Dashboard stats
│
└── ⚙️ Config
    ├── package.json            📦 Dependencies
    ├── tsconfig.json           🔷 TypeScript config
    ├── next.config.ts          ⚡ Next.js config
    ├── vercel.json             ☁️  Vercel config
    └── .gitignore              🚫 Git ignore rules
```

## 🎯 Key Features by File

### Landing Page (`public/landing.html`)
- ✅ Hero section with compelling CTA
- ✅ Registration form with validation
- ✅ Success modal (90% progress bar)
- ✅ WhatsApp integration
- ✅ Book preview with page navigation
- ✅ Pricing breakdown
- ✅ Mobile responsive
- ✅ Dark editorial theme

### Admin Dashboard (`app/admin/page.tsx`)
- ✅ Password protected login
- ✅ Total leads counter
- ✅ Device breakdown chart
- ✅ Top cities ranking
- ✅ Complete leads table
- ✅ IP and metadata tracking
- ✅ Real-time updates
- ✅ Export-ready data

### Lead Capture API (`app/api/leads/route.ts`)
- ✅ POST endpoint to save leads
- ✅ Automatic device detection
- ✅ IP address capture
- ✅ Referrer tracking
- ✅ User-agent logging
- ✅ Form validation
- ✅ Error handling

### Stats API (`app/api/leads/stats/route.ts`)
- ✅ Total leads count
- ✅ Device type breakdown
- ✅ Top cities analysis
- ✅ Timeline data (30 days)
- ✅ Referrer breakdown
- ✅ Protected by admin auth

## 🔐 Security Features

- Password-protected admin dashboard
- Environment variables for sensitive data
- SQL injection prevention (parameterized queries)
- CORS protection
- Input validation and sanitization
- Secure database connections

## 📊 Analytics Capabilities

### Tracked Metadata
- Device type (mobile/desktop/tablet)
- IP address
- User agent
- Referrer source
- Timestamp
- Geographic location (city from form)

### Available Reports
- Total leads count
- Device breakdown (mobile vs desktop %)
- Top cities by lead count
- Leads over time (timeline)
- Traffic sources (referrers)
- Duplicate detection
- Growth rate analysis

## 🚀 Deployment Workflow

1. **Setup Database**
   - Create Neon project
   - Run `schema.sql`

2. **Configure Environment**
   - Create `.env.local`
   - Add database URLs
   - Set admin password

3. **Test Locally**
   - `npm install`
   - `npm run dev`
   - Test form submission
   - Test admin dashboard

4. **Deploy to Vercel**
   - Push to GitHub
   - Import in Vercel
   - Add environment variables
   - Deploy!

## 📞 Quick Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Deploy to Vercel
vercel --prod

# Run linter
npm run lint
```

## 🔗 Important URLs (Local)

| Service | URL |
|---------|-----|
| Landing Page | http://localhost:3000 |
| Admin Dashboard | http://localhost:3000/admin |
| API (Save Lead) | http://localhost:3000/api/leads |
| API (Stats) | http://localhost:3000/api/leads/stats |

## 🔗 Important URLs (Production)

| Service | URL |
|---------|-----|
| Landing Page | https://your-domain.com |
| Admin Dashboard | https://your-domain.com/admin |
| API (Save Lead) | https://your-domain.com/api/leads |
| API (Stats) | https://your-domain.com/api/leads/stats |

## 🎓 Learning Resources

### Next.js
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

### Vercel & Neon
- [Vercel Documentation](https://vercel.com/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)

### React & TypeScript
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🐛 Troubleshooting Guide

| Issue | Solution File |
|-------|--------------|
| Can't connect to database | `ENV_SETUP.md` |
| Form not submitting | `INTEGRATION_STEPS.md` |
| Admin login failing | `ENV_SETUP.md` |
| Deployment errors | `DEPLOYMENT_GUIDE.md` |
| Want to analyze data | `USEFUL_QUERIES.sql` |

## ✅ Pre-Deployment Checklist

Before going live, verify:

- [ ] Database schema created (`schema.sql`)
- [ ] Environment variables set
- [ ] Admin password changed from default
- [ ] Form submission tested
- [ ] Success modal working
- [ ] Admin dashboard accessible
- [ ] Device tracking working
- [ ] WhatsApp link correct
- [ ] Images loading
- [ ] Mobile responsive
- [ ] Analytics integrated (optional)

## 🆘 Need Help?

1. **Quick issue?** → Check `QUICK_START.md`
2. **Setup problem?** → Check `ENV_SETUP.md`
3. **Deployment issue?** → Check `DEPLOYMENT_GUIDE.md`
4. **Want to analyze data?** → Check `USEFUL_QUERIES.sql`
5. **API questions?** → Check `README.md`

## 🎉 What's Working

After setup, you have:

✅ Beautiful landing page with dark editorial theme  
✅ Lead capture form with validation  
✅ Automatic device & IP tracking  
✅ Success modal with 90% progress bar  
✅ WhatsApp group integration  
✅ Admin dashboard with real-time stats  
✅ Password-protected admin access  
✅ PostgreSQL database (Neon)  
✅ Ready for Vercel deployment  
✅ Mobile-responsive design  
✅ Complete analytics capabilities  

## 📝 Notes

- All files use TypeScript for type safety
- API routes follow REST conventions
- Database uses PostgreSQL (compatible with any hosting)
- Admin dashboard uses client-side React hooks
- Landing page uses vanilla JavaScript for compatibility
- All documentation is in Markdown format

---

**Last Updated:** 2025-01-01  
**Version:** 1.0.0  
**Author:** Ryan @ Haitian Photography School  
**Tech Stack:** Next.js 16, TypeScript, PostgreSQL, Vercel

