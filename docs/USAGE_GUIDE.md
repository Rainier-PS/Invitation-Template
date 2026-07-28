# Usage and Customization Guide

This guide walks through how to use the invitation template for your own event. It assumes you have never used GitHub or a form builder before.

## 1. Getting Started

### Create a GitHub account (for GitHub Pages)

If you plan to use GitHub Pages, you need an account:

1. Go to [https://github.com/join](https://github.com/join)
2. Enter a username, email, and password.
3. Verify your email and click Create Account.

For other hosts like Netlify or Vercel, a GitHub account is not required.

### Download the template

1. Go to the [latest release](https://github.com/Rainier-PS/Invitation-Template/releases/latest).
2. Download the ZIP file (for example, `Invitation-Template-v1.1.zip`).
3. Extract it to a folder on your computer.

The folder contains everything you need: `index.html`, `css/invite.css`, `data/event.json`, and the media folder.

## 2. Using the JSON Builder (Easiest Way)

The JSON builder is a form that generates your event data for you. You do not need to edit JSON manually.

1. Open the [JSON Builder](https://rainier-ps.github.io/Invitation-Template/builder.html).
2. Fill in your event name, date, location, images, schedule, and RSVP link.
3. Click Copy or Download to save your configuration.
4. Replace the `data/event.json` in your template folder with the new file.

This is the recommended way for beginners.

## 3. Creating an RSVP Form

You can use any form service. The most common options are listed below.

For details on what questions to include, see the [RSVP Form Guide](RSVP_FORM_STRUCTURE.md).

### Google Forms

1. Go to [https://forms.google.com](https://forms.google.com).
2. Create your RSVP form.
3. Click Send and copy the responder link.
4. Paste the link into the `rsvp.url` field in your event.json.

### Microsoft Forms

1. Go to [https://forms.office.com](https://forms.office.com).
2. Create your form.
3. Click Collect responses and copy the link.
4. Paste it into your event.json.

### Tally

Tally has more options for conditional logic and styling.

1. Go to [https://tally.so](https://tally.so) and create a form.
2. Open Share and choose Embed.
3. Copy the embed URL.
4. Paste it into your event.json.

The website does not check or validate form responses. All validation must be done inside the form provider.

## 4. Editing Event Details (Manual JSON)

If you want to edit the JSON file directly, here is what each field does.

### Event Info

- `title` - Main heading shown on the hero section.
- `subtitle` - Short line under the title.
- `description` - Longer text in the Event Details section.

### Date and Time

- `date` - ISO format like `"2026-12-25"`.
- `startTime` - When the event starts.
- `endTime` - When the event ends (optional).

### Location

- `name` - Venue name.
- `address` - Full address.
- `mapsLink` - Google Maps URL for directions.

### Schedule

Add items to the `schedule` array. Each item has a `time` and a `label`.

```json
{
  "time": "06:00 PM",
  "label": "Dinner"
}
```

### RSVP

- `url` - The embed URL for your form.
- `enabled` - Set to `true` to show the RSVP section.

## 5. Changing Images and Colors

### Images

Place your images in the `media/` folder. Then update the URLs in the `design.heroImages` and `design.sectionBackgrounds` fields in your event.json.

If you upload to GitHub, you can use the raw URL from your repository.

Recommended format: compressed landscape images in WebP or AVIF.

### Colors (Advanced)

If you know CSS, you can edit `css/invite.css`. The main colors are defined as variables in the `:root` section. For example:

- `--primary` - accent color
- `--bg-base` - background color
- `--text` - text color

## 6. Attribution

This project is MIT licensed. You must keep attribution to the original author (Rainier Pearson Saputra). You can change the footer branding, but the credit line must stay visible.

## 7. Hosting Your Site

### GitHub Pages (Free)

1. Push your template folder to a GitHub repository.
2. Go to Settings > Pages.
3. Under Source, select your main branch and root folder.
4. Click Save. Your site will be live at `https://USERNAME.github.io/REPO_NAME`.

### Vercel

1. Sign up at [https://vercel.com](https://vercel.com).
2. Connect your GitHub repository.
3. Vercel deploys the site automatically.

### Netlify

1. Sign up at [https://netlify.com](https://netlify.com).
2. Drag your template folder or connect via GitHub.
3. Netlify hosts the site automatically.

## 8. Summary

1. Download the template ZIP.
2. Use the JSON builder to fill in your event details.
3. Create an RSVP form and add the URL to your event.json.
4. Add your images and customize the colors if needed.
5. Host the site on GitHub Pages, Netlify, or Vercel.

Your invitation should now be live.
