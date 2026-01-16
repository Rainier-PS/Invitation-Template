# Usage & Customization Guide

This guide explains how to use and customize the Invitation Website for your own events.  
It assumes no prior knowledge of GitHub, web hosting, or form builders. Follow each step carefully.

---

## 1. Getting Started

If you plan to host on **GitHub Pages**, you’ll need a GitHub account:  

### Step 1: Create a GitHub Account
1. Go to [https://github.com/join](https://github.com/join)  
2. Fill in your username, email, and password.  
3. Complete the verification steps and click **Create Account**.

> For hosts like Netlify or Vercel, a GitHub account is optional.

### Step 2: Downloading the Template
1. Go to the latest release on GitHub: [Releases](https://github.com/Rainier-PS/Invitation-Template/releases/latest)  
2. Download the ZIP file (e.g., `Invitation-Template-v1.1.zip`)  
3. Unzip it to a folder on your computer

> All necessary files (`index.html`, `styles.css`, `script.js`, `event.json`, `/media/`) are included.

---

## 2. Using the JSON Form Builder (Recommended)

To simplify editing, use the **visual JSON builder**:

1. Go to: [JSON Builder Form](https://rainier-ps.github.io/Invitation-Template/builder.html)  
2. Fill in your event details, images, colors, schedule, RSVP form URL, etc.  
3. Click **Export JSON** to generate your `event.json`.  
4. Replace the `event.json` in your repository with the exported version.

> This is the easiest way for beginners to customize the website without editing raw JSON.

---

## 3. Creating Your RSVP Form

1. Go to [https://tally.so](https://tally.so) and create a free account.  
2. Build a form with recommended fields:  
   - Full name (Short Answer, Required)
   - Will you attend? (Multiple Choice: Yes/No, Required)
   - Number of guests (Number, Conditional)
   - Names of additional guests (Long Answer, Conditional)
   - Contact email (Email, Conditional)
   - Invite code (Short Answer, Conditional)
   - Message to host (Long Answer, Optional)
3. Configure conditional logic to show fields based on responses.  
4. Click **Share → Embed → Standard** and copy the iframe URL.  
5. Paste it into your `event.json` under the `rsvp.url` field.

> For detailed setup, see [RSVP Form Structure](https://github.com/Rainier-PS/Invitation-Template/blob/main/docs/RSVP_FORM_STRUCTURE.md)

---

## 4. Modifying Event Details (Manual JSON Editing)

If you prefer to edit JSON directly, `event.json` contains all your content:

### Event Info
- `title`: Main heading  
- `subtitle`: Short description under the title  
- `description`: Detailed text for the "Event Details" section  

### Date & Time
- `date`: Format like `"Saturday, June 12, 2026"`  
- `startTime`: Start time  
- `endTime`: Optional end time  

### Location
- `name`: Venue name  
- `address`: Full address  
- `mapsLink`: Google Maps link  

### Schedule
Add items to the `schedule` array:

```json
{
  "time": "00:00 PM",
  "label": "Activity 1"
}
```

### RSVP
- `url`: Your Tally form embed URL  
- `deadline`: Optional RSVP deadline  

---

## 5. Visual Customization

### Images
- Place image and audio files in the `/media/` folder.
- Replace URLs in `design.heroImages` and `design.sectionBackgrounds`.  (You can obtain the raw url after uploading your files in the Github repository.)
- Recommended: compressed, landscape images in **WebP** or **AVIF** for fast load times.  

### Colors & Styling (Advanced)
- Edit `styles.css` for colors, fonts, and glassmorphism effects.  
- Adjust CSS variables in the `:root` section, e.g., `--primary`, `--glass-bg`, `--glass-border`.

---

## 6. Attribution Rules

This project is **MIT licensed**. Proper attribution is required:

- **Footer Branding**: You can modify the footer to match your event’s branding.  
- **Attribution**: Keep “Created & Designed by Rainier Pearson Saputra” or a clear link back to the original author.

---

## 7. Deployment (Hosting Your Website)

### Option 1: GitHub Pages (Free)
1. Go to your repository on GitHub.  
2. Click **Settings → Pages**.  
3. Under “Source,” select your main branch and folder (`/root`).  
4. Click **Save**. Your site will be live at `https://USERNAME.github.io/REPO_NAME`.

### Option 2: Vercel
1. Go to [https://vercel.com](https://vercel.com) and sign up.  
2. Connect your GitHub repository.  
3. Vercel automatically deploys the site.  

### Option 3: Netlify
1. Go to [https://www.netlify.com](https://www.netlify.com) and sign up.  
2. Drag and drop your repository folder, or connect via GitHub.  
3. Netlify automatically hosts your site.

---

## 8. Summary Workflow (Beginner-Friendly)

1. (Optional) Create GitHub account if using GitHub Pages → Download latest ZIP release  
2. Use **JSON builder** → Generate `event.json`  
3. Create **Tally RSVP form** → Copy embed URL to `event.json`  
4. Customize images, colors, schedule, and media  
5. Host site via **GitHub Pages**, **Netlify**, or **Vercel**  

Your invitation website is now live and fully customizable!
