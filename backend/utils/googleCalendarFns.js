const fetch = require("node-fetch");

/**
 * Sync event with Google Calendar (check if exists, add if not)
 * @param {string} accessToken - The OAuth access token of the user
 * @param {string} eventDate - The event date (format: YYYY-MM-DD)
 * @param {string} eventName - The event name/title
 * @param {Object} eventDetails - Additional event details (location, description, start/end time, etc.)
 */
async function syncEventWithGoogleCalendar(accessToken, eventDate, eventName, eventDetails = {}) {
    try {
        const timeMin = `${eventDate}T00:00:00Z`;
        const timeMax = `${eventDate}T23:59:59Z`;

        // 1. Check if the event already exists
        const listEventsUrl = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}&q=${encodeURIComponent(eventName)}`;

        const response = await fetch(listEventsUrl, {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const data = await response.json();

        if (data.items && data.items.length > 0) {
            console.log("Event already exists in Google Calendar:", eventName);
            return { status: "exists", event: data.items[0] };
        }

        // 2. If event does not exist, add it
        const createEventUrl = `https://www.googleapis.com/calendar/v3/calendars/primary/events`;

        const newEvent = {
            summary: eventName, // Event title
            location: eventDetails.location || "Not specified",
            description: eventDetails.description || "No description",
            start: {
                date: `${eventDate}`,
            },
            end: {
                date: `${eventDate}`,
            },
            reminders: {
                useDefault: false,
                overrides: [
                    { method: "email", minutes: 24 * 60 }, // 1 day before
                    { method: "popup", minutes: 10 } // 10 minutes before
                ]
            }
        };

        const createResponse = await fetch(createEventUrl, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newEvent)
        });

        const createdEvent = await createResponse.json();

        console.log("Event added successfully:", createdEvent);
        return { status: "added", event: createdEvent };
    } catch (error) {
        console.error("Error syncing event with Google Calendar:", error);
        return { status: "error", message: error.message };
    }
}


module.exports = {syncEventWithGoogleCalendar}