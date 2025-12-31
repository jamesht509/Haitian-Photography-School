# ✅ Deployment Checklist

Use this checklist to ensure everything is ready before going live!

## 📋 Pre-Setup (Before You Start)

- [ ] Node.js 18+ is installed
- [ ] You have a GitHub account (optional, for Vercel deployment)
- [ ] You have npm installed

## 🗄️ Database Setup

- [ ] Created Neon account at https://neon.tech
- [ ] Created a new Neon project
- [ ] Copied the connection string (POSTGRES_URL)
- [ ] Copied the non-pooling connection string (POSTGRES_URL_NON_POOLING)
- [ ] Opened Neon SQL Editor
- [ ] Ran the entire `schema.sql` file
- [ ] Verified the `leads` table was created
- [ ] Tested a simple query: `SELECT COUNT(*) FROM leads;`

## ⚙️ Local Environment Setup

- [ ] Navigated to `my-app` folder: `cd my-app`
- [ ] Installed dependencies: `npm install`
- [ ] Created `.env.local` file (use `ENV_TEMPLATE.txt` as reference)
- [ ] Added `POSTGRES_URL` to `.env.local`
- [ ] Added `POSTGRES_URL_NON_POOLING` to `.env.local`
- [ ] Changed `ADMIN_PASSWORD` to a secure password
- [ ] Verified `.env.local` is in `.gitignore`

## 🧪 Local Testing

### Test Development Server
- [ ] Started dev server: `npm run dev`
- [ ] Server is running on http://localhost:3000
- [ ] No error messages in terminal

### Test Landing Page
- [ ] Opened http://localhost:3000
- [ ] Landing page loads correctly
- [ ] All images are visible
- [ ] Page is responsive (tested on mobile view)
- [ ] All sections are visible (Hero, Pricing, Mastery, etc.)
- [ ] Book preview works (can navigate between pages)

### Test Form Submission
- [ ] Scrolled to registration form
- [ ] Filled in all fields:
  - [ ] Name
  - [ ] WhatsApp
  - [ ] Email
  - [ ] City
- [ ] Clicked submit button
- [ ] Button showed "Ap voye..." (loading state)
- [ ] Success modal appeared
- [ ] Progress bar is at 90%
- [ ] WhatsApp button is visible and clickable
- [ ] No errors in browser console
- [ ] Form was reset after submission

### Test Admin Dashboard
- [ ] Opened http://localhost:3000/admin
- [ ] Login screen appeared
- [ ] Entered admin password from `.env.local`
- [ ] Successfully logged in
- [ ] Dashboard loaded with statistics
- [ ] Test lead is visible in the table
- [ ] Device type is correctly detected
- [ ] City is shown correctly
- [ ] IP address is captured
- [ ] Created timestamp is correct

### Test CTA Buttons
- [ ] Clicked hero section CTA button
- [ ] Page scrolled to form
- [ ] First input field was focused
- [ ] Tested other CTA buttons (in Pricing, Mastery sections)
- [ ] All CTAs scroll to the form

## 🎨 Customization

- [ ] Updated WhatsApp link (search for `https://tyn.bio/Class8Janvye`)
- [ ] Verified all text is in Haitian Creole
- [ ] Checked that date is correct: "Samdi 10 Janvye"
- [ ] Verified location: "Boston, MA"
- [ ] Confirmed class price: "$497"
- [ ] All placeholder images replaced (if needed)

## 🔐 Security Check

- [ ] Changed ADMIN_PASSWORD from default
- [ ] Password is strong (12+ characters, mix of letters/numbers/symbols)
- [ ] `.env.local` is not committed to git
- [ ] No sensitive data in public files
- [ ] Database credentials are secure

## 🚀 Production Build Test

- [ ] Ran production build: `npm run build`
- [ ] Build completed without errors
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Started production server: `npm start`
- [ ] Tested landing page
- [ ] Tested form submission
- [ ] Tested admin dashboard

## ☁️ Vercel Deployment

### GitHub Setup (if using)
- [ ] Created GitHub repository
- [ ] Pushed code to GitHub
- [ ] Repository is private (if desired)

### Vercel Project Setup
- [ ] Logged into Vercel dashboard
- [ ] Clicked "Add New Project"
- [ ] Imported GitHub repository (or deployed manually)
- [ ] Selected "Next.js" as framework preset

### Vercel Environment Variables
- [ ] Added `POSTGRES_URL` in Vercel settings
- [ ] Added `POSTGRES_URL_NON_POOLING` in Vercel settings
- [ ] Added `ADMIN_PASSWORD` in Vercel settings
- [ ] Verified all variables are set for "Production" environment
- [ ] (Optional) Set different passwords for Preview/Development

### Vercel Deployment
- [ ] Clicked "Deploy"
- [ ] Deployment completed successfully
- [ ] No build errors
- [ ] Got production URL (e.g., `your-project.vercel.app`)

## 🧪 Production Testing

### Test Production Landing Page
- [ ] Visited production URL
- [ ] Landing page loads correctly
- [ ] All images load
- [ ] Page is responsive on mobile
- [ ] No 404 errors in console
- [ ] Book preview works

### Test Production Form
- [ ] Filled out form with real test data
- [ ] Submitted form
- [ ] Success modal appeared
- [ ] WhatsApp link works
- [ ] No errors in console

### Test Production Admin
- [ ] Visited `your-domain.com/admin`
- [ ] Login screen appeared
- [ ] Logged in with production password
- [ ] Test lead from production is visible
- [ ] Statistics are correct
- [ ] Device tracking works
- [ ] IP address is captured correctly

## 📱 Mobile Testing

- [ ] Tested on actual mobile device (not just browser DevTools)
- [ ] Landing page is readable
- [ ] Form is easy to fill out
- [ ] Buttons are easy to tap
- [ ] Success modal displays correctly
- [ ] WhatsApp link opens WhatsApp app

## 🔗 Integration Testing

### WhatsApp Group
- [ ] WhatsApp group link is correct
- [ ] Link opens WhatsApp (on mobile)
- [ ] Link opens WhatsApp Web (on desktop)
- [ ] Group is set to allow new members

### Analytics (Optional)
- [ ] Google Analytics installed (if using)
- [ ] Facebook Pixel installed (if using)
- [ ] Events are tracking correctly

## 📊 Data Verification

- [ ] Ran test query in Neon: `SELECT * FROM leads ORDER BY created_at DESC LIMIT 10;`
- [ ] All test leads are present
- [ ] Device types are correct
- [ ] IP addresses are captured
- [ ] Referrers are tracked
- [ ] Timestamps are correct

## 🎉 Final Checks

- [ ] Shared production URL with team
- [ ] Admin credentials shared securely (password manager)
- [ ] Database backup configured (Neon has auto-backups)
- [ ] Monitoring set up (Vercel has built-in monitoring)
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate is active (Vercel provides this automatically)

## 📝 Documentation

- [ ] Team knows how to access admin dashboard
- [ ] Team knows the admin password
- [ ] Team knows how to export leads
- [ ] Useful queries shared (`USEFUL_QUERIES.sql`)
- [ ] Contact information updated

## 🎊 You're Live!

Congratulations! Your lead capture system is now live and ready to capture leads for the Haitian Photography School! 📸✨

### Next Steps:
1. Monitor the admin dashboard regularly
2. Respond to leads quickly via WhatsApp
3. Export lead data for marketing campaigns
4. Use the SQL queries to analyze your audience
5. Keep your database and admin password secure

### Need Help?
- Check `INDEX.md` for file reference
- Check `README.md` for complete documentation
- Check `DEPLOYMENT_GUIDE.md` for troubleshooting
- Review `USEFUL_QUERIES.sql` for data analysis

---

**Last Deployed:** ___________  
**Production URL:** ___________  
**Admin URL:** ___________  
**Admin Password:** _________ (keep secure!)

