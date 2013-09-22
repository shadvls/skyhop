# SkyHop

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white&style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white&style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black&style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Canvas](https://img.shields.io/badge/Canvas-000000?logo=html5&logoColor=white&style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
[![License](https://img.shields.io/badge/License-MIT-red.svg?style=flat-square)](LICENSE)

[![Play](https://img.shields.io/badge/Play-SkyHop-000000?style=flat-square)](https://shadvls.github.io/skyhop)

A side-scrolling flappy-style browser game built entirely with vanilla HTML5, CSS3, and JavaScript. Fly through obstacles, unlock skins, and compete on the leaderboard.

## Project Structure

| Path | Description |
|---|---|
| `index.html` | Application shell |
| `css/style.css` | Styles and layout |
| `js/game.js` | Game logic and rendering |
| `CONTROLS.md` | Key bindings and touch controls |
| `LICENSE` | MIT license |

## Tech Stack

- **HTML5** — Canvas rendering, semantic markup
- **CSS3** — Responsive layout, touch optimizations
- **JavaScript** — Game loop, physics, audio (Web Audio API), localStorage persistence

## Features

- Gravity-based bird physics with smooth easing
- Procedural pipe generation with dynamic difficulty
- High score tracking via localStorage
- 5 unlockable bird skins (yellow, red, blue, gold, raven)
- 5 visual themes (default, sunset, midnight, arctic, swamp)
- 3 powerups (slow motion, shield, score multiplier)
- 4 difficulty levels (easy, normal, hard, insane)
- Web Audio API sound effects
- Particle system for visual feedback
- Screen shake, flash, and slow-mo effects
- Top 10 leaderboard with LocalStorage persistence
- Responsive canvas for mobile and desktop
- Touch, mouse, and keyboard input

## How to Play

1. **Tap** or **press Space** to flap and stay airborne
2. Navigate through the pipe gaps to score points
3. Collect powerups to gain temporary advantages
4. Unlock new skins by reaching score milestones
5. Compete for the top spot on the leaderboard

## Development Timeline

| Period | Milestone |
|---|---|
| Apr 2013 | Project scaffold, canvas setup, game loop |
| May 2013 | Bird physics, pipes, collision detection |
| Jun 2013 | Game states, visual polish, audio system |
| Jul 2013 | Particles, effects, performance optimization |
| Aug 2013 | Refactoring, `.gitignore`, controls documentation |
| Sep 2013 | Skin system, theme system, UI selectors |
| Oct 2013 | Powerups, difficulty levels, dynamic scaling |
| Nov 2013 | Leaderboard, mobile support, responsive canvas |
| Dec 2013 | README, LICENSE, final polish, v1.0 release |

## License

**MIT** — See [LICENSE](LICENSE).
