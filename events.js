class EventManager {
    constructor() {
        // Store events in a structured format
        this.events = {
            breakfast: {
                name: 'CLUB BREAKFAST',
                time: '9:30AM',
                // Add dates and locations for each breakfast
                events: [
                    { date: '2025-02-08', location: 'BEST WESTERN PEMBROKE' },
                    { date: '2025-03-06', location: 'TBD' },
                    { date: '2025-04-03', location: 'TBD' },
                    { date: '2025-05-01', location: 'TBD' },
                    { date: '2025-06-05', location: 'TBD' },
                    { date: '2025-07-03', location: 'TBD' },
                    { date: '2025-08-07', location: 'TBD' },
                    { date: '2025-09-04', location: 'TBD' },
                    { date: '2025-10-02', location: 'TBD' },
                    { date: '2025-11-06', location: 'TBD' },
                    { date: '2025-12-04', location: 'TBD' }
                ]
            },
            meeting: {
                name: 'CLUB MEETING',
                location: 'PETAWAWA CIVIC CENTRE',
                time: '1PM',
                // Third Sunday of each month
                dates: [
                    '2025-02-16',
                    '2025-03-17',
                    '2025-04-21',
                    '2025-05-19',
                    '2025-06-16',
                    '2025-07-21',
                    '2025-08-18',
                    '2025-09-15',
                    '2025-10-20',
                    '2025-11-17',
                    '2025-12-15'
                ]
            },
            techie: {
                name: 'TECHIE NIGHT',
                location: 'ZOOM',
                time: '7:30PM',
                // Every second Thursday
                events: [
                    { date: '2025-02-13', topic: 'Arduino Projects' },
                    { date: '2025-02-27', topic: 'SDR Programming' },
                    { date: '2025-03-13', topic: 'Digital Modes' },
                    { date: '2025-03-27', topic: 'Antenna Building' },
                    { date: '2025-04-10', topic: 'Raspberry Pi' },
                    { date: '2025-04-24', topic: 'Station Automation' },
                    { date: '2025-05-08', topic: 'DMR Programming' },
                    { date: '2025-05-22', topic: 'RF Design Basics' }
                    // Add more dates and topics as needed
                ]
            }
        };
    }

    getNextEvents() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const nextEvents = [];

        // Find next breakfast
        const nextBreakfast = this.events.breakfast.events
            .find(event => new Date(event.date) >= today);
        
        if (nextBreakfast) {
            nextEvents.push({
                type: this.events.breakfast.name,
                date: nextBreakfast.date,
                time: this.events.breakfast.time,
                location: nextBreakfast.location
            });
        }

        // Find next meeting
        const nextMeeting = this.events.meeting.dates
            .find(date => new Date(date) >= today);

        if (nextMeeting) {
            nextEvents.push({
                type: this.events.meeting.name,
                date: nextMeeting,
                time: this.events.meeting.time,
                location: this.events.meeting.location
            });
        }

        // Find next techie night
        const nextTechie = this.events.techie.events
            .find(event => new Date(event.date) >= today);

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
                const date = new Date(event.date);
                const formattedDate = date.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric'
                }).toUpperCase();
                
                // Add topic if it exists
                const topicText = event.topic ? ` – TOPIC: ${event.topic}` : '';
                
                return `<p>${event.type} - ${formattedDate}, ${event.time} – ${event.location}${topicText}</p>`;
            })
            .join('');
    }
}

// Initialize and use the event manager
document.addEventListener('DOMContentLoaded', () => {
    const eventManager = new EventManager();
    eventManager.updateEventsDisplay();
    
    // Update the display every day at midnight
    setInterval(() => {
        const now = new Date();
        if (now.getHours() === 0 && now.getMinutes() === 0) {
            eventManager.updateEventsDisplay();
        }
    }, 60000); // Check every minute
});