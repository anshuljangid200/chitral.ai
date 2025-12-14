# Setting up environment variables for Vercel deployment

This project requires a MongoDB connection string and a JWT secret for the backend. Without them, API requests (signup/login) will fail with 500 errors.

## Required environment variables

Set these in your Vercel Project > Settings > Environment Variables:

- `MONGO_URI` — Your MongoDB connection string.
  Example: `mongodb+srv://user:password@cluster0.mongodb.net/mydb?retryWrites=true&w=majority`
- `JWT_SECRET` — A strong random secret used to sign JWT tokens.
  Example: `s0m3R@nd0m$3cr3t`
- `FRONTEND_URL` (optional) — Your frontend URL, used for CORS.
  Example: `https://chitral-ai-test.vercel.app`

## How to add environment variables via Vercel Dashboard

1. Open your project in the Vercel dashboard.
2. Go to **Settings** → **Environment Variables**.
3. Click **Add** and enter `MONGO_URI`, paste the connection string, choose **Environment** (Production/Preview/Development), and save.
4. Repeat for `JWT_SECRET` and `FRONTEND_URL`.
5. Trigger a new deployment (push or click **Redeploy**) after adding values.

## How to add via Vercel CLI

```bash
# Install Vercel CLI if you don't have it
npm i -g vercel

# In your project root
vercel login
vercel env add MONGO_URI production
vercel env add JWT_SECRET production
vercel env add FRONTEND_URL production
```

When prompted, paste the value for each environment variable.

## Troubleshooting

- If signup/login returns `Database connection failed` or `MONGO_URI` errors, verify your MongoDB Atlas:
  - Username and password are correct
  - Database name is correct
  - IP access is configured (allow `0.0.0.0/0` for testing, or add Vercel's IP ranges for production)
- Check Vercel Deployment logs for exact error text and share them if problems continue.

## Security

Do NOT commit real secrets to the repository. Use `backend/.env.example` as a template only.
