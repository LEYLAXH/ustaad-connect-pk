# Ustaad Finder 🎓

**Ustaad Finder** is a tutor-discovery web app that helps students and parents across Pakistan find the right local tutor for their subject, budget, and area — without relying on word-of-mouth guesswork.

## The Problem It Solves

Finding a good, affordable tutor nearby is usually a matter of asking around friends and family, with no easy way to compare tutors by subject, price, or location — and no way to know which tutor genuinely fits a specific student's weak areas. Ustaad Finder solves this for **students and parents** searching for tutoring help, and gives them a fast, personalized way to find and reach out to the right match.


## 🔗 Live Demo

**[https://ustaad-connect-pk.lovable.app]**

## ✨ Features

- **Authentication** — Email/password sign up and log in via Supabase Auth, with session-aware navbar (log in/out, user identity)
- **Browse & Search** — View all tutors in a clean card layout showing name, subjects, area, rate, and experience
- **Filter** — Filter tutors by subject and area/city
- **Tutor Profiles** — Full profile page per tutor with details; contact info (phone/email) is only visible to logged-in users, protecting tutors from public scraping
- **Add a Tutor** — Only logged-in users can list a tutor, through a simple form (name, subjects, area, city, rate, experience, contact info, about); each listing is linked to its creator's account
- **Reviews & Ratings** — Only logged-in users can leave a 1-5 star rating and comment on a tutor's profile, one review per user per tutor (prevents duplicate/fake reviews); average rating is calculated and displayed
- **Verified Tutor Badge** — A manually admin-confirmed badge shown on trustworthy tutor profiles (separate from user-submitted ratings)
- **Top Rated Section** — Homepage highlights the top 3 highest-rated tutors based on genuine, authenticated reviews
- **Find My Tutor (AI Feature)** — Students describe their needs and get an AI-powered tutor match + ready-to-send outreach message (see below)
- **Row-Level Security** — Database access rules ensure public visitors can only read tutor/review data (excluding private contact info), while writes (adding tutors, reviews) require authentication
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
![Homepage]
<img width="1741" height="867" alt="image" src="https://github.com/user-attachments/assets/3bb4870e-b641-4811-b63b-2f96c0e56a23" />
<img width="1736" height="857" alt="image" src="https://github.com/user-attachments/assets/c020b7c9-efa6-45ff-93a8-3eb1f7e0b34c" />
<img width="1706" height="852" alt="image" src="https://github.com/user-attachments/assets/653688f7-dfea-4a66-b245-e380a13fbe88" />


![Find My Tutor - AI Matching]
<img width="1527" height="757" alt="image" src="https://github.com/user-attachments/assets/9d3e230e-2fc4-4b0b-b228-6bb5c52862e8" />
<img width="1547" height="746" alt="image" src="https://github.com/user-attachments/assets/0f248eb2-d5ad-43d3-91ef-071cdce8492b" />
<img width="1627" height="872" alt="image" src="https://github.com/user-attachments/assets/f32bfef5-5b40-4638-8189-766254a0ecf7" />

![Add a Tutor Form]
<img width="1662" height="865" alt="image" src="https://github.com/user-attachments/assets/52e4c696-747f-4aee-beb4-ec5e1f4df942" />


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




