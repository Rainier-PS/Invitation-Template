fetch("event.json")
    .then(res => res.json())
    .then(data => {
        document.getElementById("event-title").textContent = data.title;
        document.getElementById("event-subtitle").textContent = data.subtitle;
        document.getElementById("event-date").textContent = data.date;
        document.getElementById("event-time").textContent = data.time;
        document.getElementById("event-description").textContent = data.description;

        document.getElementById("venue-name").textContent = data.venue.name;
        document.getElementById("venue-address").textContent = data.venue.address;

        const mapsLink = document.getElementById("maps-link");
        mapsLink.href = data.venue.mapsLink;

        document.getElementById("footer-text").textContent = data.footer;

        // Schedule
        if (data.schedule?.length) {
            const section = document.getElementById("schedule-section");
            const list = document.getElementById("schedule-list");

            data.schedule.forEach(item => {
                const li = document.createElement("li");
                li.textContent = item;
                list.appendChild(li);
            });

            section.hidden = false;
        }

        // Simple mode
        if (data.simpleMode) {
            document.body.classList.add("simple");
        }
    })
    .catch(() => {
        document.getElementById("event-title").textContent =
            "Unable to load event details";
    });
