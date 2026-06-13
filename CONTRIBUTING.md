# Contribution Guide

Thank you for your interest in contributing to SkyHop! Here are some guidelines to help you get started.

## How to Contribute

1. Fork this repository.
2. Clone the forked repository to your local machine:
   ```bash
   git clone https://github.com/username/skyhop.git
   ```
3. Create a new branch:
   ```bash
   cd skyhop
   git checkout -b your-branch-name
   ```
4. Make your changes.
5. Commit with a [conventional commit](https://www.conventionalcommits.org/) message:
   ```bash
   git add .
   git commit -m "feat: add new power-up type"
   ```
6. Push to your fork and open a Pull Request.

## Coding Guidelines

- SkyHop is vanilla JS — no frameworks, no build step.
- Keep code minifiable: no trailing semicolons, single-line functions where reasonable.
- Use `camelCase` for variables and functions.
- Test your changes by opening `index.html` in a browser.

## Reporting Issues

Open a [GitHub Issue](https://github.com/shadvls/skyhop/issues) with:
- What happened vs what you expected
- Steps to reproduce
- Browser + OS

<br>
Thanks for contributing!
