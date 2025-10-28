<div align="center">

# 🚀 CandlelightTechnology.com Dashboard  

### 🌟 AI-Powered Website Builder & Content Management Platform

A **next-generation React + Tailwind CSS dashboard** designed for **AI-driven website creation, SEO analytics, and team collaboration** — built for **CandlelightTechnology.com**.

</div>

## 🧠 Overview

**CandlelightTechnology.com Dashboard** is a futuristic, AI-first platform for building and managing websites with ease.  
It includes everything from **AI-powered website generation** to **SEO analytics**, **team collaboration**, and **automated deployment** — all in one unified dashboard.

> ⚡ Designed with **React.js + Tailwind CSS**, built for scalability, performance, and beautiful user experience.

---

## ✨ Features

### 🔐 Authentication System
- Login, Signup, and Logout with validation  
- Demo account for full access  
- Responsive design with neon-glow UI  
- Confirmation modals & toast notifications  

### 🧭 Dashboard Layout
- Collapsible Sidebar with active states  
- Header with search, notifications, and user dropdown  
- Animated transitions and responsive menu  

### 🧩 10 Fully Functional Dashboard Sections
| Section | Description |
|----------|-------------|
| **1. Dashboard Overview** | Real-time stats, activity feed, performance charts |
| **2. Projects** | Create, duplicate, delete projects with version history |
| **3. AI Website Builder** | Drag-and-drop builder, AI content generation |
| **4. AI Assistant** | Chat-based AI tools for SEO and copywriting |
| **5. Blog & Content Manager** | Rich text editor, post scheduling, SEO metadata |
| **6. Export & Deployment** | Deploy via GitHub, Netlify, Vercel |
| **7. SEO & Analytics** | Traffic graphs, keyword tracking, AI insights |
| **8. Settings** | Profile, dark/light mode, preferences |
| **9. Subscription & Billing** | Plans, invoices, payment methods |
| **10. Team & Collaboration** | Invite members, assign roles, activity logs |

---

## 🧪 Demo Account

**Credentials:**
Email: demo@candlelighttech.com
Password: Demo@1234

markdown
Copy code

✅ Includes:
- 5 sample projects  
- 2 blog posts (draft + published)  
- 3 team members with roles  
- Analytics data with charts  
- SEO recommendations  
- Usage and billing stats  

> No signup required — all demo data is stored locally via `localStorage`.

---

## 🧰 Tech Stack

| Category | Tools Used |
|-----------|------------|
| **Frontend** | React.js + Vite |
| **Styling** | Tailwind CSS |
| **State Management** | Context API |
| **Routing** | React Router v6 |
| **Charts** | Recharts |
| **Rich Editor** | React Quill |
| **Animations** | Framer Motion |
| **Drag & Drop** | react-dnd |
| **Icons** | Heroicons / React Icons |
| **Validation** | React Hook Form |
| **Persistence** | LocalStorage |
| **Notifications** | Custom Toast System |

---

## 🎨 Design System

**Color Palette**
| Role | Color |
|------|--------|
| Dark Base | `#070F2B` |
| Primary | `#1B1A55` |
| Accent | `#535C91` |
| Highlight | `#9290C3` |

**Typography**
- Headings → Orbitron  
- Body Text → Inter  

**Visual Style**
- Glassmorphism + Neon Glow  
- Soft gradients and glows  
- Rounded corners (`1rem – 1.5rem`)  
- Particle or line-flow animated background  

---

## 📁 Folder Structure

candlelight-dashboard/
│
├── public/
│ ├── index.html
│ └── favicon.ico
│
├── src/
│ ├── assets/ # Icons, images, mock data
│ ├── components/ # Reusable components (Button, Modal, Card, etc.)
│ ├── contexts/ # Context API (Auth, Theme, Data)
│ ├── hooks/ # Custom hooks
│ ├── layouts/ # AuthLayout, DashboardLayout
│ ├── pages/ # All 10 functional sections
│ ├── routes/ # Protected and public routes
│ ├── utils/ # Helpers, constants
│ ├── App.jsx
│ ├── main.jsx
│ └── index.css
│
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── README.md

yaml
Copy code

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Gajan-kaja/candlelight-dashboard.git
cd candlelight-dashboard
2️⃣ Install Dependencies
bash
Copy code
npm install
3️⃣ Start the Development Server
bash
Copy code
npm run dev
App runs at http://localhost:5173
