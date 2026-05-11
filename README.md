# TechNest - Premium Electronics eCommerce

TechNest is a visually stunning, production-ready eCommerce web application built with Next.js (App Router), TypeScript, and MongoDB.

## Features

- **Next.js 14+**: App Router, Server Components, API Routes
- **UI/UX**: Tailwind CSS v4, Framer Motion, next-themes (Dark mode support)
- **State Management**: Zustand (Cart & Auth)
- **Authentication**: JWT via HttpOnly Cookies
- **Database**: MongoDB & Mongoose
- **Design System**: Glassmorphism, tailored color palettes, Sora & DM Sans fonts

## Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Ensure `.env.local` is present at the root of the project with:
   ```env
   MONGODB_URI=mongodb://localhost:27017/technest
   JWT_SECRET=supersecretjwtkey12345
   JWT_EXPIRES_IN=7d
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Seed the Database**
   Run the seed script to populate the database with dummy users and products:
   ```bash
   npm run seed
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Test Credentials

- **Admin Account**: `admin@technest.com` / `Admin@123`
- **User Account**: `user@technest.com` / `User@123`
