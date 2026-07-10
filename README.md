# The Intelligent Visual Judge ⚖️

A full-stack online judge platform built with the MERN stack. Practice coding problems, get instant verdicts, and receive AI-powered feedback on your solutions.

## Features

- **JWT Authentication** — Secure register/login with token-based sessions
- **Problem Dashboard** — Browse problems by difficulty (Easy/Medium/Hard) with tags
- **Monaco Code Editor** — Full-featured in-browser editor with syntax highlighting
- **Multi-Language Support** — Python, JavaScript, C++, Java
- **Code Execution Engine** — Sandboxed execution with time/memory limits
- **AI Feedback** — Gemini-powered code review with optimization suggestions
- **User Profiles** — Track solved problems, submission history, and stats
- **Premium Dark UI** — Glassmorphism design with smooth animations

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite |
| Editor | Monaco Editor |
| Backend | Express.js + Node.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT + bcrypt |
| AI | Google Gemini API |
| Styling | Custom CSS (glassmorphism dark theme) |

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Python 3 / GCC / JDK (for code execution)

### 1. Clone the repo
```bash
git clone https://github.com/Avi3784/INTELLIGENT_ONLINE_JUDGE.git
cd INTELLIGENT_ONLINE_JUDGE
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Seed the database
```bash
npm run seed
```

### 4. Frontend setup
```bash
cd ../frontend
npm install
```

### 5. Run the app
Start backend (from `/backend`):
```bash
npm start
```

Start frontend (from `/frontend`):
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

## Project Structure

```
├── backend/
│   ├── config/          # Database connection
│   ├── middleware/       # JWT auth & admin guards
│   ├── models/          # Mongoose schemas (User, Problem, Submission)
│   ├── routes/          # API endpoints (auth, problems, submissions, ai, users)
│   ├── services/        # Code execution engine
│   ├── seed/            # Database seeder
│   └── server.js        # Express entry point
│
├── frontend/
│   └── src/
│       ├── components/  # Navbar, ProblemCard, ProtectedRoute
│       ├── context/     # AuthContext (global auth state)
│       ├── pages/       # Dashboard, ProblemDetail, Profile, Login, Register
│       ├── services/    # Axios API client
│       └── App.css      # Premium dark theme stylesheet
```

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | — |
| POST | `/api/auth/login` | Login | — |
| GET | `/api/auth/me` | Get current user | ✅ |
| GET | `/api/problems` | List problems | — |
| GET | `/api/problems/:id` | Get problem detail | — |
| POST | `/api/submissions` | Submit solution | ✅ |
| POST | `/api/submissions/run` | Run against samples | ✅ |
| GET | `/api/submissions` | Submission history | ✅ |
| POST | `/api/ai/feedback` | Get AI feedback | ✅ |
| GET | `/api/users/profile` | User profile + stats | ✅ |

## License

ISC
