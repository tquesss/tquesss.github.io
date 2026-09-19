# tquess.github.io

My personal portfolio site built with plain HTML, CSS, and vanilla JavaScript. 

I wanted a dark, minimalist layout with a developer aesthetic and a few clean interactive features—without the overhead of heavy frameworks like React or build tools.

## What's Inside

- **Vanilla Stack:** No `npm install`, no bundlers. Just standard Web APIs, CSS grids, and clean JavaScript.
- **Live Discord & Spotify Status:** Pulls my current Discord status and active Spotify track in real time via the [Lanyard API](https://github.com/phipson/lanyard).
- **Text Scramble Header:** A custom matrix-style character scramble effect on the hero title.
- **Smooth Inertia Scroll:** Integrated [Lenis](https://lenis.darkroom.engineering/) for momentum-based scrolling.
- **Email Copy Toast:** One-click copy for contact email with a lightweight toast notification.

## Project Structure

```text
├── index.html       # Layout & semantic structure
├── style.css        # Glassmorphism theme, layout & keyframe animations
├── script.js        # Text scramble, Lanyard API fetch & toast logic
└── README.md
