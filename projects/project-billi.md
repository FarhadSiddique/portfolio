---
id: project-billi
title: "Project Billi"
status: active
visibility: public
tagline: "AI-powered Telegram bot and agent system to plan and execute a cat influencer business from scratch."
stack: ["TypeScript", "Next.js", "Node.js", "Claude API", "Telegram Bot API", "GitHub API", "Vercel"]
category: automation
started: 2026-03
last_updated: 2026-03-13
repo: null
live_url: null
video_url: null
featured: false
highlight_order: null
---

## What it does

Project Billi is an AI agent system built to plan and execute a cat influencer business end-to-end. It consists of two components:

- A **real-time Telegram bot** deployed on Vercel that lets you converse with an AI project manager from your phone. Report progress, ask for advice, get content ideas, and update your plan — all via chat.
- A **daily scheduled agent** that runs every morning, evaluates completed to-dos, updates the master plan, and generates a fresh prioritized task list.

The bot uses the GitHub API as persistent storage, reading and writing `plan.md` and `todo.md` in a private repo so the plan stays current across sessions.

## Why I built it

I wanted to get a Blue Point Ragdoll cat and grow it into a sponsored Instagram account — but the research, planning, and execution across breed sourcing, content strategy, Instagram growth, and brand sponsorships is genuinely complex. Instead of a static document, I built an AI agent that acts as a living project manager: context-aware, updated daily, and accessible from my phone at any time.

## Technical challenges

- Stateless serverless architecture on Vercel: since functions have no persistent storage, all state is managed through the GitHub Contents API with SHA-based optimistic locking to avoid write conflicts.
- Designing a Claude prompt that reliably returns structured file updates (using XML tags) alongside conversational responses, so the bot can update files and reply in a single API call.
- Parsing and maintaining rolling conversation history within token limits while keeping the full plan and todo list as live context on every message.

## Current status

Live and running. The Telegram bot is deployed at billi-bot.vercel.app and responds in real time. The daily scheduled agent runs via Windows Task Scheduler. Currently in Phase 1: breeder research and Instagram account setup.
