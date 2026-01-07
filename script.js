const EVENT_JSON_URL = "https://raw.githubusercontent.com/Rainier-PS/Invitation-Template/refs/heads/main/event.json";

function formatGoogleCalendarDate(dateStr, timeStr) {
    try {
        const fullDateStr = `${dateStr} ${timeStr}`;
        const date = new Date(fullDateStr);

        if (isNaN(date.getTime())) return null;

        const endDate = new Date(date.getTime() + 2 * 60 * 60 * 1000);

        const format = (d) => {
            return d.toISOString().replace(/-|:|\.\d+/g, "");
        };

        return {
            start: format(date),
            end: format(endDate)
        };
    } catch (e) {
        console.error("Date parse error", e);
        return null;
    }
}

fetch(EVENT_JSON_URL)
    .then(res => {
        if (!res.ok) throw new Error("Failed to load event JSON");
        return res.json();
    })
    .then(data => {
        document.title = data.event.title || "You're Invited";

        const metaTitle = document.querySelector('meta[property="og:title"]');
        if (metaTitle) metaTitle.content = data.event.title;

        const metaDesc = document.querySelector('meta[property="og:description"]');
        if (metaDesc) metaDesc.content = data.event.description;

        // textContent Injection
        const setText = (id, text) => {
            const el = document.getElementById(id);
            if (el) el.textContent = text || "";
        }

        setText("event-title", data.event.title);
        setText("event-subtitle", data.event.subtitle);
        setText("event-description", data.event.description);

        setText("event-date", data.datetime.date);
        setText("event-time", data.datetime.startTime);

        setText("venue-name", data.location.name);
        setText("venue-address", data.location.address);

        const mapsLink = document.getElementById("maps-link");
        if (mapsLink && data.location.mapsLink) {
            mapsLink.href = data.location.mapsLink;
        }

        if (data.calendar?.enabled && data.calendar?.providers?.google) {
            const dates = formatGoogleCalendarDate(data.datetime.date, data.datetime.startTime);
            if (dates) {
                const calBase = "https://calendar.google.com/calendar/render?action=TEMPLATE";
                const params = new URLSearchParams();
                params.append("text", data.event.title);
                params.append("dates", `${dates.start}/${dates.end}`);
                params.append("details", data.event.description);
                params.append("location", `${data.location.name}, ${data.location.address}`);

                const calUrl = `${calBase}&${params.toString()}`;

                const calLink = document.getElementById("google-calendar-link");
                const calContainer = document.getElementById("calendar-actions");

                if (calLink && calContainer) {
                    calLink.href = calUrl;
                    calContainer.hidden = false;
                }
            }
        }

        setText("footer-text", data.footer.text);

        if (data.rsvp?.enabled && data.rsvp?.url) {
            const rsvpFrame = document.querySelector('iframe[data-tally-src], iframe[title="RSVP"]');
            if (rsvpFrame) {
                if (data.rsvp.provider === 'tally') {
                    rsvpFrame.setAttribute('data-tally-src', data.rsvp.url);
                    if (window.Tally) {
                        try {
                            window.Tally.loadEmbeds();
                        } catch (e) { console.log("Tally reload skipped"); }
                    }
                } else {
                    rsvpFrame.src = data.rsvp.url;
                }
            }
        } else {

        }

        if (data.schedule?.length) {
            const section = document.getElementById("schedule-section");
            const list = document.getElementById("schedule-list");
            list.innerHTML = "";

            data.schedule.forEach(item => {
                const li = document.createElement("li");
                if (typeof item === 'string') {
                    li.textContent = item;
                } else {
                    li.innerHTML = `<strong>${item.time}</strong> – ${item.label}`;
                }
                list.appendChild(li);
            });

            if (section) section.hidden = false;
        }

        if (data.design?.accentColor) {
            document.documentElement.style.setProperty('--primary', data.design.accentColor);
        }

        if (data.meta?.simpleMode) {
            document.body.classList.add("simple");
        }
    })
    .catch(err => {
        console.error(err);
        document.getElementById("event-title").textContent = "Unable to load event details";
        document.getElementById("event-subtitle").textContent = "Please check back later.";
    });
