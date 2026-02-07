# 🚀 Edvora – AI Powered Learning Assistant for Students

Edvora is an AI-powered learning assistant designed to help students study smarter and more efficiently. It provides personalized learning support, intelligent content analysis, smart study planning, and interactive learning tools — all in one platform.

The system integrates modern web technologies with AI to improve academic productivity through quizzes, flashcards, explanations, and writing assistance.

---

## ✨ Features

- 🔐 Secure Authentication (Supabase)
- 📝 Content Analyzer  
  - Grammar, clarity, and structure feedback for essays & reports
- 📅 Smart Study Planner  
  - AI-generated personalized schedules
- 📚 Interactive Learning Hub  
  - Topic explanations  
  - AI quizzes  
  - Flashcards
- 🤖 AI-powered explanations using Gemini
- ☁️ Cloud database with Supabase
- 🎨 Modern responsive UI

---

## 🛠 Tech Stack

### Frontend
- React.js (TypeScript)
- Tailwind CSS
- shadcn/ui
- lucide-react
- Framer Motion
- Vite

### Backend
- Node.js
- Express.js

### Database & Authentication
- Supabase (PostgreSQL)

### AI Integration
- Google Gemini API (gemini-1.5-flash)

### Other Tools
- Git & GitHub
- Draw.io

---

## 🧠 Core Modules

- Content Analyzer  
- Study Schedule Generator  
- Topic Explanation Engine  
- Quiz Generator  
- Flashcard Generator  
- User Authentication  

---

## 📂 Project Structure

edvora/
│
├── src/
│ ├── components/
│ ├── pages/
│ ├── lib/
│ └── main.tsx
│
├── server/
│ ├── routes/
│ ├── controllers/
│ └── index.js
│
├── .env
├── package.json
└── vite.config.ts


---

# ⚙️ Setup Instructions

Follow these steps to run Edvora locally.

---

## ✅ Prerequisites

- Node.js (v18+ recommended)
- npm
- Supabase account
- Google Gemini API Key

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/edvora.git
cd edvora
```

## 2️⃣ Install Dependencies
### Frontend
```bash
npm install
```

### Backend (if separate)
```bash
cd server
npm install
```

## 3️⃣ Setup Environment Variables

Create a .env file in root:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

If backend exists:

```bash
PORT=5000
```

## 4️⃣ Supabase Configuration

1. Create Supabase project
2. Enable Email/Password Authentication
3. Create tables:
profiles
study_plans
learning_content

Copy Project URL + Anon Key into .env.

## 5️⃣ Get Gemini API Key

1. Visit https://aistudio.google.com

2. Generate API Key

3. Add to .env as VITE_GEMINI_API_KEY

## 6️⃣ Run the Project
### Frontend
```bash
npm run dev
```

### Backend (if used)
```bash
npm start
```

Open browser:
```bash
http://localhost:5173
```

## 🎯 Project Goal

To build an AI-powered student assistant that combines writing support, personalized scheduling, and interactive learning tools into one unified platform — reducing distractions and improving academic productivity.

## 👨‍💻 Author

Sujal Manojkumar Patel
