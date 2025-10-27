# 🎖️ VETERANO - Career Platform for Military Veterans

A bilingual (English/Spanish) career platform helping military veterans transition to tech careers. Built with Next.js 14+, featuring AI-powered resume analysis, job listings, and military-to-civilian skill translation.

![Next.js](https://img.shields.io/badge/Next.js-15.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![License](https://img.shields.io/badge/license-MIT-green)

## 🌟 Features

### ✅ Currently Implemented (MVP)

- **🏠 Landing Page**: Professional hero section with stats and feature showcase
- **💼 Job Listings**: Search and filter tech jobs with veteran-friendly tags
- **🤖 AI Resume Analyzer**: Upload resumes and get instant AI-powered feedback
- **🎖️ Military-to-Civilian Translation**: Automatically translate military experience to civilian job terms
- **🌎 Bilingual Support**: Toggle between English and Spanish (UI ready)
- **📱 Responsive Design**: Mobile-first design that works on all devices
- **🎨 Professional UI**: Military-inspired color scheme with modern tech aesthetics

### 🚧 Coming Soon

- **🏢 Company Profiles**: Veteran-friendly company directory
- **📚 Resources**: Learning materials and career guides
- **👤 User Authentication**: Save jobs and track applications
- **💾 Database Integration**: Supabase for data persistence
- **🔍 Advanced Search**: Filter by security clearance, salary, location, etc.

## 🎨 Design System

### Color Palette

```css
Military Green: #4A5F4D    /* Primary - military heritage */
Tech Blue:      #2C5F8D    /* Secondary - tech forward */
Gold Accent:    #D4AF37    /* Accent - achievement, honor */
Navy Dark:      #0A1628    /* Dark background */
Slate BG:       #1E293B    /* Card backgrounds */
```

### Typography

- **Headings**: Inter (Bold, 600-700)
- **Body**: Inter (Regular, 400-500)
- **Code**: Fira Code (Monospace)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Optional API Keys (All FREE tier available)

The platform works immediately with:
- ✅ **RemoteOK** for job listings (no auth required)
- ✅ **Mock data** for resume analysis

For production, we recommend these FREE APIs:
- 🚀 **Groq API** - AI resume analysis (14,400 requests/day, FREE)
- 📋 **Adzuna API** - Job listings (5,000 requests/month, FREE)

See [API_SETUP_GUIDE.md](./API_SETUP_GUIDE.md) for detailed setup instructions.

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/veterano.git
cd veterano
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local` (add your API keys):
```env
# AI Resume Analysis - Choose one or both (all FREE tier)
GROQ_API_KEY=your_groq_api_key_here          # RECOMMENDED - Fast & free
OPENAI_API_KEY=your_openai_api_key_here      # Optional fallback

# Job Listings - Optional (free tiers available)
ADZUNA_APP_ID=your_adzuna_app_id_here        # RECOMMENDED - 5K/month free
ADZUNA_APP_KEY=your_adzuna_app_key_here      # Falls back to RemoteOK automatically

# Database - Optional (for future features)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Quick Start (2 minutes):**
1. Get Groq API key from https://console.groq.com (FREE, no credit card)
2. Add to `.env.local`: `GROQ_API_KEY=your_key_here`
3. Restart dev server
4. Done! Full AI-powered resume analysis ready 🎉

See [API_SETUP_GUIDE.md](./API_SETUP_GUIDE.md) for detailed setup instructions.

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
veterano/
├── app/                        # Next.js app directory
│   ├── (auth)/                # Auth-related pages (future)
│   ├── api/                   # API routes
│   │   ├── ai/               # AI resume analysis
│   │   └── jobs/             # Job listings API
│   ├── jobs/                  # Job search page
│   ├── resume/                # Resume analyzer page
│   ├── companies/             # Companies page (placeholder)
│   ├── resources/             # Resources page (placeholder)
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Landing page
├── components/                 # React components
│   ├── layout/                # Navigation, Footer, etc.
│   ├── ui/                    # Reusable UI components
│   ├── jobs/                  # Job-related components
│   └── resume/                # Resume components
├── types/                      # TypeScript type definitions
│   └── index.ts               # All type definitions
├── public/                     # Static assets
├── .env.example               # Environment variables template
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── next.config.js             # Next.js configuration
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.0 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 3.4
- **Animations**: Framer Motion
- **Icons**: React Icons (Feather Icons)
- **Forms**: React Hook Form + Zod

### Backend (Future)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage

### APIs (All with FREE tiers)
- **AI Analysis**:
  - Groq (Llama 3.1 70B) - Primary, ultra-fast, FREE
  - OpenAI (GPT-4o-mini) - Fallback, paid but affordable
- **Job Listings**:
  - Adzuna API - Primary, FREE tier (5K/month)
  - RemoteOK - Automatic fallback, always FREE
  - Mock Data - Final fallback

## 📖 API Documentation

### POST `/api/ai/analyze-resume`

Analyzes a resume and provides feedback.

**Request Body:**
```json
{
  "resumeText": "Your resume content as plain text"
}
```

**Response:**
```json
{
  "data": {
    "overallScore": 78,
    "atsScore": 72,
    "strengths": ["...", "..."],
    "weaknesses": ["...", "..."],
    "suggestions": [...],
    "skillGaps": [...],
    "civilianTranslation": {
      "militaryTerms": [...]
    }
  },
  "metadata": {
    "provider": "groq",  // or "openai" or "mock"
    "timestamp": "2025-10-27T..."
  }
}
```

### GET `/api/jobs`

Fetches job listings.

**Query Parameters:**
- `q` - Search query (default: "software engineer")
- `location` - Location filter (default: "us")
- `veteran_friendly` - Boolean filter for veteran-friendly jobs

**Response:**
```json
{
  "data": [...],
  "total": 5,
  "metadata": {
    "source": "adzuna",  // or "remoteok" or "mock"
    "query": "software engineer",
    "veteranFriendly": false,
    "timestamp": "2025-10-27T..."
  }
}
```

## 🧪 Testing

### Run the build
```bash
npm run build
```

### Start production server
```bash
npm start
```

### Run linter
```bash
npm run lint
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel --prod
```

4. **Set environment variables** in the Vercel dashboard

### Deploy to Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Digital Ocean App Platform
- Railway
- Render

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| **AI Resume Analysis** | | |
| `GROQ_API_KEY` | No (Recommended) | Groq API key - FREE, 14,400 req/day (Primary) |
| `OPENAI_API_KEY` | No | OpenAI API key - Paid fallback option |
| **Job Listings** | | |
| `ADZUNA_APP_ID` | No (Recommended) | Adzuna App ID - FREE, 5K calls/month |
| `ADZUNA_APP_KEY` | No (Recommended) | Adzuna API Key - Works with App ID |
| **Database (Future)** | | |
| `NEXT_PUBLIC_SUPABASE_URL` | No | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No | Supabase anonymous key |
| **App Config** | | |
| `NEXT_PUBLIC_APP_URL` | No | Application URL (default: localhost:3000) |

**Note:** The platform works out-of-the-box without any API keys using RemoteOK (jobs) and mock data (resume analysis). Add Groq API key for production-ready AI analysis (takes 2 minutes, FREE).

See [API_SETUP_GUIDE.md](./API_SETUP_GUIDE.md) for detailed setup instructions.

## 📝 Database Schema

The Supabase schema is defined in the project documentation. Key tables:

- `users` - User profiles and veteran status
- `jobs` - Job listings
- `resumes` - Uploaded resumes and analysis
- `companies` - Company profiles
- `saved_jobs` - User's saved jobs
- `applied_jobs` - Job applications tracking

See the main project prompt for the complete SQL schema.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built for veterans transitioning to tech careers
- Inspired by the dedication and skills military veterans bring to the tech industry
- Special thanks to all contributors and supporters

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ for our veterans** 🎖️

