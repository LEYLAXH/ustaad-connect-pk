# Ustaad Finder 🎓

**Ustaad Finder** is a tutor-discovery web app that helps students and parents across Pakistan find the right local tutor for their subject, budget, and area — without relying on word-of-mouth guesswork.

## The Problem It Solves

Finding a good, affordable tutor nearby is usually a matter of asking around friends and family, with no easy way to compare tutors by subject, price, or location — and no way to know which tutor genuinely fits a specific student's weak areas. Ustaad Finder solves this for **students and parents** searching for tutoring help, and gives them a fast, personalized way to find and reach out to the right match.


## 🔗 Live Demo

**[https://ustaad-connect-pk.lovable.app](https://ustaad-connect-pk.lovable.app)**

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

### System Prompt Used

```
You are a tutor-matching assistant for students in Pakistan. Given a student's 
subject, level, weak topics, budget, and area, and a list of available tutors 
with their subjects, rates, and areas, recommend the top 2-3 best-fit tutors 
with a one-line reason each. Then write a short, natural, polite message 
(2-3 sentences) the student can send to their top match, mentioning their 
specific weak topics and needs. Keep the tone warm and respectful, suited to 
Pakistani parents and students.
```

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
![Homepage]
<img width="1822" height="652" alt="image" src="https://github.com/user-attachments/assets/a3f9bde3-b4b1-40ad-9802-ef800afc0a1f" />
<img width="1806" height="856" alt="image" src="https://github.com/user-attachments/assets/8f428108-0fa2-4948-85a4-647427d179dd" />
<img width="1646" height="822" alt="image" src="https://github.com/user-attachments/assets/fcf414f2-da6c-4bae-91d9-7f1820a5b8ed" />
<img width="1776" height="856" alt="image" src="https://github.com/user-attachments/assets/3f1b76c5-95c0-476c-9413-1b23e78c74c3" />


![Find My Tutor - AI Matching]
<img width="1832" height="860" alt="image" src="https://github.com/user-attachments/assets/71de6711-eb9e-4e40-b074-d314abdb0e43" />
<img width="1747" height="737" alt="image" src="https://github.com/user-attachments/assets/3c7ac85d-1d31-44e8-a6d7-807c4d908dd8" />
<img width="1795" height="827" alt="image" src="https://github.com/user-attachments/assets/e3c0af89-e054-48e5-ac9d-44faa286db53" />
<img width="1637" height="857" alt="image" src="https://github.com/user-attachments/assets/c11309dc-9af0-424c-abcc-1c0f61451e48" />

![Add a Tutor Form]
<img width="1691" height="862" alt="image" src="https://github.com/user-attachments/assets/bdaad9b1-3834-426e-8127-559bf28de02b" />



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




