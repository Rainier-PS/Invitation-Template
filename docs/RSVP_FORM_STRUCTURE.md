# RSVP Form Guide

This template embeds an external RSVP form. The website does not process or validate responses. All logic and limits must be handled inside the form provider.

## Recommended Questions

When you build your RSVP form, include these questions:

| Question | Type | Required | Notes |
| -------- | ---- | -------- | ----- |
| Full name | Short Answer | Yes | Guest name |
| Will you attend? | Multiple Choice | Yes | Options: Yes, I will be there / Sorry, I cannot make it |
| Number of guests | Number | Yes (conditional) | Minimum 1. Set a max if needed |
| Names of additional guests | Long Answer | Yes (conditional) | Only if guest count is more than 1 |
| Contact email | Email | Yes (conditional) | For confirmation and updates |
| Invite code | Short Answer | Yes (conditional) | Optional. Validate in the form provider |
| Message to host | Long Answer | Optional | For notes or well wishes |

## Conditional Logic

Set up these rules inside your form provider. The website does not check form responses.

### If guest is attending

Show and require:

- Number of guests
- Contact email
- Invite code (if used)

Show as optional:

- Message to host

### If extra guests are coming

If attending is Yes and guest count is more than 1, show and require:

- Names of additional guests

### If guest declines

If attending is No, hide all follow up questions.

## Important Notes

- Guest limits, invite codes, and RSVP deadlines are not enforced by the website. Configure them in your form provider.
- The website only embeds the form. It does not inspect or validate it.

## Embedding the Form

### Tally.so

1. Open your form in Tally.
2. Go to Share > Embed > Standard.
3. Copy the iframe src URL.
4. Paste it into your event.json:

```json
"rsvp": {
  "enabled": true,
  "provider": "tally",
  "url": "https://tally.so/embed/XXXXX?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
}
```

### Google Forms

1. Open your form in Google Forms.
2. Go to Share > Copy responder link.
3. Paste the URL into your event.json:

```json
"rsvp": {
  "enabled": true,
  "url": "https://docs.google.com/forms/d/e/XXXXX/viewform"
}
```

### Microsoft Forms

1. Open your form in Microsoft Forms.
2. Go to Collect responses > Copy link.
3. Paste the URL into your event.json:

```json
"rsvp": {
  "enabled": true,
  "url": "https://forms.office.com/Pages/ResponsePage.aspx?XXXXX"
}
```

### Typeform

1. Open your form in Typeform.
2. Go to Share > Embed.
3. Copy the iframe or direct link.
4. Paste into your event.json:

```json
"rsvp": {
  "enabled": true,
  "url": "https://form.typeform.com/to/XXXXX"
}
```

### Jotform

1. Open your form in Jotform.
2. Go to Publish > Embed.
3. Copy the iframe URL.
4. Paste into your event.json:

```json
"rsvp": {
  "enabled": true,
  "url": "https://form.jotform.com/XXXXX"
}
```

## Optional Improvements

- Disable the RSVP section after the event deadline (UI only).
- Show an RSVP Closed message after the deadline.
- Use webhooks to collect responses in Google Sheets or Airtable.

## Easier JSON Editing

For a simpler way to edit event.json, use the [JSON Builder](https://rainier-ps.github.io/Invitation-Template/builder.html). It works like a visual form and generates valid JSON automatically.

Note: You can use the example form as a reference, but make sure to use your own form to collect your guest data.
