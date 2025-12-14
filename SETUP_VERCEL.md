# Setting up environment variables for Vercel deployment

This project requires a MongoDB connection string and a JWT secret for the backend. Without them, API requests (signup/login) will fail with 500 errors.

Required environment variables (set in Vercel Project > Settings > Environment Variables):

- `MONGO_URI` — Your MongoDB connection string.
  Example: `mongodb+srv://user:password@cluster0.mongodb.net/mydb?retryWrites=true&w=majority`
- `JWT_SECRET` — A strong random secret used to sign JWT tokens.
  Example: `s0m3R@nd0m$3cr3t`
- `FRONTEND_URL` (optional) — Your frontend URL, used for CORS.
  Example: `https://chitral-ai-test.vercel.app`

How to add them via the Vercel Dashboard:
1. Open your project in the Vercel dashboard.
2. Go to **Settings** → **Environment Variables**.
3. Click **Add** and enter `MONGO_URI`, paste the connection string, choose **Environment** (Production/Preview/Development), and save.
4. Repeat for `JWT_SECRET` and `FRONTEND_URL`.
5. Trigger a new deployment (push or click **Redeploy**) after adding values.

How to add them via Vercel CLI (locally):

```bash
# Install Vercel CLI if you don't have it
npm i -g vercel

# In your project root
vercel login
vercel env add MONGO_URI production
vercel env add JWT_SECRET production
vercel env add FRONTEND_URL production
```

When adding with `vercel env add`, you'll be prompted to paste the value.

Troubleshooting:
- If signup/login returns `Database connection failed` or `MONGO_URI` errors, verify your `MONGO_URI` has the correct username/password and that your MongoDB atlas IP access allows connections (or add 0.0.0.0/0 for development).
- Check Vercel Deployment logs for the exact error text and share them if problems continue.

Security note:
- Do NOT commit real secrets to the repository. Use `backend/.env.example` as a template only.
