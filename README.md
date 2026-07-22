# The Intelligent Visual Judge

A modern, full-stack online judge platform for competitive programming — featuring an integrated code editor, real-time algorithm visualizer, AI-powered code analysis, community solutions, and live global chat.

## Features

### Code Execution Engine
Submit solutions in **Python**, **JavaScript**, **C++**, and **Java**. The platform compiles and executes code in an isolated environment, validates output against sample and hidden test cases, and returns verdicts (AC, WA, TLE, RTE) with per-test-case execution metrics.

### Algorithm Visualizer
An interactive histogram-based visualization of **15 sorting algorithms** — Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort, Heap Sort, Shell Sort, Counting Sort, Radix Sort, Bucket Sort, Tim Sort, Cocktail Sort, Gnome Sort, Comb Sort, and Cycle Sort. Includes adjustable array size, animation speed control, and a completion sweep animation.

### Community Solutions
Share solutions with explanations, browse other users' approaches, and upvote the most elegant implementations. Solutions are organized by problem and include syntax-highlighted code previews.

### AI-Powered Feedback
Receive automated code review powered by **Google Gemini 2.0 Flash**. The AI identifies bugs, suggests optimizations, analyzes time and space complexity, and provides actionable improvement tips.

### Live Global Chat
A real-time WebSocket chat lobby where all users can communicate instantly. Messages are persisted in MongoDB, typing indicators show active participants, and the online user count updates in real time.

### OAuth Authentication
Supports sign-in via **GitHub** and **Google**, alongside traditional email/password registration. OAuth accounts are automatically linked if the email matches an existing account.

### Admin Dashboard
Administrators can create, edit, and delete problems with sample and hidden test cases. The admin panel includes a problem management interface with tag editors and difficulty selectors.

### Leaderboard & Profile
A global leaderboard ranks users by problems solved. User profiles display solve statistics broken down by difficulty (Easy/Medium/Hard), recent submission history, and acceptance rate.

## Technology Stack

| Layer        | Technology                                                |
|--------------|-----------------------------------------------------------|
| Frontend     | React 18, Vite, Monaco Editor, Framer Motion, Recharts   |
| Backend      | Node.js, Express.js, Socket.io, Passport.js              |
| Database     | MongoDB Atlas (Mongoose ODM)                              |
| AI           | Google Generative AI (Gemini 2.0 Flash)                   |
| Auth         | JWT, bcrypt, OAuth 2.0 (GitHub, Google)                   |
| Testing      | Jest, Supertest, mongodb-memory-server, Vitest, React Testing Library |

## Project Structure

```
├── backend/
│   ├── config/          # Database connection, Passport strategies
│   ├── middleware/       # JWT auth, admin guards
│   ├── models/           # Mongoose schemas (User, Problem, Submission, ChatMessage)
│   ├── routes/           # REST API endpoints
│   ├── services/         # Code execution engine
│   ├── sockets/          # WebSocket chat handler
│   ├── seed/             # Problem seeder script
│   └── tests/            # Jest test suites
├── frontend/
│   ├── src/
│   │   ├── components/   # Navbar, LiveChat, ProblemCard, SolutionsTab
│   │   ├── context/      # AuthContext, SocketContext
│   │   ├── pages/        # Dashboard, ProblemDetail, Profile, Visualizer, etc.
│   │   └── services/     # Axios API client
│   └── tests/            # Vitest test suites
└── README.md
```

## Getting Started

### Prerequisites
- **Node.js** (v18+)
- **MongoDB Atlas** account (or local MongoDB instance)
- **Python**, **g++**, **javac** installed for multi-language code execution

### Environment Variables
Create `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb_connection_string
JWT_SECRET=jwt_secret
GEMINI_API_KEY=gemini_api_key
GITHUB_CLIENT_ID=github_client_id
GITHUB_CLIENT_SECRET=github_client_secret
GOOGLE_CLIENT_ID=google_client_id
GOOGLE_CLIENT_SECRET=google_client_secret
```

### Installation & Running

```bash
# Backend
cd backend
npm install
npm run seed          # Seed sample problems
npm run dev           # Start on port 5000

# Frontend (separate terminal)
cd frontend
npm install
npm run dev           # Start on port 5173
```

### Running Tests

```bash
# Backend tests (Jest + in-memory MongoDB)
cd backend && npm test

# Frontend tests (Vitest + jsdom)
cd frontend && npm test
```

## API Endpoints

| Method | Endpoint                    | Auth     | Description                  |
|--------|-----------------------------|----------|------------------------------|
| POST   | `/api/auth/register`        | Public   | Register new user            |
| POST   | `/api/auth/login`           | Public   | Login with email/password    |
| GET    | `/api/auth/me`              | Required | Get current user             |
| GET    | `/api/oauth/github`         | Public   | GitHub OAuth flow            |
| GET    | `/api/oauth/google`         | Public   | Google OAuth flow            |
| GET    | `/api/problems`             | Public   | List all problems            |
| GET    | `/api/problems/:id`         | Public   | Get problem by ID            |
| POST   | `/api/submissions`          | Required | Submit code for judging      |
| POST   | `/api/submissions/run`      | Required | Run code against samples     |
| GET    | `/api/submissions`          | Required | Get user's submissions       |
| POST   | `/api/ai/feedback`          | Required | Get AI code review           |
| GET    | `/api/users/profile`        | Required | Get user profile & stats     |
| GET    | `/api/solutions/:problemId` | Required | Get community solutions      |
| POST   | `/api/solutions`            | Required | Share a solution             |

