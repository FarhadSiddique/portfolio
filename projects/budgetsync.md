---
id: budgetsync
title: "BudgetSync"
status: active
visibility: public
tagline: "Mobile budget tracker with Google Sheets sync and multi-provider AI categorization."
stack: ["React Native", "TypeScript", "Expo", "Google Sheets API", "Claude API", "OpenAI API", "Gemini API", "expo-router", "expo-secure-store", "expo-auth-session"]
category: mobile-app
started: 2025-01
last_updated: 2026-03-09
repo: null
live_url: null
featured: true
highlight_order: 1
---

## What it does

BudgetSync is a mobile app for tracking monthly expenses and pushing categorized data to a personal Google Sheet. It supports CSV import from credit card statements, AI-assisted transaction categorization, and a multi-provider AI client that works with Claude, OpenAI, and Gemini.

## Why I built it

I was frustrated with budgeting apps that lock your financial data inside their ecosystem. I wanted full control — raw data in a spreadsheet I already use, with automation on top of it rather than instead of it.

## Technical challenges

- Implementing Google OAuth for Sheets access without a backend, using expo-auth-session in a bare Expo app
- Building a provider-agnostic AI client that works identically across three different API formats (Anthropic, OpenAI, Google)
- Managing secure credential storage (API keys, OAuth tokens) that persists correctly across app restarts with expo-secure-store
- File-based routing with expo-router, mirroring the Next.js App Router pattern in a React Native context

## Current status

Core settings, credential management, and AI client are complete. CSV import, transaction review, and Google Sheets sync are in progress.
