# 🚀 Vercel Deployment Checklist

## ✅ Pre-Deployment Checks

### 1. Environment Variables Required
Add these in Vercel Dashboard → Settings → Environment Variables:

#### **Required:**
- `MONGODB_URI` - Your MongoDB Atlas connection string
  - Format: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`

#### **Required for Admin:**
- `ADMIN_PASSWORD` - Admin login password
- `ADMIN_EMAIL` - Admin login email (optional but recommended)

#### **Optional:**
- `ADMIN_TOKEN` - Admin session token (defaults to 'admin-session-token')
- `MONGODB_DB` - Database name (if not in URI)

### 2. Build Configuration ✅
- ✅ Next.js 15.5.5 configured
- ✅ Build script: `next build --turbopack`
- ✅ TypeScript configured
- ✅ Image optimization configured for external URLs

### 3. Code Status ✅
- ✅ No linting errors
- ✅ All API routes implemented
- ✅ Database models defined
- ✅ Admin authentication working
- ✅ All pages dynamic (fetching from DB)

### 4. Features Implemented ✅
- ✅ **Blog System**: Admin CRUD + Public pages
- ✅ **Store System**: Admin CRUD + Public pages
- ✅ **Portfolio**: Admin CRUD + Public pages
- ✅ **Services**: Admin CRUD + Dynamic homepage
- ✅ **Testimonials**: Admin CRUD + Dynamic homepage
- ✅ **Features**: Admin CRUD + Dynamic homepage
- ✅ **Partners**: Admin CRUD + Dynamic homepage
- ✅ **Homepage Content**: Admin management UI
- ✅ **Contact Form**: Working with email

## 📋 Deployment Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

### Step 3: Configure Environment Variables
In Vercel Dashboard → Project Settings → Environment Variables, add:

```
MONGODB_URI=mongodb+srv://...
ADMIN_PASSWORD=your-secure-password
ADMIN_EMAIL=your-admin@email.com
ADMIN_TOKEN=your-secret-token (optional)
```

### Step 4: Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Test your deployment

## 🔍 Post-Deployment Testing

### Test These Pages:
- [ ] Homepage loads correctly
- [ ] `/blog` - Blog listing works
- [ ] `/blog/[slug]` - Blog post details work
- [ ] `/store` - Store listing works
- [ ] `/store/[id]` - Product details work
- [ ] `/portfolio` - Portfolio works
- [ ] `/contact` - Contact form works

### Test Admin Panel:
- [ ] `/admin/login` - Login works
- [ ] `/admin/dashboard` - Dashboard loads
- [ ] `/admin/services` - Can create/edit services
- [ ] `/admin/blog` - Can create/edit blog posts
- [ ] `/admin/store` - Can create/edit products
- [ ] `/admin/portfolio` - Can create/edit portfolio items
- [ ] `/admin/content` - Can edit homepage content

## 🛠️ Common Issues & Solutions

### Issue: Build Fails
**Solution**: Check Node.js version in Vercel settings (should be 18.x or 20.x)

### Issue: MongoDB Connection Fails
**Solution**: 
1. Check `MONGODB_URI` is set correctly
2. Ensure MongoDB Atlas IP whitelist allows all IPs (0.0.0.0/0) or Vercel's IPs
3. Check database user has correct permissions

### Issue: Images Not Loading
**Solution**: Images must be valid HTTPS URLs. Check `next.config.ts` has remote patterns configured (already done)

### Issue: Admin Login Not Working
**Solution**: 
1. Verify `ADMIN_PASSWORD` and `ADMIN_EMAIL` are set
2. Check browser console for errors
3. Clear cookies and try again

## 📝 Notes

- All content is stored in MongoDB
- Admin panel is protected by middleware
- Images require valid HTTPS URLs
- Build uses Turbopack for faster builds
- Static pages are pre-rendered, dynamic pages use SSR

## 🔐 Security Notes

- Never commit `.env.local` to git (already in .gitignore ✅)
- Use strong `ADMIN_PASSWORD`
- Consider using `ADMIN_TOKEN` for extra security
- MongoDB Atlas connection string contains credentials - keep secret
- Regular backups recommended for MongoDB data

---

**Ready to deploy!** 🚀

