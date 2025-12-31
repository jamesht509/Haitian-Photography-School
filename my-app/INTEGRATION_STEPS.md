# Integration Steps

## How to Integrate the Landing Page with Next.js API

You have two options for integrating the landing page with the lead capture API:

## Option 1: Serve HTML as Static File (Recommended for Quick Setup)

This approach keeps your existing `index.html` and adds API integration.

### Steps:

1. **Copy the landing page to Next.js public folder:**

```bash
cp ../index.html public/landing.html
```

2. **Copy the images folder:**

```bash
cp -r ../images public/images
```

3. **Access the page:**
   - Landing page: `http://localhost:3000/landing.html`
   - Admin dashboard: `http://localhost:3000/admin`

4. **Make it the homepage** (optional):
   
   Update `app/page.tsx`:

```typescript
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/landing.html');
}
```

### Pros:
- ✅ Quick setup
- ✅ No need to convert HTML to React
- ✅ Preserves all existing styles and scripts
- ✅ API integration works out of the box

### Cons:
- ❌ Not a true Next.js page (no SSR benefits)
- ❌ SEO might be slightly less optimal

## Option 2: Convert to Next.js Page (Recommended for Production)

This approach converts the HTML to a proper Next.js/React component.

### Steps:

1. **Convert HTML to JSX in `app/page.tsx`**
   - Copy all HTML from `<body>` tag
   - Replace `class=` with `className=`
   - Replace inline styles with React style objects
   - Move `<script>` tags to `useEffect` hooks
   - Move CSS to CSS modules or styled-jsx

2. **Create client component:**

```typescript
'use client';

import { useEffect } from 'react';

export default function LandingPage() {
  useEffect(() => {
    // Your JavaScript code here
  }, []);

  return (
    <div>
      {/* Your HTML here */}
    </div>
  );
}
```

3. **Move images to `public/images/`:**

```bash
cp -r ../images public/images
```

### Pros:
- ✅ Full Next.js benefits (SSR, ISR, etc.)
- ✅ Better SEO
- ✅ Code splitting
- ✅ Image optimization with next/image

### Cons:
- ❌ More work to convert
- ❌ Need to test all interactions

## Current Setup

The current `index.html` already has:
- ✅ Form fields with proper `name` attributes
- ✅ Async form submission to `/api/leads`
- ✅ Success modal trigger
- ✅ CTA buttons that scroll to form
- ✅ Error handling in Haitian Creole

## Testing the Integration

1. **Start the dev server:**

```bash
npm run dev
```

2. **Test the form:**
   - Fill out the registration form
   - Submit
   - Check if success modal appears
   - Verify in admin dashboard

3. **Test admin dashboard:**
   - Go to `/admin`
   - Login with your `ADMIN_PASSWORD`
   - Verify leads appear in the table
   - Check statistics

## Deployment Checklist

Before deploying to production:

- [ ] Database schema is created in Neon
- [ ] Environment variables are set in Vercel
- [ ] Admin password is secure
- [ ] Form submission works
- [ ] Success modal appears
- [ ] Admin dashboard loads
- [ ] All CTA buttons scroll to form
- [ ] WhatsApp link is correct
- [ ] Mobile responsive design works
- [ ] Images load correctly
- [ ] Analytics tracking is setup (if applicable)

## Quick Deploy Commands

```bash
# Install dependencies
npm install

# Test locally
npm run dev

# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

## Need Help?

Check these files:
- `README.md` - Complete feature list and API docs
- `DEPLOYMENT_GUIDE.md` - Detailed deployment instructions
- `ENV_SETUP.md` - Environment variables setup
- `schema.sql` - Database schema

