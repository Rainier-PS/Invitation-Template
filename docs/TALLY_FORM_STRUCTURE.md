# RSVP Form Guide (Tally)

This template embeds an external RSVP form (recommended: **Tally.so**) and does **not** process or validate responses in JavaScript.  
All logic, limits, and validation must be handled **inside the form provider**.

---

## Recommended RSVP Questions (Tally)

Use the following questions when building your RSVP form in **Tally.so**.

| Question | Type | Required | Notes |
|--------|------|----------|------|
| **Full name** | Short Answer | Yes | Primary guest’s name |
| **Will you be attending the event?** | Multiple Choice | Yes | Options:<br>• Yes, I’ll be there<br>• Sorry, I can’t make it |
| **How many people will be attending (including you)?** | Number | Yes (conditional) | Minimum value: **1**<br>Maximum: set in **Tally** if needed |
| **Names of additional guests** | Long Answer | Required (conditional) | Required **only if guest count > 1** |
| **Contact email** | Email | Yes (conditional) | Used for confirmation & updates |
| **Invite code** | Short Answer | Yes (conditional) | Validation must be handled in Tally |
| **Message to host** | Long Answer | Optional | Optional note or well wishes |

---

## Conditional Logic (Required)

All logic below **must be configured in Tally**.  
The website does not inspect or validate form responses.

### 1. Attendance logic

**If**  
> “Will you be attending the event?” = **Yes, I’ll be there**

**Then show & require:**
- How many people will be attending
- Contact email
- Invite code

**Then show (optional):**
- Message to host

---

### 2. Guest names logic

**If**
- Attending = **Yes**
- AND number of attendees **> 1**

**Then:**
- Show **Names of additional guests**
- Make it **Required**

---

### 3. Decline logic

**If**
> “Will you be attending the event?” = **Sorry, I can’t make it**

**Then:**
- Keep all follow-up questions hidden

---

## Enforcement & Limits (Important)

- Guest limits, invite validation, and RSVP deadlines are **not enforced by the website**
- These must be configured directly in **Tally**
- The website only embeds the form

---

## Embedding the Form

1. Open your form in **Tally**
2. Go to **Share → Embed → Standard**
3. Copy the iframe `src` URL
4. Paste the URL into your `event.json`:

```json
"rsvp": {
  "enabled": true,
  "provider": "tally",
  "url": "https://tally.so/embed/XXXXX?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1",
  "deadline": "March 31, 2026"
}
```

> Note: All RSVP limits, validation, and deadlines must be enforced in the form provider (e.g. Tally).

## Optional Next Steps (Future Upgrades)

These are optional but can improve the RSVP experience:

- Disable RSVP section after deadline (UI-only)
- Show a “RSVP Closed” message after deadline
- Use webhooks to collect responses in Google Sheets / Airtable / Supabase
- Invite-code verification through a backend service

## Easier JSON Editing

For a simpler experience editing event.json, use the dedicated JSON builder I created:

[JSON Builder Form](https://rainier-ps.github.io/Invitation-Template/builder.html)

> It works like a visual form and generates valid JSON automatically.

*Note: You are free to use Rainier's original form as a reference, but please ensure you use your own form to collect your guests' data.*
