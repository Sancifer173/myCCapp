# CCNA 200-301 Study Hub (PWA for Samsung Phone & iPad)

An offline-capable, zero-build **Progressive Web App (PWA)** designed specifically to work smoothly on **Samsung Android phones** (portrait mobile + bottom tab bar) and **iPads** (landscape/portrait tablet + left navigation rail).

## Features Included
- **Dashboard & Exam Readiness**: Weighted readiness ring across all 6 official CCNA 200-301 v1.1 domains, study streak tracker, target exam countdown, and weakest-domain quick drill.
- **Practice Exams & Topic Quizzes (506 Questions)**: Covers all 6 CCNA domains (Full/Hot sets, Drag & Drop matching, and 274 exhibit/diagram references), Study Mode and Timed Exam Simulation Mode, bookmarks, missed-question review, Hong Kong-style Traditional Chinese teaching explanations (`【核心概念】 / 【點解啱】 / 【點解其他選項唔啱】`), and direct **KW pt.** review links after answering.
- **Knowledge point (KW pt.)**: Bilingual English & Traditional Chinese CCNA knowledge database (48 core topics) distilled from all 13 PDFs in `CCNA Handout 2026` (`Ch01`–`Ch10` + 3 Lab Sheets), complete with CLI cheatsheets, exam traps, review tracking, and 1-click related practice launch.
- **All in one (Obsidian-style Knowledge Map)**: Interactive visual concept graph (`48` nodes, `73` semantic connections) across all 6 domains with pan/zoom/drag, local neighbor focus, searchable backlinks, and bilingual explanations of how concepts relate.
- **Spaced-Repetition Flashcards (60 Cards + Custom Cards)**: SM-2 scheduling (`Again / Hard / Good / Easy`) with 3D tap-to-flip cards and iPad keyboard shortcuts (`Space` to flip, `1-4` to rate).
- **Interactive Subnetting & IPv6 Trainer**: Endless IPv4 subnetting speed drill with magic-number binary breakdowns, a quick IPv4 CIDR calculator, and an IPv6 compression/expansion drill.
- **Cisco IOS CLI Labs (7 Scenarios)**: Interactive terminal supporting Cisco IOS abbreviations (`conf t`, `int g0/1`, `no sh`, `?`) plus mobile-friendly tap chips for VLANs/Trunks, Port Security, OSPFv2, Router-on-a-Stick, DHCP, PAT/NAT, and SSHv2 hardening.
- **Samsung <-> iPad Progress Sync & Notes**: One-tap **Sync Code** (copy/paste via WhatsApp, Telegram, Apple Notes, or Google Keep) and **JSON export/import** with smart progress merging, plus per-domain study notes.

## Easiest Way to Use on Samsung Phone & iPad (Free HTTPS Hosting)
To install as a full-screen offline app on **both** Android and iPadOS, host the folder over HTTPS (takes ~30 seconds, no Node/build tools needed):
1. **Netlify Drop**: Go to https://app.netlify.com/drop and drag-and-drop the `ccna-study-hub` folder. You immediately get an `https://...netlify.app` URL.
   *(Alternatives: GitHub Pages or Cloudflare Pages.)*
2. **Install on Samsung Phone**: Open your URL in **Chrome** or **Samsung Internet** -> tap **⋮ Menu** -> **Install app** (or **Add page to -> Home screen**).
3. **Install on iPad**: Open the same URL in **Safari** -> tap **Share** (square with up arrow) -> **Add to Home Screen**.

> **Note if updating an existing PWA install**: Open the app online once and refresh so Service Worker `v4` (`ccna-study-hub-v4`) pre-caches all 287 exam exhibit images for offline use.

## Local Preview on Windows PC
Run the included zero-dependency PowerShell server:
```powershell
powershell -ExecutionPolicy Bypass -File .\start-local-server.ps1
```
Then open `http://localhost:8080/` in your browser.
