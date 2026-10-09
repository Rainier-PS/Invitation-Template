# Contributing Guide

Thanks for wanting to contribute. This is an open source invitation template. You can customize it through CSS and JSON without touching the HTML or JavaScript.

## What this project is about

The template follows a simple structure:

- HTML holds the page structure. It rarely changes.
- JavaScript reads the JSON and renders content. Change it carefully.
- JSON holds your event data. This is what you edit most of the time.
- CSS changes the look of the page. This is where most contributions happen.

If you want to add a new theme or improve the design, start with CSS. If you find a bug, open an issue first before making big changes.

## What you can work on

### Good for first time contributors

- New CSS themes or color variations
- Typography and spacing fixes
- Accessibility improvements (better contrast, keyboard support)
- Bug fixes
- Better documentation
- Performance improvements

### Open an issue first if

- You want to change the HTML structure
- You want to change the JSON schema
- You plan to remove accessibility features
- You want to refactor the JavaScript heavily

## How the files are organized

```
/
  index.html           - the project homepage with the demo carousel
  builder.html         - the online JSON builder
  privacy.html         - privacy policy page
  css/                 - styles for the homepage, builder, and invitations
  data/                - demo and sample event data
  js/                  - homepage and builder scripts
  js/demo/             - demo page scripts
  demo/                - demo HTML pages
  media/               - images and audio
  docs/                - documentation
  sitemap.xml          - sitemap for search engines
  robots.txt           - crawler rules
```

## Styling tips

Most themes can be built by changing CSS variables in `:root`:

```css
:root {
  --bg-base: #000000;
  --text: #f8f9fa;
  --primary: #ffffff;
  --font-heading: 'Cormorant Garamond', serif;
  --font-body: 'Outfit', sans-serif;
  --radius: 20px;
}
```

Try to avoid hardcoding colors inside components. If you change a variable, make sure nothing breaks.

## Simple Mode

All themes must support Simple Mode. This is a fallback for users who prefer a plain, readable layout with no background images or effects. It does not need to look fancy. It just needs to work and stay readable.

Requirements:

- Content must be readable without background images
- Contrast must be accessible
- Font sizes must be large enough

## Code style

These rules apply to every file in this repository:

- Do not write comments in the code.
- Do not use em dashes in any user-facing text, such as documentation, the privacy policy, or page content. Use commas, hyphens, or separate sentences instead.
- The homepage settings panel (Ctrl + ,) is the single control for motion and theme. The motion toggle and the navbar theme toggle must stay in sync with it.
- Overlays, modals, and dialogs must be closable with the Escape key, by clicking outside the panel, and with a visible close button.

## Reduced motion

If you add animations, respect user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  /* turn off or simplify animations */
}
```

Do not add flashing content, auto-playing motion, or parallax scrolling that can not be disabled.

## Responsive design

Test your changes on:

- Small phones (360px width)
- Tablets
- Large desktop screens

Pay attention to the countdown layout, RSVP form, and floating buttons.

## JSON rules

If you add new fields to the JSON:

- They must be optional
- If a field is missing, the page should still work normally
- Big changes to the schema need a discussion first

## Before submitting

Check that:

- The existing HTML and JS still work with your changes
- JSON loads without errors
- Simple Mode still works
- Keyboard navigation still works
- Mobile layout looks okay
- Reduced motion preference is respected

## How to submit

1. Fork the repository.
2. Create a branch for your changes.
3. Make focused commits.
4. Open a pull request. Describe what you changed and why. If it changes how things look, add a screenshot.

## Code of Conduct

Be respectful. This is a small open source project. Everyone is here to learn and help.

## Thank you

Contributions help make this template better for everyone. Thanks for taking the time.
