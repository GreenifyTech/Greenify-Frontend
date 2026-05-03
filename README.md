# 🌿 Greenify - Premium Eco-Friendly E-Commerce

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-Latest-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind--CSS-v4-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Greenify** is a world-class, premium e-commerce platform designed for the modern plant enthusiast. This project (BIDT Project #15) combines high-end aesthetics with cutting-edge technology to create a seamless, eco-friendly shopping experience.

---

## 🚀 Architectural Highlights

### 🛡️ Zero z-index Architecture
One of the core engineering constraints of this project is the **complete elimination of `z-index`**. Every overlapping element—from the sticky, glassmorphic navigation to complex order summary sidebars—is handled using:
- **Natural DOM Stacking Contexts**: Leveraging the order of elements in the HTML.
- **CSS Grid & Flexbox**: Precision layout positioning.
- **Top Layer API**: Utilizing the native HTML5 `<dialog>` element for all modals and overlays, ensuring they always sit on top without manual layering.

### 🧩 Native `<dialog>` Modals
Instead of bulky third-party libraries or fragile `fixed` div overlays, Greenify uses the **Native HTML5 Dialog API**.
- **Top Layer Support**: Modals are automatically rendered in the browser's top layer.
- **Accessibility**: Built-in keyboard navigation and focus trapping.
- **Styling**: Leverages the `::backdrop` pseudo-element with Tailwind CSS v4's `backdrop-blur` for a premium glassmorphic effect.

### 🔐 Secure API Integration
- **JWT Interceptor Pattern**: Centralized Axios instance with request/response interceptors for automatic Bearer token management and 401 unauthorized handling.
- **Strict Schema Mapping**: Every frontend payload and response model is perfectly synchronized with the FastAPI backend contracts.

---

## ✨ Key Features

### 🤖 AI Plant Doctor
Diagnose your plant's symptoms in seconds. Using a neural-network-backed engine, the AI Doctor provides instant reports on possible diseases, causes, and recommended treatments with confidence scoring.

### 🌸 Custom Bouquet Builder
An interactive arrangement tool. Choose your flower types and color palettes while watching the live price estimation and visual composition update in real-time.

### 📊 SaaS-Level Admin Panel
A comprehensive command center for store owners:
- **Real-time Analytics**: KPI StatCards for revenue, orders, and user growth.
- **Inventory Management**: Advanced product CRUD with native dialog interfaces.
- **Order Tracking**: Visual pipeline management from 'Pending' to 'Delivered'.
- **User Control**: Account status toggling and permission management.

---

## 🛠️ Tech Stack

- **Frontend**: React 18 (Vite)
- **Styling**: Tailwind CSS v4 (Alpha/Experimental features)
- **State Management**: React Context API
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **API Client**: Axios

---

## 📦 Setup & Installation

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [NPM](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

### 2. Clone and Install
```bash
# Clone the repository
git clone https://github.com/your-repo/greenify-frontend.git

# Navigate to the directory
cd greenify-frontend

# Install dependencies
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### 4. Run Locally
```bash
# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## 👨‍💻 Development Team
Developed with ❤️ for **BIDT Project #15**. 

*“Bringing nature closer to you, one pixel at a time.”*
