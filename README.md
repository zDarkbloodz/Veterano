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
- (Optional) OpenAI API key for resume analysis
- (Optional) Indeed Publisher ID for job listings

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

Edit `.env.local`:
```env
# Supabase (Database & Auth) - Optional for MVP
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI (AI Features) - Optional, uses mock data if not provided
OPENAI_API_KEY=your_openai_api_key

# Indeed API (Job Listings) - Optional, uses mock data if not provided
INDEED_PUBLISHER_ID=your_indeed_publisher_id

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

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

### APIs
- **AI Analysis**: OpenAI GPT-4
- **Job Listings**: Indeed API (with mock data fallback)

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
  }
}
```

### GET `/api/jobs`

Fetches job listings.

**Query Parameters:**
- `q` - Search query (default: "software engineer")
- `location` - Location filter
- `veteran_friendly` - Boolean filter for veteran-friendly jobs

**Response:**
```json
{
  "data": [...],
  "total": 5
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
| `NEXT_PUBLIC_SUPABASE_URL` | No | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No | Supabase anonymous key |
| `OPENAI_API_KEY` | No | OpenAI API key (uses mock data if not provided) |
| `INDEED_PUBLISHER_ID` | No | Indeed API publisher ID (uses mock data if not provided) |
| `NEXT_PUBLIC_APP_URL` | No | Application URL |

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

