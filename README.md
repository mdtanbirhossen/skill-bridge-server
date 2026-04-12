# SkillBridge - Backend API 🚀

SkillBridge is a modern full-stack tutoring platform. This repository contains the **server-side (backend)** logic, implemented with Node.js, Express, and PostgreSQL.

---

## 🚀 Live Demo

- **Backend API:** [https://skill-bridge-server-nine.vercel.app/](https://skill-bridge-server-nine.vercel.app/)
- **Frontend App:** [https://skill-bridge-client-psi.vercel.app/](https://skill-bridge-client-psi.vercel.app/)

---

## 🔗 Repository Links

- **Backend Repo:** [https://github.com/mdtanbirhossen/skill-bridge-server](https://github.com/mdtanbirhossen/skill-bridge-server)
- **Frontend Repo:** [https://github.com/mdtanbirhossen/skill-bridge-client](https://github.com/mdtanbirhossen/skill-bridge-client)

---

## 📌 Features

- **🛡️ Secure Authentication**: JWT-based login, registration, and logout.
- **🏠 Comprehensive Data Models**: PostgreSQL schema for Users, Tutors, Categories, Bookings, and Reviews.
- **🤖 AI-Powered Capabilities**: 
  - Integrated **Google Gemini 3 Flash** for intelligent chat assistance.
  - Smart Search query interpretation.
- **👥 Role-Based Access Control (RBAC)**: Distinct permissions for Student, Tutor, Manager, Moderator, and Admin.
- **📅 Availability Management**: Flexible scheduling for tutors.
- **⭐ Review System**: Full student-to-tutor feedback loop.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (v20+)
- **Framework**: Express.js
- **Database**: PostgreSQL (via Neon / Vercel Postgres)
- **ORM**: Prisma
- **AI**: Google Generative AI (Gemini SDK)
- **Security**: Bcrypt for password hashing, JWT for sessions

---

## ⚙️ Installation & Setup

```bash
# Clone the repository
git clone https://github.com/mdtanbirhossen/skill-bridge-server.git

# Navigate to project
cd skill-bridge-server

# Install dependencies
npm install

# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npm run generate

# Run development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="your-postgresql-url"
JWT_SECRET="your-secret-key"
PORT=5000
APP_URL=http://localhost:3000

# Gemini AI Settings
GEMINI_API_KEY="your-gemini-api-key"
```

---

## 📜 Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts development server with tsx watch |
| `npm run build` | Compiles for production using tsup |
| `npm run migrate` | Applies Prisma migrations |
| `npm run seed:admin` | Seeds an initial admin user |
| `npm run studio` | Opens Prisma Studio UI |

---

## 🤝 Contributing

Contributions are welcome! Please fork the repo and submit a pull request.

---

## 📄 License

This project is for educational purposes.

---

## 🙌 Author

**Md Tanbir Hossen**

Backend Developer | Full Stack Enthusiast 🚀
