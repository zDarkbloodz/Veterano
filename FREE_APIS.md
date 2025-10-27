# Free API Options for Veterano

## AI Models for Resume Analysis

### Option 1: Groq (RECOMMENDED)
- **Cost**: Free tier with generous limits
- **Speed**: Ultra-fast inference (fastest in the market)
- **Models**: Llama 3.1 70B, Mixtral 8x7B
- **Limits**: 14,400 requests/day, 30 req/min
- **Setup**: Simple API key from https://console.groq.com
- **Pros**: Fast, reliable, good quality, high limits
- **Cons**: None significant

### Option 2: Google Gemini
- **Cost**: Free tier
- **Speed**: Fast
- **Models**: Gemini 1.5 Flash
- **Limits**: 1500 requests/day, 15 req/min
- **Setup**: API key from Google AI Studio
- **Pros**: Good quality, reliable
- **Cons**: Lower daily limits than Groq

### Option 3: Hugging Face Inference API
- **Cost**: Free for community models
- **Speed**: Slower (cold starts)
- **Models**: Various open source models
- **Limits**: Rate limited by model
- **Pros**: Many model options
- **Cons**: Can be slow, inconsistent

## Job APIs

### Option 1: Adzuna (RECOMMENDED)
- **Cost**: Free tier available
- **Coverage**: USA, UK, and 16+ countries
- **Features**: Search, filters, salary data
- **Limits**: 5000 calls/month free tier
- **Setup**: Register at https://developer.adzuna.com
- **Pros**: Official API, good data quality, veteran filters possible
- **Cons**: Requires registration

### Option 2: RemoteOK
- **Cost**: Completely free
- **Coverage**: Remote jobs worldwide
- **Features**: JSON API, no auth needed
- **Limits**: Rate limited but generous
- **Setup**: None, just use the endpoint
- **Pros**: No auth required, simple
- **Cons**: Remote jobs only, no veteran-specific tags

### Option 3: Arbeitnow
- **Cost**: Free
- **Coverage**: Europe + Remote
- **Features**: Simple REST API
- **Limits**: Reasonable rate limits
- **Setup**: None required
- **Pros**: Free, no auth
- **Cons**: Limited to European jobs

### Option 4: JSearch (RapidAPI)
- **Cost**: Free tier (2500 requests/month)
- **Coverage**: Aggregates from multiple sources
- **Features**: Advanced search, filters
- **Setup**: RapidAPI account
- **Pros**: Good coverage, multiple sources
- **Cons**: Requires RapidAPI account

## Recommended Stack

**For Production:**
- **AI**: Groq (llama-3.1-70b-versatile) - Fast, free, high quality
- **Jobs**: Adzuna API - Official, reliable, veteran-friendly search possible
- **Database**: Supabase (free tier: 500MB storage, 2GB bandwidth)

**For Quick Start/Testing:**
- **AI**: Groq (same as production, it's that good)
- **Jobs**: RemoteOK (no setup required, instant start)
- **Database**: Supabase (same as production)
