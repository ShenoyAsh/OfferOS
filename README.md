# 🏆 OfferOS 
**AI-Personalized Desktop OS for Placement Prep**

*Built for the **Outskill X OpenAI Hackathon** (Build, Ship, Launch)*

---

## 🌐 Live Production Deployment
OfferOS is fully deployed and serving live production traffic on Google Cloud Run!

* **Production Live URL:** [https://offeros-542097547792.us-central1.run.app](https://offeros-542097547792.us-central1.run.app)
* **Status:** 🟢 Active, Optimized, and Serving 100% Production Traffic
* **Automated Walkthrough Video:** `/offeros_full_demo.mp4` (available locally under `public/` and served live at [https://offeros-542097547792.us-central1.run.app/offeros_full_demo.mp4](https://offeros-542097547792.us-central1.run.app/offeros_full_demo.mp4))

---

## 📖 About OfferOS
OfferOS reimagines traditional placement preparation by turning a boring dashboard into a high-fidelity, multi-window **desktop operating system environment** inside your browser. Candidates no longer have to jump between disconnected apps or browser tabs. They can organize their prep workspace dynamically—running code editors, resume scanners, mock interview assistants, and scheduler roadmaps concurrently.

---

## ✨ Premium Features
- **🖥️ Multi-Window Desktop Interface:** Drag, resize, maximize, minimize, and stack windows smoothly with high-performance window-management and dynamic design token synchronization.
- **💻 DSA Monaco Code Arena:** A fully integrated Monaco Editor playground with a live AI Co-Pilot that explains logic, outputs space/time complexity, and acts as a dynamic debugger.
- **🎙️ Mock Interview Desk:** Simulate real Technical, System Design, or Behavioral rounds with an interactive AI Interviewer, completing your sessions with automated scoring cards.
- **📄 Resume Optimizer Lab:** An ATS resume analyzer that evaluates your CV, matches it against target job descriptions, highlights missing keywords, and automatically rephrases bullet points into high-impact, metrics-driven professional copy.
- **📊 Admin Control Center (Judge Mode):** A gamified live analytics center displaying MRR charts, active user statistics, platform load metrics, and custom rank badges (Gold/Silver/Bronze) using premium Lucide vector graphics.
- **🌗 Synchronized Light/Dark Themes:** Seamless transition between dark and light modes with all visual elements properly optimized with high-contrast rules.

---

## 🛠️ Advanced Tech Stack
- **Framework:** Next.js 16 (App Router, Standalone Build Mode)
- **Styling:** Tailwind CSS (Modern custom Glassmorphism UI)
- **Database:** MongoDB Atlas (via Mongoose for full state persistence)
- **Security & Cookies:** Persistent full-stack authentication, encrypted session structures, and zero-leak API routing.
- **Containerization & Cloud:** Multi-stage optimized Dockerfile running on `node:20-alpine` and deployed to Google Cloud Run.

---

## 🚀 Quick Start Guide (Running Locally)

### 1. Prerequisites
- **Node.js** (v20 or higher recommended)
- **MongoDB** (Local instance or MongoDB Atlas Connection URI)

### 2. Setup
Clone the repository and enter the directory:
```bash
git clone https://github.com/ShenoyAsh/OfferOS.git
cd OfferOS/offeros
```

### 3. Environment Configuration
Create a `.env.local` file in the root of the `offeros` folder:
```env
MONGODB_URI=your_mongodb_connection_string
MISTRAL_API_KEY=your_mistral_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to access OfferOS locally!

---

## 📦 Production Build & Docker

### Local Production Build
```bash
npm run build
npm run start
```

### Building the Docker Container
```bash
docker build -t offeros .
docker run -p 3000:3000 offeros
```

---

## 🏆 Hackathon Context & Submission
OfferOS is conceptualized, engineered, and shipped within 7 days for the **Outskill X OpenAI Hackathon**. For a full walkthrough of the judging script, high-fidelity screenshots, and deployment specifications, please check the local [offeros_submission_kit.md](offeros_submission_kit.md)!
