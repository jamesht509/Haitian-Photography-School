# 🚀 START HERE - Haitian Photography School Lead Capture System

## ✨ What You Have Now

A complete, production-ready lead capture system with:

- ✅ **Beautiful Landing Page** - Dark editorial theme (Black/Gold) with registration form
- ✅ **Admin Dashboard** - Password-protected panel to view all leads and statistics
- ✅ **PostgreSQL Database** - Neon-hosted database with complete schema
- ✅ **API Integration** - Automatic device, IP, and referrer tracking
- ✅ **Success Modal** - 90% progress bar with WhatsApp CTA
- ✅ **Mobile Responsive** - Perfect on all devices
- ✅ **Vercel Ready** - Optimized for instant deployment

## 🎯 Quick Start (5 Minutes)

### Step 1: Database Setup (2 minutes)

1. Go to https://console.neon.tech and create a free account
2. Create a new project
3. Open the SQL Editor
4. Copy/paste the entire contents of `schema.sql` and run it
5. Copy your connection strings (you'll need them next)

### Step 2: Environment Setup (1 minute)

1. Create a file named `.env.local` in this folder (`my-app/`)
2. Copy the content from `ENV_TEMPLATE.txt` into `.env.local`
3. Replace the placeholder values with your actual Neon database URLs
4. Change the admin password to something secure

### Step 3: Install & Run (2 minutes)

```bash
# You're already in the my-app folder, right?
# If not: cd my-app

# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

### Step 4: Test Everything

1. Open http://localhost:3000 - You'll see the landing page
2. Fill out the registration form and submit
3. You should see the success modal with 90% progress
4. Open http://localhost:3000/admin
5. Login with your admin password
6. You should see your test lead in the dashboard!

## 📁 Important Files

| File | What It Is |
|------|-----------|
| `QUICK_START.md` | More detailed 5-minute setup guide |
| `CHECKLIST.md` | Complete deployment checklist |
| `INDEX.md` | Overview of all files and features |
| `README.md` | Complete documentation |
| `schema.sql` | Database structure (run this in Neon) |
| `ENV_TEMPLATE.txt` | Template for your `.env.local` file |

## 🎨 Features Overview

### Landing Page Features
- Hero section with compelling value proposition
- Pricing breakdown (4 payment options, $0 deposit, 0% interest)
- Content mastery grid (6 learning modules)
- Interactive book preview with page navigation
- Registration form with validation
- Success modal with progress bar
- WhatsApp group integration
- All text in Haitian Creole
- Mobile-optimized design

### Admin Dashboard Features
- Password-protected access
- Total leads counter
- Device breakdown (Mobile vs Desktop %)
- Top cities ranking
- Complete leads table with:
  - Name, WhatsApp, Email, City
  - Device type, IP address
  - Registration timestamp
- Real-time statistics
- Export-ready data

### API Features
- Automatic device detection (Mobile/Desktop/Tablet)
- IP address tracking
- Referrer source tracking
- User-agent logging
- Form validation
- Error handling in Haitian Creole

## 🚀 Deploy to Production

When you're ready to go live:

1. Push your code to GitHub
2. Go to https://vercel.com and sign in
3. Click "New Project" and import your GitHub repo
4. Add your environment variables:
   - `POSTGRES_URL`
   - `POSTGRES_URL_NON_POOLING`
   - `ADMIN_PASSWORD`
5. Click "Deploy"
6. Done! You're live! 🎉

**Tip:** Check `DEPLOYMENT_GUIDE.md` for detailed deployment instructions.

## 📊 How to Use

### Capturing Leads
1. Share your landing page URL
2. Users fill out the form
3. They see success modal and are directed to WhatsApp
4. You see their info in the admin dashboard instantly

### Viewing Leads
1. Go to `/admin`
2. Login with your password
3. See all leads with full details
4. Export data as needed

### Analyzing Data
1. Open `USEFUL_QUERIES.sql`
2. Find the query you need
3. Run it in the Neon SQL Editor
4. Get insights (top cities, device types, growth rate, etc.)

## 🎯 What's Already Configured

You don't need to do anything else for these:

- ✅ Form fields have correct `name` attributes
- ✅ API integration is complete
- ✅ Success modal triggers automatically
- ✅ All CTA buttons scroll to form
- ✅ Device detection is automatic
- ✅ IP tracking is automatic
- ✅ Database schema is complete
- ✅ Admin authentication works
- ✅ Mobile responsive design
- ✅ Error handling in Haitian Creole

## ⚠️ Before Going Live

Make sure to:

1. ✅ Change the admin password to something secure
2. ✅ Update the WhatsApp link (search for `https://tyn.bio/Class8Janvye`)
3. ✅ Test form submission
4. ✅ Test admin dashboard
5. ✅ Test on mobile device
6. ✅ Run `npm run build` to check for errors

Use `CHECKLIST.md` for a complete pre-launch checklist.

## 🆘 Need Help?

### Common Issues

**"Can't connect to database"**
→ Check `ENV_SETUP.md` - Make sure your `.env.local` has the correct database URLs

**"Form not submitting"**
→ Check browser console for errors. Make sure the dev server is running.

**"Admin login not working"**
→ Verify your `ADMIN_PASSWORD` in `.env.local`. Clear browser localStorage and try again.

**"Images not loading"**
→ Make sure the `images` folder is in `public/images/`

### Where to Find Answers

| Question | File to Check |
|----------|--------------|
| How do I set up the database? | `QUICK_START.md` |
| How do I deploy to Vercel? | `DEPLOYMENT_GUIDE.md` |
| What environment variables do I need? | `ENV_SETUP.md` |
| How do I analyze lead data? | `USEFUL_QUERIES.sql` |
| What files do what? | `INDEX.md` |
| Complete feature list? | `README.md` |
| Pre-launch checklist? | `CHECKLIST.md` |

## 🎓 Tech Stack

- **Frontend:** HTML, CSS, JavaScript (landing page) + React/Next.js (admin)
- **Backend:** Next.js API Routes (TypeScript)
- **Database:** PostgreSQL (Neon)
- **Hosting:** Vercel
- **Styling:** Tailwind CSS + Custom CSS
- **Language:** TypeScript

## 📞 Quick Reference

### Local URLs
- Landing: http://localhost:3000
- Admin: http://localhost:3000/admin
- API: http://localhost:3000/api/leads

### Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
vercel --prod    # Deploy to Vercel
```

### Files You Need to Edit
1. `.env.local` - Add your database URLs and admin password
2. `public/landing.html` - Change WhatsApp link (search for `tyn.bio`)
3. That's it! Everything else works out of the box.

## 🎉 You're Ready!

Everything is set up and ready to go. Just:

1. Create `.env.local` with your database credentials
2. Run `npm run dev`
3. Test everything
4. Deploy to Vercel
5. Start capturing leads! 📸✨

---

**Need more details?** Open `QUICK_START.md` next.

**Ready to deploy?** Follow `CHECKLIST.md`.

**Want to understand everything?** Read `INDEX.md`.

Good luck with your photography school! 🎓📷

