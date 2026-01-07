# Tally RSVP Form Structure

Use this template to build your own RSVP form on [Tally.so](https://tally.so). This ensures your form captures all necessary information for your event.

## Recommended Questions

| Question | Type | Required? | Placeholder | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Full name** | Short Answer | Yes | Your name | The name of the primary guest. |
| **Will you be attending the event?** | Multiple Choice | Yes | - | Options: "Yes, I’ll be there" or "Sorry, I can’t make it". |
| **How many people will be attending (including you)?** | Number | Yes | - | Set minimum value to **1**. |
| **Names of additional guests** | Long Answer | Yes | - | List of names of people coming with the primary guest. |
| **Dietary requirements** | Multi-select | No | - | Optional. Leave blank if none. |
| **Contact email** | Email | Yes | - | To send confirmation and updates. |
| **Invite code** | Short Answer | Yes | - | Unique code for verification. |
| **Message to host** | Long Answer | No | Leave a short message or wishes | Optional wishes or notes for the host. |

## Conditional Logic

For a professional experience, set up the following logic in Tally. By default, all follow-up questions should be **hidden**.

1. **If "Will you be attending the event?" is "Yes, I’ll be there":**
   - **Show** "How many people will be attending (including you)?" and make it **Required**.
   - **Show** "Contact email" and make it **Required**.
   - **Show** "Invite code" and make it **Required**.
   - **Show** "Dietary requirements" (keep it **Optional**).
   - **Show** "Message to host" (keep it **Optional**).

2. **If "Will you be attending the event?" is "Yes, I’ll be there" AND "How many people will be attending (including you)?" is > 1:**
   - **Show** "Names of additional guests" and make it **Required**.

3. **If "Will you be attending the event?" is "Sorry, I can’t make it":**
   - Keep all of the above questions **Hidden**.

## Integration Tips

Once your form is ready:
1. Go to the **Share** tab in Tally.
2. Choose **Embed** -> **Standard**.
3. Copy the URL from the `src` attribute of the iframe code.
4. Paste this URL into the `rsvp.url` field in your `event.json`.

---

*Note: You are free to use Rainier's original form as a reference, but please ensure you use your own form to collect your guests' data.*
