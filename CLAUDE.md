# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A single-page marketing/landing website for a fictional healthcare clinic, **BlueHaven Health**. Built with plain HTML, CSS, and vanilla JavaScript — no frameworks, no build step, no dependencies to install.

## Running

Open `index.html` directly in a browser (there is no dev server or build). On Windows:

```
Start-Process index.html
```

Images are loaded from remote `images.unsplash.com` URLs, so an internet connection is required for them to appear. After editing, hard-refresh (Ctrl+F5) to bypass the browser cache.

There is no test suite, linter, or package manager configured.

## Architecture

Three files, one page, strict separation of concerns:

- **`index.html`** — semantic markup only. Sections in DOM order: sticky navbar → hero (`#home`) → services (`#services`) → testimonials (`#testimonials`) → enquiry form (`#contact`) → footer. Nav and hero CTAs are in-page anchor links; smooth scroll is CSS-driven.
- **`styles.css`** — all styling. Mobile-first; the design system lives in `:root` CSS custom properties (`--primary` blue, `--teal`, `--accent` amber CTA, spacing/shadow/radius tokens). Responsive breakpoints: `min-width: 640px` / `960px` for grids, and `max-width: 860px` switches the navbar to the hamburger menu.
- **`script.js`** — all behavior, wrapped in an IIFE and loaded with `defer`. Four independent concerns: footer year auto-fill, mobile nav toggle (`aria-expanded`), fade-in-on-scroll via `IntersectionObserver` (reveals `.fade-in` elements once by adding `.is-visible`), and the enquiry form handler.

## Conventions that cross files

- **JS ↔ HTML coupling is by `id`.** `script.js` looks up specific IDs (`enquiryForm`, `navToggle`, `navMenu`, `formStatus`, `year`, and form fields `name`/`email`/`phone`/`date`/`message`). Renaming an element's `id` in the HTML requires updating `script.js` too.
- **Form validation** is client-side only. Required fields are name/email/phone, validated against regexes in `script.js`; errors render into per-field `<span class="error" id="err-<field>">` elements (no `alert()`). Each error `<span>` and the success `#formStatus` use `aria-live` for screen readers.
- **No real backend.** On valid submit the handler builds a `formData` object and `console.log`s it. The place to wire a real API is the clearly marked `// TODO: POST to a real API endpoint here` block in `script.js` — replace the `console.log` with a `fetch()`.
- **Fade-in animations**: any element given the `.fade-in` class is automatically observed and revealed on scroll — no per-element JS needed.
- **Accessibility is a maintained requirement**: every input has a `<label for>`, icons/images carry `alt`/`aria-label`, and there is a `prefers-reduced-motion` fallback in the CSS. Preserve these when editing.
