<div align="center">

# ☕ EspressoChat

### A Production-Grade Full-Stack Real-Time Chat Application

[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16.x-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![WebSocket](https://img.shields.io/badge/WebSocket-Real--Time-4A90E2?style=for-the-badge&logo=websocket&logoColor=white)](https://websockets.spec.whatwg.org/)
[![Deploy on Render](https://img.shields.io/badge/Deploy-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

---

**EspressoChat** is a robust, scalable, full-stack real-time messaging platform built with **FastAPI** on the backend and **Next.js + TypeScript** on the frontend. It supports secure direct messaging (DM) and group chat with token-based authentication, WebSocket push delivery, and persistent MongoDB storage — all deployable to Render in a single command.

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🏗️ Architecture Overview](#️-architecture-overview)
- [🔧 Tech Stack](#-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Quick Start — Local Development](#-quick-start--local-development)
  - [Prerequisites](#prerequisites)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Configure Environment Variables](#2-configure-environment-variables)
  - [3. Run the Backend](#3-run-the-backend)
  - [4. Run the Frontend](#4-run-the-frontend)
  - [5. One-Command Start (Windows)](#5-one-command-start-windows)
- [🌐 API Reference](#-api-reference)
  - [Authentication](#authentication)
  - [Direct Messaging (DM)](#direct-messaging-dm)
  - [Group Chat](#group-chat)
  - [Users](#users)
  - [WebSocket](#websocket)
- [🔑 Environment Variables](#-environment-variables)
- [☁️ Deployment — Render](#️-deployment--render)
- [🧪 Testing](#-testing)
- [🔒 Security Design](#-security-design)
- [🗺️ Roadmap](#️-roadmap)
- [🤝 Contributing](#-contributing)
- [👩‍💻 Author](#-author)
- [📄 License](#-license)

---

## ✨ Features

| Category | Feature |
|---|---|
| 🔐 **Auth** | JWT-based token authentication (OAuth2 Password flow) |
| 🔐 **Auth** | Secure password hashing via PBKDF2-SHA256 (passlib) |
| 💬 **Messaging** | Real-time Direct Messages (DM) via WebSocket push |
| 💬 **Messaging** | Group chat creation & real-time group broadcast |
| 💬 **Messaging** | Full persistent message history (MongoDB) |
| 👥 **Users** | User registration, login, and user discovery |
| 👥 **Users** | Group membership management |
| 🌐 **Frontend** | Modern, responsive Next.js 16 + React 19 UI |
| 🌐 **Frontend** | Tailwind CSS v4 with Lucide icons |
| 📄 **Docs** | Auto-generated interactive API docs (Swagger / ReDoc) |
| 🚦 **DevEx** | One-command local launcher (`run_locally.ps1`) |
| ☁️ **Deploy** | `render.yaml` for zero-config Render deployment |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                      │
│                  Next.js 16 + React 19 + TS                  │
│               REST API calls  ──  WebSocket               │
└────────────────────┬──────────────────┬─────────────────────┘
                     │ HTTP/S           │ WS/WSS
                     ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (FastAPI + Python)                  │
│                                                               │
│  ┌─────────────┐  ┌────────────┐  ┌───────────────────────┐ │
│  │   /register  │  │   /login   │  │      /ws (WebSocket)  │ │
│  │   /users     │  │   /dm      │  │   ConnectionManager   │ │
│  │   /group     │  │   JWT Auth │  │   (in-memory registry)│ │
│  └─────────────┘  └────────────┘  └───────────────────────┘ │
│                                                               │
│  auth.py ── dependencies.py ── chat_logic.py ── models.py   │
└──────────────────────────────┬──────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                  MongoDB Atlas (Cloud Database)               │
│   collections: users  │  messages  │  groups                 │
└─────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

- **Stateless JWT Auth**: Every protected endpoint verifies a signed JWT; no server-side sessions.
- **WebSocket + REST hybrid**: Messages are *stored* via REST and *delivered* in real-time via WebSocket push to registered online users.
- **ConnectionManager**: An in-memory registry that maps `username → [WebSocket]`, supporting multi-device connections per user.
- **MongoDB Atlas**: Schema-less storage with collections for `users`, `messages`, and `groups`.

---

## 🔧 Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Python | 3.9+ | Runtime |
| FastAPI | Latest | REST + WebSocket API framework |
| Uvicorn | Latest | ASGI server |
| PyMongo | Latest | MongoDB driver |
| python-jose | Latest | JWT encoding/decoding |
| passlib + pbkdf2 | Latest | Password hashing |
| python-dotenv | Latest | Environment configuration |
| python-multipart | Latest | Form data parsing (OAuth2) |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.1.6 | React meta-framework (App Router) |
| React | 19.2.3 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Utility-first styling |
| Axios | 1.x | HTTP client |
| Lucide React | Latest | Icon library |

### Infrastructure
| Technology | Purpose |
|---|---|
| MongoDB Atlas | Cloud database |
| Render | Backend + Frontend hosting |

---

## 📁 Project Structure

```
EspressoChat/
│
├── 📄 main.py                  # FastAPI app entry point, routes, WebSocket endpoint
├── 📄 auth.py                  # JWT creation, password hashing/verification
├── 📄 chat_logic.py            # Core business logic: DM, group chat, user management
├── 📄 database.py              # MongoDB connection & collection references
├── 📄 dependencies.py          # FastAPI dependency: JWT token extraction (get_current_user)
├── 📄 manager.py               # WebSocket ConnectionManager (username → socket registry)
├── 📄 models.py                # Pydantic data models (requests & DB schemas)
│
├── 📁 routes/
│   ├── 📄 __init__.py
│   ├── 📄 dm.py                # DM routes: /dm/send, /dm/history
│   ├── 📄 group.py             # Group routes: /group/create, /group/send, /group/history
│   └── 📄 users.py             # User routes: /users/, /users/groups
│
├── 📁 frontend/                # Next.js 16 App (TypeScript + Tailwind)
│   ├── 📁 app/                 # Next.js App Router pages
│   ├── 📁 components/          # Reusable React components
│   ├── 📁 lib/                 # API client utilities
│   ├── 📁 public/              # Static assets
│   ├── 📄 package.json
│   └── 📄 next.config.ts
│
├── 📁 tests/
│   └── 📄 test_api.py          # pytest-based API test suite
│
├── 📄 render.yaml              # Render.com deployment configuration
├── 📄 requirements.txt         # Python dependencies
├── 📄 run_locally.ps1          # One-command local launcher (Windows PowerShell)
├── 📄 .env.example             # Example environment variables
└── 📄 .gitignore
```

---

## 🚀 Quick Start — Local Development

### Prerequisites

| Tool | Version | Install |
|---|---|---|
| Python | 3.9+ | [python.org](https://www.python.org/downloads/) |
| Node.js | 18.x+ | [nodejs.org](https://nodejs.org/) |
| MongoDB Atlas | — | [mongodb.com/cloud](https://www.mongodb.com/cloud/atlas) (free tier works) |
| Git | Latest | [git-scm.com](https://git-scm.com/) |

---

### 1. Clone the Repository

```bash
git clone https://github.com/SAK-SHI14/EspressoChat.git
cd EspressoChat
```

---

### 2. Configure Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
SECRET_KEY=your_super_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

---

### 3. Run the Backend

```bash
# Create and activate a virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload --port 8000
```

Backend is live at: **http://localhost:8000**
Interactive API Docs: **http://localhost:8000/docs**

---

### 4. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend is live at: **http://localhost:3000**

---

### 5. One-Command Start (Windows)

A PowerShell launcher script is provided to spin up both services at once:

```powershell
.\run_locally.ps1
```

This opens two terminal windows — one for the backend and one for the frontend — and prints the access URLs.

---

## 🌐 API Reference

All protected endpoints require the `Authorization: Bearer <token>` header.

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/register` | ❌ Public | Register a new user |
| `POST` | `/login` | ❌ Public | Login and receive a JWT token |

**Register Request Body:**
```json
{ "username": "alice", "password": "securepassword" }
```

**Login Request Body (OAuth2 form):**
```
username=alice&password=securepassword
```

**Login Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

---

### Direct Messaging (DM)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/dm/send` | ✅ Required | Send a direct message to another user |
| `GET` | `/dm/history` | ✅ Required | Retrieve DM conversation history |

**Send DM Request Body:**
```json
{ "receiver": "bob", "message": "Hey Bob! ☕" }
```

**History Query:** `GET /dm/history?with=bob`

---

### Group Chat

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/group/create` | ✅ Required | Create a new group with members |
| `POST` | `/group/send` | ✅ Required | Send a message to a group |
| `GET` | `/group/history` | ✅ Required | Retrieve group message history |

**Create Group Request Body:**
```json
{ "group_name": "dev-team", "members": ["alice", "bob", "carol"] }
```

**Send Group Message Request Body:**
```json
{ "group_name": "dev-team", "message": "Sprint starts Monday! 🚀" }
```

---

### Users

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/users/` | ✅ Required | List all registered users (excluding self) |
| `GET` | `/users/groups` | ✅ Required | List groups the current user is a member of |

---

### WebSocket

```
ws://localhost:8000/ws?token=<JWT_TOKEN>
```

**Behavior:**
- On connection, the server validates the JWT. Invalid tokens result in close codes `4001`, `4002`, or `4003`.
- When a DM is sent, the receiver's open WebSocket connections receive a real-time JSON push.
- When a group message is sent, all online members receive the push instantly.

**Real-Time Message Payload:**
```json
{
  "type": "dm",
  "sender": "alice",
  "message": "Hey! Are you there?",
  "timestamp": "2025-02-25T06:30:00.000Z"
}
```

---

## 🔑 Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `MONGO_URI` | ✅ Yes | — | MongoDB Atlas connection string |
| `SECRET_KEY` | ✅ Yes | `supersecretkey123` | JWT signing secret (change in production!) |
| `ALGORITHM` | ❌ No | `HS256` | JWT signing algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | ❌ No | `30` | JWT expiry duration in minutes |

> 🔐 In production, always set a strong, randomly generated `SECRET_KEY`. On Render, this is auto-generated via `generateValue: true` in `render.yaml`.

---

## ☁️ Deployment — Render

This project ships with a `render.yaml` Blueprint for one-click deployment of **both** services.

### Deploy Steps

1. **Fork** this repository to your GitHub account.
2. Go to [Render Dashboard](https://dashboard.render.com/) → **New** → **Blueprint**.
3. Connect your forked repository.
4. Render will detect `render.yaml` and configure both the **backend** and **frontend** services automatically.
5. Set the required secret environment variables in the Render dashboard:
   - `MONGO_URI` → your MongoDB Atlas connection string
   - `NEXT_PUBLIC_API_URL` → your deployed backend URL (e.g., `https://chatapp-backend.onrender.com`)

### Service Configuration (`render.yaml`)

| Service | Type | Build Command | Start Command |
|---|---|---|---|
| `chatapp-backend` | Python (ASGI) | `pip install -r requirements.txt` | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| `chatapp-frontend` | Node.js (Next.js) | `npm install && npm run build` | `npm start` |

---

## 🧪 Testing

The project includes a `pytest`-based API test suite.

```bash
# From the project root with venv activated
pip install pytest httpx

pytest tests/ -v
```

Tests cover:
- User registration and duplicate prevention
- Login and JWT token generation
- Authenticated DM sending and history retrieval
- Group creation, messaging, and history

---

## 🔒 Security Design

| Concern | Solution |
|---|---|
| **Password Storage** | PBKDF2-SHA256 hashing via `passlib` — never stored in plaintext |
| **Authentication** | Stateless JWT tokens with configurable expiry |
| **WebSocket Auth** | Token passed as query parameter; validated server-side before connection is accepted |
| **Input Validation** | All request bodies validated via Pydantic models with type enforcement |
| **CORS** | Restricted to the frontend origin (`http://localhost:3000` for dev; update for production) |
| **Secret Management** | Secrets loaded from `.env` / Render env vars — never hardcoded in source |

---

## 🗺️ Roadmap

- [x] JWT Authentication (Register / Login)
- [x] Direct Messaging (REST + WebSocket delivery)
- [x] Group Chat (Create / Send / History)
- [x] Real-Time WebSocket Push Notifications
- [x] Persistent Message Storage (MongoDB)
- [x] Next.js Frontend UI
- [x] Render Deployment Configuration
- [ ] Online/Offline Presence Indicators
- [ ] Message Read Receipts
- [ ] Typing Indicators
- [ ] File / Image Attachments
- [ ] End-to-End Encryption
- [ ] Push Notifications (PWA)
- [ ] Rate Limiting & Abuse Prevention
- [ ] Admin Dashboard

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. **Fork** the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a **Pull Request**

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## 👩‍💻 Author

<div align="center">

**Sakshi Verma**

[![GitHub](https://img.shields.io/badge/GitHub-SAK--SHI14-181717?style=for-the-badge&logo=github)](https://github.com/SAK-SHI14)

*Built with ☕ and a passion for clean, production-ready systems.*

</div>

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

⭐ **If you find EspressoChat useful, please give it a star!** ⭐

</div>
