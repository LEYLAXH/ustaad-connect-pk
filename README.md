# Ustaad Finder 🎓

**Ustaad Finder** is a tutor-discovery web app that helps students and parents across Pakistan find the right local tutor for their subject, budget, and area — without relying on word-of-mouth guesswork.

## The Problem It Solves

Finding a good, affordable tutor nearby is usually a matter of asking around friends and family, with no easy way to compare tutors by subject, price, or location — and no way to know which tutor genuinely fits a specific student's weak areas. Ustaad Finder solves this for **students and parents** searching for tutoring help, and gives them a fast, personalized way to find and reach out to the right match.

## 🔗 Live Demo

**[https://ustaad-connect-pk.lovable.app](https://ustaad-connect-pk.lovable.app)**

## ✨ Features

- **Browse & Search** — View all tutors in a clean card layout showing name, subjects, area, rate, and experience
- **Filter** — Filter tutors by subject and area/city
- **Tutor Profiles** — Full profile page per tutor with details and a direct contact option
- **Add a Tutor** — Anyone can list a tutor through a simple form (name, subjects, area, city, rate, experience, contact info, about)
- **Reviews & Ratings** — Students can leave a 1-5 star rating and comment on any tutor's profile; average rating is calculated and displayed
- **Verified Tutor Badge** — Tutors with 3+ reviews and a rating above 4.0 automatically get a "Verified" badge
- **Top Rated Section** — Homepage highlights the top 3 highest-rated tutors
- **Find My Tutor (AI Feature)** — Students describe their needs and get an AI-powered tutor match + ready-to-send outreach message (see below)
- Fully responsive, mobile-friendly design

## 🤖 The AI Feature: "Find My Tutor"

This is the core AI-powered feature of the app. A student fills out a short form with:
- Subject needed
- Their level (School / Matric / O-Level / A-Level / University)
- Weak topics (free text)
- Budget per hour
- Preferred area/city

The app sends this, along with the live list of tutors from the database, to the **Gemini API**, which returns:
1. The **top 2-3 best-fit tutors** from the directory, each with a one-line reason why they match
2. A **short, personalized outreach message** the student can copy and send directly to their top match

### System Prompt Used
The API key is stored securely as an environment variable and is never committed to this repository.

## 🛠️ Tools, Services & Models Used

| Purpose | Tool/Service |
|---|---|
| App builder | [Lovable](https://lovable.dev/) |
| Frontend | React, TypeScript, Tailwind CSS, TanStack Start |
| Database | Supabase |
| AI model | Google Gemini API |
| Hosting/Deployment | Lovable (published app) |
| Version control | GitHub |

## 📸 Screenshots

![Homepage](./screenshots/homepage.png)
![Find My Tutor - AI Matching](./screenshots/find-my-tutor.png)
![Add a Tutor Form](./screenshots/add-tutor.png)

## 🚀 How to Run This Project Locally

You need [Node.js](https://nodejs.org/) and npm installed (recommended via [nvm](https://github.com/nvm-sh/nvm#installing-and-updating)).

```bash
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

You'll also need to set up your own environment variables for Supabase and the Gemini API key (see `.env.example` if present, or Lovable's project settings) — **never commit real API keys to this repository.**

## Built With

- TanStack Start
- TypeScript
- React
- Tailwind CSS
- Supabase
- Google Gemini API
