# Contributing Guide

Thank you for your interest in contributing!
This project is an open-source, MIT-licensed **invitation website template** designed to be:

* Easy to customize
* Accessible by default
* Data-driven via JSON
* Framework-free

This guide explains **how to contribute safely without breaking the template contract**.

---

## Project Philosophy

This project follows a strict separation of concerns:

| Layer      | Purpose                       | Expected to Change |
| ---------- | ----------------------------- | ------------------ |
| HTML       | Structure & accessibility     | ❌ Rarely           |
| JavaScript | Data rendering & behavior     | ❌ Carefully        |
| JSON       | Event content & configuration | Always             |
| CSS        | Visual design & theming       | Primary            |

> Most customization should be possible using only CSS and JSON.

---

## What You Can Contribute

### Highly Encouraged

* New CSS themes
* 🖋️ Typography & spacing improvements
* Accessibility improvements
* 🌍 Localization / i18n
* Bug fixes
* Documentation improvements
* ⚡ Performance optimizations

### Please Open an Issue First

* HTML structure changes
* Breaking JSON schema changes
* Removal of accessibility features
* Major JavaScript refactors

---

## Repository Structure (General)

```
/
├─ index.html        # Accessible semantic markup
├─ invite.js         # Core logic (shared by all themes)
├─ invite.css        # Default theme
├─ event.json        # Event configuration
├─ CONTRIBUTING.md
└─ README.md
```

---

## Styling & Theme Contributions

### Styling Philosophy

* The HTML structure is stable
* The JavaScript logic is shared
* CSS defines the personality

CSS should be the primary tool for visual customization. Changes to HTML or JavaScript should be made only when required for structural or functional reasons.

---

### CSS Design Tokens (Recommended Entry Point)

Most themes can be created by overriding variables in `:root`:

```
:root {
  --bg-base: #000000;
  --text: #f8f9fa;
  --muted: #e5e7eb;
  --primary: #ffffff;

  --font-heading: 'Cormorant Garamond', serif;
  --font-body: 'Outfit', sans-serif;

  --radius: 20px;
}
```

Good uses:

* Colors
* Fonts
* Border radius
* Glass / blur strength
* Shadows

Avoid:

* Hard-coding colors inside components
* Removing variables used by JavaScript (for example `--primary`)

---

### Layout & Structure Rules

The core structure exists to guarantee accessibility, navigation, and compatibility.

Do not:

* Rename IDs used by JavaScript
* Remove `section`, `footer`, `address`, or `time` elements
* Break keyboard navigation or focus order

You may:

* Adjust spacing, alignment, and layout flow
* Use parallax scrolling, layered layouts, or scroll-driven effects
* Change background images, gradients, or video backgrounds
* Modify animation timing and easing
* Add theme-specific utility classes or wrappers

If you introduce advanced layout techniques:

* Content must remain readable and reachable
* Effects must degrade gracefully in Simple Mode or reduced-motion mode

---

## Simple Mode (Required)

Simple Mode is mandatory for all themes, but it is intentionally flexible.

It exists as a **graceful fallback**, not a visual downgrade. Its purpose is to ensure the site remains usable and readable for users who prefer clarity over effects.

Guidelines:

* `body.simple` overrides must remain functional
* Content must stay readable without background images
* Contrast must remain accessible
* Larger font sizes must be supported

If you add advanced visual elements:

* They may be simplified, disabled, or flattened in Simple Mode
* Exact visual parity is not required
* Functional parity is required (all content must remain accessible)

You are **not required to redesign Simple Mode**.

If you prefer to focus entirely on the primary visual experience, it is perfectly acceptable to:

* Keep Simple Mode identical to the default implementation
* Apply only minimal readability and contrast fixes
* Treat Simple Mode as a basic, no-frills fallback

Simple Mode is intentionally plain by design. As long as the essential non-negotiables are respected (readability, accessibility, and content completeness), contributors are encouraged to prioritize creativity and experimentation in the main theme.

---

## Motion & Reduced Motion

Creative motion is allowed and encouraged when it enhances the experience.

Examples of acceptable effects:

* Parallax scrolling
* Scroll-linked animations
* Hero transitions
* Background motion or subtle video

All motion must be responsibly handled.

Requirements:

* Respect user preferences using:

```
@media (prefers-reduced-motion: reduce) {
  /* disable, simplify, or remove motion */
}
```

* Motion must not be required to understand content
* Effects must not trap focus or interfere with navigation
* Motion should degrade gracefully when reduced motion is enabled
  must respect user preferences:

```
@media (prefers-reduced-motion: reduce) {
  /* disable or simplify animations */
}
```

Do not add:

* Parallax scrolling
* Uncontrollable auto-motion
* Flashing or rapid animations

---

## Responsive Design

Your changes must work on:

* Small phones (≤ 360px)
* Tablets
* Large desktops

Test especially:

* Countdown layout
* RSVP embeds
* Floating buttons
* Long text wrapping

Avoid:

* Fixed font sizes
* Fixed container heights
* `overflow: hidden` on scrolling regions

---

## Event JSON Configuration

The template is powered entirely by a single JSON file.

General rules:

* New fields must be optional
* Missing fields must fail gracefully
* Breaking changes require discussion

---

### JSON Structure Overview

```
{
  "meta": {},
  "event": {},
  "datetime": {},
  "location": {},
  "schedule": [],
  "rsvp": {},
  "calendar": {},
  "design": {},
  "music": {},
  "footer": {}
}
```

---

## Template Attribution & Forking

This project is MIT licensed.

If you fork the template, publish your own version, or create a derived template, you may change:

* The footer credit text
* The template author name
* Repository links

Example:

Template by Your Name Here

Please do not remove attribution entirely unless required by your own licensing.

---

## Testing Checklist

Before submitting:

* Works with existing HTML and JS unchanged
* JSON loads without errors
* Simple Mode works
* Keyboard navigation works
* Mobile tested
* Reduced motion respected

---

## Submitting a Pull Request

1. Fork the repo
2. Create a new branch
3. Make focused changes
4. Open a PR describing what changed, why it matters, and include screenshots if visual

---

## Code of Conduct

Be respectful and inclusive.

---

## Thank You

This template exists so anyone can edit a JSON file, swap a CSS file, and get a polished, accessible invitation site.

Your contributions help keep that promise.

Happy building

