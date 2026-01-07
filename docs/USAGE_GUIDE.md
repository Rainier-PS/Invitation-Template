# Usage & Customization Guide

This guide explains how to use and customize the Invitation Website for your own events.

## 1. Modifying Event Details (`event.json`)

Almost all content on the website is controlled via `event.json`. Here is a breakdown of the key sections:

### Event Info
- `title`: The main heading of your invitation.
- `subtitle`: A short description below the title.
- `description`: The detailed text for the "Event Details" section.

### Date & Time
- `date`: Format it as you wish (e.g., "Saturday, June 12, 2026").
- `startTime`: Starting time of the event.
- `endTime`: Optional ending time.

### Location
- `name`: Venue name.
- `address`: Full address for the location.
- `mapsLink`: Link to Google Maps for the address.

### Schedule
Add items to the `schedule` array to list activities:
```json
{
    "time": "00:00 PM",
    "label": "Activity 1"
}
```

### RSVP (Tally.so)
- `url`: Replace with your own Tally form embed URL.
- **Important**: We recommend creating your own Tally form to manage your guests. See [TALLY_FORM_STRUCTURE.md](TALLY_FORM_STRUCTURE.md) for a recommended setup.

## 2. Visual Customization

### Images
Replace the URLs in the `design.heroImages` and `design.sectionBackgrounds` arrays with your own image URLs. For best results, use high-resolution landscape images.

### Colors & Styling
You can modify the general look and feel in `styles.css`.
- **CSS Variables**: Check the `:root` section in `styles.css` to change primary colors and fonts.
- **Glassmorphism**: Adjust the `--glass-bg` and `--glass-border` variables to change the transparency of panels.

## 3. Attribution Rules

This project is open-source, but proper attribution is required as per the MIT license.

- **Footer Branding**: You are free to modify the footer to match your event's branding or your own logo.
- **Attribution**: You must keep the "Created & Designed by Rainier Pearson Saputra" text or a similar clear link back to the original author in your version.

## 4. Deployment

Since this is a static website, you can host it for free on:
- [GitHub Pages](https://pages.github.com/)
- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)

Simply upload all files (`index.html`, `styles.css`, `script.js`, `event.json`, and the `docs/` folder) to your repository or hosting provider.
