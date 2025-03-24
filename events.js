class EventManager {
    constructor() {
        this.events = {
            breakfast: { name: 'CLUB BREAKFAST', time: '9:30AM', events: [] },
            meeting: { name: 'CLUB MEETING', location: 'PETAWAWA CIVIC CENTRE', time: '1PM', dates: [] },
            techie: { name: 'TECHIE NIGHT', location: 'ZOOM', time: '7:30PM', events: [] }
        };
        this.fetchEvents();
    }

    async fetchEvents() {
        try {
            const response = await fetch('api.php');
            
            // Log the raw response
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const fetchedEvents = await response.json();
            
            // Log the fetched events
            console.log('Fetched events:', fetchedEvents);
            
            // Check for error response from API
            if (fetchedEvents.error) {
                throw new Error(fetchedEvents.error);
            }
            
            if (!fetchedEvents || fetchedEvents.length === 0) {
                this.showErrorMessage('No events found');
                return;
            }
            
            // Organize events by type
            this.organizeEvents(fetchedEvents);
            
            // Update display after fetching
            this.updateEventsDisplay();
        } catch (error) {
            console.error('Error fetching events:', error);
            this.showErrorMessage(error.message);
        }
    }

    organizeEvents(fetchedEvents) {
        // Reset events
        this.events.breakfast.events = [];
        this.events.meeting.dates = [];
        this.events.techie.events = [];

        // Categorize events
        fetchedEvents.forEach(event => {
            switch(event.type) {
                case 'breakfast':
                    this.events.breakfast.events.push({
                        date: event.date,
                        location: event.location
                    });
                    break;
                case 'meeting':
                    this.events.meeting.dates.push(event.date);
                    this.events.meeting.location = event.location || 'PETAWAWA CIVIC CENTRE';
                    break;
                case 'techie':
                    this.events.techie.events.push({
                        date: event.date,
                        topic: event.topic
                    });
                    break;
                default:
                    console.warn('Unhandled event type:', event.type);
            }
        });
    }

    showErrorMessage(message = 'Unable to load events. Please try again later.') {
        const eventsListDiv = document.querySelector('.events-list');
        if (eventsListDiv) {
            eventsListDiv.innerHTML = `<p style="color: red;">${message}</p>`;
        }
    }

    parseLocalDate(dateString) {
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day); // Month is 0-based
    }

    getNextEvents() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const nextEvents = [];

        const nextBreakfast = this.events.breakfast.events.find(event =>
            this.parseLocalDate(event.date) >= today
        );
        if (nextBreakfast) {
            nextEvents.push({
                type: this.events.breakfast.name,
                date: nextBreakfast.date,
                time: this.events.breakfast.time,
                location: nextBreakfast.location
            });
        }

        const nextMeeting = this.events.meeting.dates.find(date =>
            this.parseLocalDate(date) >= today
        );
        if (nextMeeting) {
            nextEvents.push({
                type: this.events.meeting.name,
                date: nextMeeting,
                time: this.events.meeting.time,
                location: this.events.meeting.location
            });
        }

        const nextTechie = this.events.techie.events.find(event =>
            this.parseLocalDate(event.date) >= today
        );
        if (nextTechie) {
            nextEvents.push({
                type: this.events.techie.name,
                date: nextTechie.date,
                time: this.events.techie.time,
                location: this.events.techie.location,
                topic: nextTechie.topic
            });
        }

        return nextEvents;
    }

    updateEventsDisplay() {
        const nextEvents = this.getNextEvents();
        const eventsListDiv = document.querySelector('.events-list');
        if (!eventsListDiv) return;

        eventsListDiv.innerHTML = nextEvents
            .map(event => {
                const date = this.parseLocalDate(event.date);
                const formattedDate = date.toLocaleDateString('en-US', {
                    month: 'long', day: 'numeric'
                }).toUpperCase();
                const topicText = event.topic ? ` – TOPIC: ${event.topic}` : '';
                // Check if location is "ZOOM" and make it a link
                const locationText = event.location === 'ZOOM' 
                    ? `<a href="https://tinyurl.com/RCARC-Events" target="_blank">ZOOM</a>` 
                    : event.location;
                return `<p>${event.type} - ${formattedDate}, ${event.time} – ${locationText}${topicText}</p>`;
            })
            .join('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const eventManager = new EventManager();

    setInterval(() => {
        const now = new Date();
        if (now.getHours() === 0 && now.getMinutes() === 0) {
            eventManager.fetchEvents();
        }
    }, 60000);
});