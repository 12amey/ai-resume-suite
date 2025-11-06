# 🚀 ResumeAI - AI-Powered Resume Builder

A modern, feature-rich resume builder application powered by AI. Create professional, ATS-friendly resumes in minutes with intelligent suggestions, real-time preview, and multiple customizable templates.

![ResumeAI Banner](https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&h=400&fit=crop)

## ✨ Features

### 🎯 Core Features
- **AI-Powered Content Generation** - Generate professional resume content with advanced AI assistance
- **Real-time Preview** - See your resume update instantly as you type
- **Multiple Templates** - Choose from modern, creative, and professional designs
- **ATS Score Checker** - Optimize your resume for applicant tracking systems
- **Job Matcher** - Match your resume to specific job descriptions
- **Multi-language Support** - Create resumes in multiple languages and tones

### 📝 Resume Builder
- **Personal Information** - Name, contact details, professional photo
- **Work Experience** - Companies, positions, achievements, skills used
- **Education** - Degrees, universities, years, grades
- **Skills & Expertise** - Technical, soft, and domain-specific skills
- **Projects & Certifications** - Portfolio projects with links and descriptions
- **Achievements** - Hackathons, internships, courses, awards

### 🎨 Customization
- **Template Marketplace** - Browse and apply professional templates
- **Live Preview** - Real-time resume preview while editing
- **Color Themes** - Customize colors to match your style
- **Section Management** - Show/hide, reorder sections with drag & drop
- **Export Options** - Download as PDF, share online links

### 🔐 Authentication
- **Email-based Authentication** - Secure OTP (One-Time Password) login
- **User Dashboard** - Manage multiple resumes from one place
- **Profile Management** - Update personal information and settings

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn UI
- **Animations**: Framer Motion
- **Database**: Turso (LibSQL)
- **ORM**: Drizzle ORM
- **Icons**: Lucide React
- **Notifications**: Sonner (Toast)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **bun** package manager
- **Git** - [Download](https://git-scm.com/)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/resume-ai.git
cd resume-ai
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Or using bun:
```bash
bun install
```

### 3. Environment Variables Setup

Create a `.env` file in the root directory:

```env
# Database Configuration (Turso)
DATABASE_URL=your_turso_database_url
DATABASE_AUTH_TOKEN=your_turso_auth_token

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Note**: Contact the project administrator or set up your own Turso database to get the credentials.

#### Setting up Turso Database (Optional)

If you want to set up your own database:

1. Install Turso CLI:
```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

2. Create a new database:
```bash
turso db create resume-ai
```

3. Get the database URL:
```bash
turso db show resume-ai --url
```

4. Create an auth token:
```bash
turso db tokens create resume-ai
```

### 4. Database Setup

Run database migrations:

```bash
npm run db:push
```

(Optional) Seed the database with sample data:

```bash
npm run db:seed
```

### 5. Run the Development Server

```bash
npm run dev
```

Or with bun:
```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application! 🎉

## 📁 Project Structure

```
resume-ai/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── resumes/       # Resume CRUD operations
│   │   │   ├── ats-check/     # ATS score checker
│   │   │   └── generate-content/ # AI content generation
│   │   ├── dashboard/         # User dashboard
│   │   ├── builder/           # Resume builder interface
│   │   ├── templates/         # Template marketplace
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   └── page.tsx           # Homepage
│   ├── components/            # React components
│   │   ├── ui/               # Shadcn UI components
│   │   └── ...               # Custom components
│   ├── db/                    # Database configuration
│   │   ├── schema.ts         # Drizzle schema
│   │   └── seeds/            # Database seeders
│   ├── lib/                   # Utility functions
│   └── hooks/                 # Custom React hooks
├── public/                    # Static assets
├── drizzle/                   # Drizzle migrations
├── .env                       # Environment variables
├── package.json               # Dependencies
├── tsconfig.json             # TypeScript config
└── README.md                 # This file
```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push database schema changes |
| `npm run db:studio` | Open Drizzle Studio (database GUI) |
| `npm run db:seed` | Seed database with sample data |

## 🔌 API Routes

### Authentication
- `POST /api/auth/login` - Send OTP to email
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/verify-otp` - Verify OTP and login
- `POST /api/auth/resend-otp` - Resend OTP code

### Resumes
- `GET /api/resumes` - Get all user resumes
- `POST /api/resumes` - Create new resume
- `GET /api/resumes/[id]` - Get specific resume
- `PUT /api/resumes/[id]` - Update resume
- `DELETE /api/resumes/[id]` - Delete resume

### Resume Sections
- `POST /api/personal-info` - Save personal information
- `POST /api/experiences` - Add work experience
- `POST /api/education` - Add education
- `POST /api/skills` - Manage skills
- `POST /api/projects` - Add projects
- `POST /api/certifications` - Add certifications
- `POST /api/achievements` - Track achievements

### AI Features
- `POST /api/generate-content` - Generate AI content
- `POST /api/improve-resume` - Improve resume with AI
- `POST /api/ats-check` - Check ATS score

## 🎨 Customization

### Adding New Templates

1. Create template component in `src/components/templates/`
2. Add template metadata to template registry
3. Include preview thumbnail

### Modifying Color Themes

Edit `src/app/globals.css` to customize color tokens:

```css
:root {
  --primary: oklch(0.205 0 0);
  --secondary: oklch(0.97 0 0);
  /* Add more colors */
}
```

## 🐛 Troubleshooting

### Common Issues

**Port 3000 already in use**
```bash
# Find and kill the process
npx kill-port 3000
# Or use a different port
PORT=3001 npm run dev
```

**Database connection error**
- Verify `.env` file exists and has correct credentials
- Check if Turso database is accessible
- Run `npm run db:push` to sync schema

**Module not found errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📝 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Turso database URL | Yes |
| `DATABASE_AUTH_TOKEN` | Turso auth token | Yes |
| `NEXT_PUBLIC_APP_URL` | Application base URL | Yes |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Shadcn UI](https://ui.shadcn.com/) - UI components
- [Turso](https://turso.tech/) - Database platform
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library

## 📧 Support

For support, email support@resumeai.com or open an issue on GitHub.

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!

---

**Built with ❤️ by the ResumeAI Team**