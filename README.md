# Genius

Genius is a polished AI productivity workspace built with Next.js. It brings together image generation, resume analysis, email generation, and app settings into one interface with a left sidebar dashboard and focused feature pages.

## Overview

The app is organized around four core workflows:

- Image generation with prompt, style, aspect ratio, and variation controls.
- Resume analysis with ATS scoring, keyword matching, and improvement suggestions.
- Email generation with recipient, tone, length, and prompt-driven draft creation.
- Settings and usage tracking for free generation limits.

## Screenshots

### 1. Dashboard

![Dashboard](public/Screenshot%20(1167).png)

The dashboard is the main landing page. It introduces the product and links into each workspace area from large, clickable cards.

### 2. Image Generation

![Image Generation](public/Screenshot%20(1171).png)

The image generator lets you enter a prompt, pick a style, choose an aspect ratio, and request multiple variations. Generated results appear in a grid with copy actions.

### 3. Resume Analyzer

![Resume Analyzer](public/Screenshot%20(1172).png)

The resume analyzer accepts a resume upload or pasted text, compares it against a target role, and returns an ATS score with a detailed breakdown and recommendations.

### 4. Email Generator

![Email Generator](public/Screenshot%20(1174).png)

The email generator helps draft professional messages by combining the goal, recipient, tone, length, and key points into a ready-to-use email.

## Features

- Modern sidebar navigation with active route highlighting.
- Dashboard cards for fast access to each AI tool.
- Image generation UI with prompt input and generated image history.
- Resume analysis UI with scoring, strengths, and areas to improve.
- Email generation UI with subject suggestions and copy/download actions.
- Free generation counter with upgrade prompt in the sidebar.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod

## Project Structure

- `app/` contains the app router pages, layouts, and API routes.
- `components/` contains shared UI pieces such as the sidebar and image cards.
- `public/` stores static assets and screenshots used in this README.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` starts the local development server.
- `npm run build` creates a production build.
- `npm run start` runs the production server.
- `npm run lint` runs ESLint.

## Notes

- The screenshots are referenced directly from the `public/` folder so they will render correctly on GitHub.
- If you add more screenshots later, keep the naming consistent and update the order in this README.

## Deployment

This project can be deployed like any standard Next.js app. A common path is:

1. Push the repository to GitHub.
2. Connect the repo to Vercel.
3. Set any required environment variables.
4. Deploy the production build.
