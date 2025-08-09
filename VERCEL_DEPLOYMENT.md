# Vercel Deployment Guide

## Step-by-Step Instructions

### 1. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"
4. Import your GitHub repository: `https://github.com/shoaib1292/clickable`
5. Click "Deploy"

### 2. Setup Postgres Database
1. After deployment, go to your project dashboard
2. Click on the "Storage" tab
3. Click "Create Database"
4. Select "Postgres"
5. Choose a database name (e.g., `clickable-db`)
6. Click "Create"

### 3. Environment Variables (Automatic)
- Vercel will automatically set the `DATABASE_URL` environment variable
- No manual configuration needed!

### 4. Redeploy
1. Go to "Deployments" tab
2. Click "Redeploy" on the latest deployment
3. Your app will rebuild with the database connection

### 5. Verify
- Your app should now work with card generation!
- The database schema will be automatically created during build

## Troubleshooting

If card generation still fails:
1. Check the "Functions" tab for error logs
2. Ensure the database was created successfully
3. Try redeploying once more

## Database Schema
The app uses these tables:
- `Card`: Stores generated card information
- Schema is automatically created via Prisma

---

**Note**: The build process includes `prisma db push` which will create the database schema automatically.