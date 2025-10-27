# API Setup Guide

This guide will walk you through setting up free API keys for Veterano. **All APIs listed here have generous free tiers** and are production-ready.

## 🚀 Quick Start (5 minutes)

The platform works out of the box with:
1. **RemoteOK** for job listings (no auth required)
2. **Mock data** for resume analysis

But for the best experience, we recommend setting up Groq (takes 2 minutes):

---

## 1. Resume Analysis: Groq API (RECOMMENDED) ⚡

**Why Groq?** Ultra-fast (fastest AI inference in the market), free tier is very generous, and high-quality results.

### Setup Steps:

1. **Visit:** https://console.groq.com
2. **Sign up/Login** (free account, no credit card required)
3. **Create API Key:**
   - Click "API Keys" in the left sidebar
   - Click "Create API Key"
   - Give it a name (e.g., "Veterano")
   - Copy the API key

4. **Add to `.env.local`:**
   ```bash
   GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

**Limits:** 14,400 requests/day, 30 requests/minute
**Cost:** FREE forever
**Quality:** Uses Llama 3.1 70B (comparable to GPT-4)

---

## 2. Resume Analysis: OpenAI API (Optional Fallback)

Only needed if you prefer OpenAI or as a backup to Groq.

### Setup Steps:

1. **Visit:** https://platform.openai.com/signup
2. **Sign up** for an account
3. **Add credits** ($5 minimum) - Note: This is paid after free trial
4. **Create API Key:**
   - Go to https://platform.openai.com/api-keys
   - Click "Create new secret key"
   - Copy the key

5. **Add to `.env.local`:**
   ```bash
   OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

**Limits:** Pay-as-you-go after free trial ($5 credit)
**Cost:** $0.15 per 1M input tokens (gpt-4o-mini)
**Quality:** Excellent

---

## 3. Job Listings: Adzuna API (RECOMMENDED)

**Why Adzuna?** Official job search API, good data quality, supports location and salary filtering, veteran-specific searches possible.

### Setup Steps:

1. **Visit:** https://developer.adzuna.com/signup
2. **Create Account** (free, no credit card required)
3. **Get Credentials:**
   - After signup, you'll see your App ID and API Key
   - Or go to "Your Applications" to view them

4. **Add to `.env.local`:**
   ```bash
   ADZUNA_APP_ID=your_app_id_here
   ADZUNA_APP_KEY=your_api_key_here
   ```

**Limits:** 5,000 calls/month (free tier)
**Cost:** FREE tier available, paid plans for higher limits
**Coverage:** USA, UK, and 16+ countries

---

## 4. Job Listings: RemoteOK (Automatic Fallback)

**No setup required!** RemoteOK API is free and works without authentication.

- The platform automatically uses RemoteOK if Adzuna is not configured
- Focus on remote jobs
- Good for international opportunities
- No rate limits (just be respectful)

---

## 5. Database: Supabase (Optional - For Future Features)

Currently not required for MVP, but needed for:
- User accounts
- Saving jobs
- Application tracking
- Resume storage

### Setup Steps (when needed):

1. **Visit:** https://supabase.com/dashboard
2. **Create Account** (free, no credit card required)
3. **Create New Project:**
   - Choose a project name
   - Set database password
   - Select a region
4. **Get Credentials:**
   - Go to Project Settings > API
   - Copy "Project URL" and "anon public" key

5. **Add to `.env.local`:**
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

**Limits:** 500MB database, 2GB bandwidth/month
**Cost:** FREE tier available

---

## Configuration Priority

The application tries APIs in this order:

### For Resume Analysis:
1. **Groq** (if configured) - Fast & free ⚡
2. **OpenAI** (if configured) - High quality but paid
3. **Mock Data** (always works) - Demo purposes

### For Job Listings:
1. **Adzuna** (if configured) - Best for production 🎯
2. **RemoteOK** (no config needed) - Always available
3. **Mock Data** (if all fail) - Fallback

---

## Environment Variables Template

Create a `.env.local` file in the root directory:

```bash
# Copy from .env.example
cp .env.example .env.local

# Then edit .env.local with your API keys
```

Example `.env.local`:

```bash
# AI Resume Analysis (Choose one or both)
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
# OPENAI_API_KEY=sk_xxxxxxxxxxxxxxxxxxx  # Optional

# Job Listings (Optional - falls back to RemoteOK)
ADZUNA_APP_ID=your_app_id
ADZUNA_APP_KEY=your_api_key

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Testing Your Setup

After adding API keys, restart your development server:

```bash
npm run dev
```

### Test Resume Analysis:
1. Go to http://localhost:3000/resume
2. Upload a text file with resume content
3. Click "Analyze Resume"
4. Check the console logs to see which provider was used:
   - ✅ "Using Groq API for resume analysis" - Working!
   - ✅ "Using OpenAI API for resume analysis" - Working!
   - ⚠️ "No AI API available, using mock analysis" - Add an API key

### Test Job Listings:
1. Go to http://localhost:3000/jobs
2. Search for jobs
3. Check the browser console or network tab to see the data source:
   - Look for `metadata.source` in the API response
   - ✅ "adzuna" - Using Adzuna API
   - ✅ "remoteok" - Using RemoteOK API
   - ⚠️ "mock" - No real API working

---

## Cost Breakdown (Monthly Estimate)

### Minimal Setup (FREE):
- **Groq API:** FREE (14,400 requests/day)
- **RemoteOK:** FREE (automatic)
- **Total: $0/month** 💰

### Recommended Setup (FREE):
- **Groq API:** FREE
- **Adzuna API:** FREE (5,000 calls/month)
- **Total: $0/month** 💰

### With OpenAI (Paid):
- **OpenAI gpt-4o-mini:** ~$0.50/month for typical usage
- **Groq as fallback:** FREE
- **Adzuna:** FREE
- **Total: ~$0.50/month** 💰

---

## Troubleshooting

### Issue: "Failed to analyze resume"
**Solution:**
- Check if GROQ_API_KEY is correct in `.env.local`
- Restart development server after adding keys
- Check console logs for specific error messages

### Issue: "No jobs found"
**Solution:**
- Jobs should always show (RemoteOK works without config)
- Try different search terms
- Check network tab in browser dev tools

### Issue: API rate limits
**Solution:**
- Groq: 14,400/day is very high, unlikely to hit
- Adzuna: 5,000/month, switches to RemoteOK if exceeded
- All APIs have automatic fallbacks

---

## Production Deployment

When deploying to Vercel/Netlify/etc:

1. **Add Environment Variables** in the platform's dashboard
2. **Never commit** `.env.local` to Git (it's in `.gitignore`)
3. **Use separate API keys** for production and development
4. **Monitor usage** through API dashboards

### Vercel Deployment:
```bash
vercel --prod
```

Then add environment variables in:
Vercel Dashboard → Your Project → Settings → Environment Variables

---

## Need Help?

- **Groq Docs:** https://console.groq.com/docs
- **Adzuna Docs:** https://developer.adzuna.com/docs
- **RemoteOK API:** https://remoteok.com/api
- **Supabase Docs:** https://supabase.com/docs

---

**Recommended Quick Setup (2 minutes):**

1. Get Groq API key (https://console.groq.com)
2. Add to `.env.local`
3. Restart server
4. Done! Platform is production-ready with free APIs 🎉
