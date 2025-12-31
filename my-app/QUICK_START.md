# 🚀 Quick Start Guide

Get your lead capture system running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- A Neon account (free): https://neon.tech

## Step 1: Database Setup (2 minutes)

1. **Create Neon Database:**
   - Go to https://console.neon.tech
   - Click "Create Project"
   - Copy your connection string

2. **Run the SQL Schema:**
   - Open the Neon SQL Editor
   - Copy/paste the contents of `schema.sql`
   - Click "Run"

## Step 2: Environment Setup (1 minute)

Create `.env.local` in the `my-app` folder:

```env
POSTGRES_URL="postgres://user:pass@host/db"
POSTGRES_URL_NON_POOLING="postgres://user:pass@host/db"
ADMIN_PASSWORD="changeme123"
```

Replace with your actual Neon connection strings!

## Step 3: Install & Run (2 minutes)

```bash
# Navigate to the app folder
cd my-app

# Install dependencies (already done if you followed along)
npm install

# Start the development server
npm run dev
```

## Step 4: Test Everything

### Test the Landing Page:
1. Open http://localhost:3000
2. You should see the photography class landing page
3. Fill out the registration form
4. Click "Enskri Gratis Kounye a"
5. You should see the success modal with 90% progress

### Test the Admin Dashboard:
1. Open http://localhost:3000/admin
2. Enter your admin password (from `.env.local`)
3. You should see your submitted lead!

## 🎉 Success!

You now have:
- ✅ A beautiful landing page
- ✅ Lead capture working
- ✅ Device & IP tracking
- ✅ Admin dashboard with stats
- ✅ Success modal with WhatsApp CTA

## Next Steps

### Deploy to Production:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

During deployment, add these environment variables:
- `POSTGRES_URL`
- `POSTGRES_URL_NON_POOLING`
- `ADMIN_PASSWORD`

### Customize:

- **Change WhatsApp Link:** Search for `https://tyn.bio/Class8Janvye` in `public/landing.html`
- **Update Admin Password:** Change `ADMIN_PASSWORD` in `.env.local`
- **Modify Colors:** Edit CSS variables in `public/landing.html`

## 🐛 Troubleshooting

**"Database connection error"**
- Double-check your `POSTGRES_URL` in `.env.local`
- Make sure you ran the `schema.sql` in Neon

**"Form not submitting"**
- Check browser console for errors
- Make sure the dev server is running
- Verify all form fields have `name` attributes

**"Admin login not working"**
- Verify `ADMIN_PASSWORD` is set in `.env.local`
- Try clearing browser localStorage
- Restart the dev server

## 📞 Need Help?

Check these files:
- `README.md` - Complete documentation
- `DEPLOYMENT_GUIDE.md` - Detailed deployment steps
- `ENV_SETUP.md` - Environment variables explained
- `INTEGRATION_STEPS.md` - Integration options

## 🔥 Pro Tips

1. **Test on Mobile:** Open http://localhost:3000 on your phone (same wifi network)
2. **Monitor Leads:** Keep the admin dashboard open while testing
3. **Check Device Detection:** Submit from mobile and desktop to see tracking
4. **Export Data:** Use the admin dashboard to copy lead data

## ✅ Deployment Checklist

Before going live:

- [ ] Database schema created in Neon
- [ ] Environment variables set in Vercel
- [ ] Admin password is secure (not "changeme123"!)
- [ ] WhatsApp link is correct
- [ ] Tested form submission
- [ ] Tested admin dashboard
- [ ] Tested on mobile device
- [ ] All images loading correctly

Happy lead capturing! 📸✨

