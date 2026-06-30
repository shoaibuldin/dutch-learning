DUTCH A2 — READING SPRINT
=========================
A personal trainer for the inburgering A2 reading (Lezen) exam — for you and
your wife. It uses real spaced repetition (the kind Anki uses), so words you
know get retired and STOP repeating, while words you miss come back until they
stick. Target date: 29 July 2026.

WHAT'S IN THIS FOLDER
- index.html ............... the app (open this)
- deploy.bat .............. one-click: put the app online + sync across devices
- Start-Dutch-App.bat ..... run it on your phone over home WiFi (no internet host)
- dutch-a2-anki-deck.csv .. optional vocab for the Anki app
- backend/ ................ the cloud sync + AI-tailoring pieces
- README - how to use.txt . this file


USE IT RIGHT NOW ON YOUR PC
1. Double-click  index.html  -> opens in your browser.
2. Add a profile (your name), add a second for your wife.
3. Study. Everything saves in that browser automatically.
   (No internet, no key, nothing to set up — the smart flashcards and reading
    practice all work offline.)


THE SMART PART (what changed)
- Flashcards now use real spaced repetition:
    Again  = you forgot -> it comes back in a moment (same round)
    Good   = you knew it -> spaced out (days, then weeks)
    Easy   = knew it easily -> spaced out further
    I know this ✓ = retire it -> you will NOT see it again before the exam
  Words you know stop repeating. Words you miss are drilled until they stick.
- Reading -> "🎯 Focus on my weak words" picks texts loaded with the words you
  personally keep missing.
- 265 vocab words (with example sentences) + 42 exam-format reading texts,
  all written and fact-checked for A2.


SYNC ACROSS ALL DEVICES + PRIVATE LOGIN  (recommended)
This turns the app into a private website with ONE login that you and your wife
share, and your progress follows you onto any phone or computer.

  1. You need a free Cloudflare account (cloudflare.com) — sign up once.
  2. Open a terminal in this folder and run:   npx wrangler login
     -> approve in the browser (connects to YOUR Cloudflare).
  3. Double-click  deploy.bat
     -> it asks you to pick a username + password (your private login),
        then puts the app online and prints a link like
        https://dutch-learning.<you>.workers.dev
  4. Open that link on any device, log in once, and study. Progress syncs.

  To update the app later: double-click deploy.bat again.


AI TAILORING ON YOUR MAX PLAN  (no API key, no per-use cost)
After sync is set up, a scheduled run on your Claude Max plan can study how you
and your wife are each doing and write fresh reading practice from the exact
words you each keep missing — it appears in the app as the "✨ personalized" set.
See backend/TAILORING-ROUTINE.md. (A web page can't use the Max plan directly,
so this runs inside Claude Code, which your Max plan already covers.)


USE IT ON YOUR PHONE OVER HOME WIFI (if you skip the cloud step)
1. On the PC, double-click  Start-Dutch-App.bat  (needs Python installed).
2. It shows an address like  http://192.168.1.23:8000
3. On your phone (same WiFi), open that address. Keep the black window open.
   Note: the phone keeps its own progress unless you use the cloud sync above,
   or Progress -> Export/Import to move it.


MOVING PROGRESS WITHOUT THE CLOUD
- Progress tab -> "Export" saves a small file; "Import" it on the other device.

Veel succes! (Good luck!)
