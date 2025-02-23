class EventManager {
    constructor() {
        this.events = {
            breakfast: {
                name: 'CLUB BREAKFAST',
                time: '9:30AM',
                events: [
                    { date: '2025-02-08', location: 'BEST WESTERN PEMBROKE' },
                    { date: '2025-03-08', location: 'Bears Den, Deep River' },
                    { date: '2025-04-12', location: 'TBD' },
                    { date: '2025-05-10', location: 'TBD' },
                    { date: '2025-06-14', location: 'TBD' },
                    { date: '2025-07-12', location: 'TBD' },
                    { date: '2025-08-09', location: 'TBD' },
                    { date: '2025-09-13', location: 'TBD' },
                    { date: '2025-10-11', location: 'TBD' },
                    { date: '2025-11-08', location: 'TBD' },
                    { date: '2025-12-13', location: 'TBD' }
                ]
            },
            meeting: {
                name: 'CLUB MEETING',
                location: 'PETAWAWA CIVIC CENTRE',
                time: '1PM',
                dates: [
                    '2025-02-16', '2025-03-16', '2025-04-20', '2025-05-18', '2025-06-22',
                    '2025-07-20', '2025-08-24', '2025-09-28', '2025-10-12', '2025-11-16'
                ]
            },
            techie: {
                name: 'TECHIE NIGHT',
                location: 'ZOOM',
                time: '7:30PM',
                events: [
                    { date: '2025-02-13', topic: 'Arduino Projects' },
                    { date: '2025-02-27', topic: 'JS8 Call HF digital mode' },
                    { date: '2025-03-13', topic: 'Digital Modes' },
                    { date: '2025-03-27', topic: 'Antenna Building' },
                    { date: '2025-04-10', topic: 'Raspberry Pi' },
                    { date: '2025-04-24', topic: 'Station Automation' },
                    { date: '2025-05-08', topic: 'DMR Programming' },
                    { date: '2025-05-22', topic: 'RF Design Basics' }
                ]
            }
        };
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
                return `<p>${event.type} - ${formattedDate}, ${event.time} – ${event.location}${topicText}</p>`;
            })
            .join('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const eventManager = new EventManager();
    eventManager.updateEventsDisplay();

    setInterval(() => {
        const now = new Date();
        if (now.getHours() === 0 && now.getMinutes() === 0) {
            eventManager.updateEventsDisplay();
        }
    }, 60000);
});
