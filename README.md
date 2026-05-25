# Placivio — AI Placement Readiness Agent

> Your Personal Placement Intelligence Agent — powered by Google Gemini AI

Placivio is a full-stack web application that helps Indian engineering students prepare for campus placements. It uses AI to analyze skill gaps, generate personalized week-by-week learning roadmaps, and track progress with continuous feedback.

## 🚀 Features

- **AI Skill Gap Analysis** — Compares your skills against what top companies actually require
- **Personalized Roadmaps** — Week-by-week learning plans with free resources
- **Progress Tracking** — Weekly check-ins with AI-generated feedback
- **Placement Score** — Dynamic readiness score that updates as you learn
- **AI Chat** — Ask your personal placement coach anything
- **15+ Pre-seeded Companies** — Google, Microsoft, Amazon, TCS, Infosys, and more

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Tailwind CSS v3 |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| AI | Google Gemini 1.5 Flash |
| Icons | Lucide React |
| Charts | Recharts |

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (connection string pre-configured)
- Google Gemini API key (pre-configured)

## ⚡ Quick Start

### 1. Install Backend Dependencies

```bash
cd server
npm install
```

### 2. Install Frontend Dependencies

```bash
cd client
npm install
```

### 3. Start the Backend Server

```bash
cd server
npm run dev
```

The API server will start at `http://localhost:5000`

### 4. Start the Frontend Dev Server

Open a new terminal:

```bash
cd client
npm run dev
```

The app will open at `http://localhost:5173`

## 📁 Project Structure

```
PLACIVIO/
├── client/                  # React Frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React contexts (Toast)
│   │   ├── pages/           # Page components
│   │   ├── services/        # API client
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                  # Express Backend
│   ├── config/              # Database config
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API route handlers
│   ├── seeds/               # Company seed data
│   ├── services/            # Gemini AI service
│   ├── server.js
│   └── .env
│
└── README.md
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/students` | Create student profile |
| GET | `/api/students/:id` | Get student by ID |
| POST | `/api/roadmap/generate` | Generate AI roadmap |
| GET | `/api/roadmap/:studentId` | Get student's roadmap |
| POST | `/api/roadmap/complete-week` | Toggle week completion |
| POST | `/api/progress` | Submit weekly check-in |
| GET | `/api/progress/:studentId` | Get all progress entries |
| GET | `/api/dashboard/:studentId` | Get full dashboard data |
| POST | `/api/chat` | Chat with AI agent |

## 🚀 Deployment

### Frontend → Vercel

1. Push to GitHub
2. Connect repo to Vercel
3. Set root directory to `client`
4. Set build command: `npm run build`
5. Set output directory: `dist`
6. Add environment variable: `VITE_API_URL` = your Render backend URL

### Backend → Render

1. Create a new Web Service on Render
2. Set root directory to `server`
3. Set build command: `npm install`
4. Set start command: `node server.js`
5. Add environment variables from `.env`

## 📝 Environment Variables

### Server (.env)

```
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

## 📜 License

MIT — Built with ❤️ for Indian engineering students
