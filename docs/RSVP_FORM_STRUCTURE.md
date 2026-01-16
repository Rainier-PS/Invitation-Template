# RSVP Form Guide

This template embeds an external RSVP form and does **not** process or validate responses in JavaScript.
All logic, limits, and validation must be handled **inside the form provider**.

---

## Recommended RSVP Questions

When building your RSVP form, include the following questions:

| Question                                               | Type            | Required               | Notes                                                        |
| ------------------------------------------------------ | --------------- | ---------------------- | ------------------------------------------------------------ |
| **Full name**                                          | Short Answer    | Yes                    | Primary guest’s name                                         |
| **Will you be attending the event?**                   | Multiple Choice | Yes                    | Options:<br>• Yes, I’ll be there<br>• Sorry, I can’t make it |
| **How many people will be attending (including you)?** | Number          | Yes (conditional)      | Minimum value: **1**<br>Maximum: set in the form if needed   |
| **Names of additional guests**                         | Long Answer     | Required (conditional) | Required **only if guest count > 1**                         |
| **Contact email**                                      | Email           | Yes (conditional)      | Used for confirmation & updates                              |
| **Invite code**                                        | Short Answer    | Yes (conditional)      | Validation must be handled in the form                       |
| **Message to host**                                    | Long Answer     | Optional               | Optional note or well wishes                                 |

---

## Conditional Logic (Required)

All logic below **must be configured in your form provider**.
The website does **not** inspect or validate form responses.

### 1. Attendance logic

**If**

> “Will you be attending the event?” = **Yes, I’ll be there**

**Then show & require:**

* How many people will be attending
* Contact email
* Invite code

**Then show (optional):**

* Message to host

---

### 2. Guest names logic

**If**

* Attending = **Yes**
* AND number of attendees **> 1**

**Then:**

* Show **Names of additional guests**
* Make it **Required**

---

### 3. Decline logic

**If**

> “Will you be attending the event?” = **Sorry, I can’t make it**

**Then:**

* Keep all follow-up questions hidden

---

## Enforcement & Limits (Important)

* Guest limits, invite validation, and RSVP deadlines are **not enforced by the website**
* These must be configured directly in your form provider
* The website only embeds the form

---

## Embedding the Form

### 1. Tally.so

1. Open your form in **Tally**
2. Go to **Share → Embed → Standard**
3. Copy the iframe `src` URL
4. Paste the URL into your `event.json`:

```json
"rsvp": {
  "enabled": true,
  "provider": "tally",
  "url": "https://tally.so/embed/XXXXX?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
}
```

> Note: Ensure your form handles all limits, validation, and deadlines.

---

### 2. Google Forms

1. Open your form in **Google Forms**
2. Go to **Share → Copy responder link**
3. Paste the URL directly into your `event.json` (no need to append `&embedded=true`):

```json
"rsvp": {
  "enabled": true,
  "url": "https://docs.google.com/forms/d/e/XXXXX/viewform"
}
```

---

### 3. Microsoft Forms

1. Open your form in **Microsoft Forms**
2. Go to **Collect responses → Copy link**
3. Paste the URL into your `event.json`:

```json
"rsvp": {
  "enabled": true,
  "url": "https://forms.office.com/Pages/ResponsePage.aspx?XXXXX"
}
```

---

### 4. Typeform

1. Open your form in **Typeform**
2. Go to **Share → Embed**
3. Copy the iframe URL or direct link
4. Paste into your `event.json`:

```json
"rsvp": {
  "enabled": true,
  "url": "https://form.typeform.com/to/XXXXX"
}
```

---

### 5. Jotform

1. Open your form in **Jotform**
2. Go to **Publish → Embed**
3. Copy the iframe URL
4. Paste into your `event.json`:

```json
"rsvp": {
  "enabled": true,
  "url": "https://form.jotform.com/XXXXX"
}
```

---

## Optional Next Steps

These are optional but can improve the RSVP experience:

* Disable RSVP section after deadline (UI-only)
* Show a “RSVP Closed” message after deadline
* Use webhooks to collect responses in Google Sheets / Airtable / Supabase
* Invite-code verification through a backend service

---

## Easier JSON Editing

For a simpler experience editing `event.json`, use the dedicated JSON builder:

[JSON Builder Form](https://rainier-ps.github.io/Invitation-Template/builder.html)

> It works like a visual form and generates valid JSON automatically.

---

*Note: You are free to use Rainier's original form as a reference, but please ensure you use your own form to collect your guests' data.*
