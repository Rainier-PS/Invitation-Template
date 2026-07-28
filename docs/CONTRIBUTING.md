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
  index.html         - the invitation page
  css/invite.css       - default theme
  data/event.json      - your event data
  js/builder.js        - the online JSON builder
  js/index.js          - homepage scripts
  js/demo/             - demo page scripts
  demo/                - demo HTML pages
  docs/                - documentation
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
