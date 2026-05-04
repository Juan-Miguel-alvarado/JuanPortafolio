# juan@github ~ portfolio

Personal portfolio — React + Vite + anime.js v4.  
Two themes: **Catppuccin Mocha** (warm purple) and **Dark Miasma** (cold void).

## Stack

- React 18 + Vite
- anime.js v4 (animate, createTimeline, stagger)
- Plain CSS with CSS custom properties
- JetBrains Mono + Orbitron (Google Fonts)

## Setup

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
```

## Structure

```
src/
  components/
    Hero/       — neofetch-style terminal, typewriter animation
    About/      — cat ~/about.md, stagger word reveal
    Skills/     — paru-style package install, animated bars
    Projects/   — terminal cards with ls + git log
    Contact/    — echo prompt with blinking cursor
    Nav/        — fixed top nav, blur on scroll
    ThemeToggle/— mocha <-> miasma with anime.js transition
  styles/
    variables.css  — all CSS custom properties, both themes
    global.css     — reset, scrollbar, CRT scanlines, shared classes
  hooks/
    useTheme.js        — theme toggle + localStorage
    useScrollReveal.js — IntersectionObserver + anime.js stagger
```

## Theme toggle

Top-right button switches between Catppuccin Mocha and Dark Miasma.  
Preference stored in `localStorage` under key `portfolio-theme`.
