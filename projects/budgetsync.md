---
id: budgetsync
title: "BudgetSync"
status: active
visibility: public
tagline: "Mobile budgeting app that imports credit card statements, categorizes transactions with AI, and syncs to Google Sheets."
stack: ["React Native", "TypeScript", "Expo", "Expo Router", "Google Sheets API", "Google OAuth", "AsyncStorage", "expo-secure-store", "Claude API", "OpenAI API", "Gemini API", "xlsx"]
category: mobile-app
started: 2025-01
last_updated: 2026-03-09
repo: https://github.com/FarhadSiddique/budgetsync
live_url: null
video_url: null
featured: true
highlight_order: 1
---

## What it does

BudgetSync is a mobile app that replaces a manual Excel budgeting workflow with an automated, AI-powered system. It:

- Imports credit card statements (TD and Amex CSV formats) via expo-document-picker and parses them with the xlsx library
- Auto-categorizes transactions using AI — sends all transactions in one call and returns a structured JSON response with category, subcategory, and confidence
- Suggests monthly projected budgets based on the last 3 months of actual spending, with AI-generated explanations for each suggestion
- Syncs to a personal Google Sheet matching an existing tracker layout with income, expense categories, projected vs actual columns, and monthly balance summaries
- Supports 9 expense categories: Essentials, Transportation, Food, Entertainment, Personal Care, Gifts & Donations, Loans, Savings, Legal — each with projected and actual tracking

## Why I built it

I was managing a detailed monthly budget in Excel — tracking projected vs actual spend across 9 categories, syncing credit card statements manually, and running the same calculations every month. The process worked but was tedious. BudgetSync automates the repetitive parts while keeping full data ownership: everything syncs to a personal Google Sheet I control, with no third-party data sharing.

## Technical challenges

- Provider-agnostic AI client: single `askAI(prompt)` function that routes to Claude (claude-sonnet-4-20250514), GPT-4o, or Gemini 1.5 Flash based on user preference — each with different API formats and response schemas
- Google OAuth without a backend: implemented Google Sheets authentication using expo-auth-session with scopes for Sheets, Drive, email, and profile — access token stored securely in expo-secure-store
- CSV parsing across card formats: TD and Amex use different column layouts (TD: Date/Description/Debit/Credit, Amex: Date/Description/Amount) — normalized to a common transaction schema using the xlsx library
- Secure credential storage: API keys, OAuth tokens, spreadsheet ID, salary, and fixed costs all stored in expo-secure-store with typed key constants, surviving app restarts
- File-based routing with expo-router: 6-tab navigation (Home, New Month, Import, Review, Sync, Settings) mirroring the Next.js App Router pattern in a React Native context

## Current status

**Completed:** App shell, 6-tab navigation, Settings screen (AI provider selector, Google OAuth, budget preferences, danger zone), AI abstraction layer, secure credential storage, Google Cloud project setup (Sheets API + Drive API enabled, OAuth consent screen configured).

**In progress:** Local data storage layer (`lib/storage.ts`), Home screen with income/expense cards and progress bars, New Month setup with AI suggestions, CSV import and AI categorization flow, Google Sheets sync.