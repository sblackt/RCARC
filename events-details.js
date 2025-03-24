class EventDetailsManager {
    constructor() {
       

        this.recordings = [
            {
                title: 'Antenna Tuners and Transformers',
                date: '2025-03-13',
                description: 'Charlie walks us through some tuner and transformer examples, as well as the infamous smith chart.',
                videoId: 'H8vR2uJfquE',
                presenter: 'Charlie VE3XCC',
                embedUrl: 'https://www.youtube.com/embed/H8vR2uJfquE'
            },
        ];
        this.events = {
            breakfast: { name: 'CLUB BREAKFAST', events: [] },
            meeting: { name: 'CLUB MEETING', dates: [] },
            techie: { name: 'TECHIE NIGHT', events: [] }
        };
        
        // Fetch events immediately upon initialization
      //  this.fetchEventsFromDatabase();
    }
    
    fetchEventsFromDatabase() {
        // Return the promise chain so you can chain .then()
        return fetch('api.php')
            .then(response => response.json())
            .then(events => {
                // Process and categorize events
                this.processEvents(events);
                // Update the display after fetching
                this.updateEventsDisplay();
                return events;  // optional: return events if needed
            })
            .catch(error => {
                console.error('Error fetching events:', error);
            });
    }
    
    
    processEvents(eventsFromDB) {
        // Clear existing events
        this.events.breakfast.events = [];
        this.events.meeting.dates = [];
        this.events.techie.events = [];
        
        // Process each event from the database
        eventsFromDB.forEach(event => {
            // Format the event according to its type
            switch(event.type) {
                case 'breakfast':
                    this.events.breakfast.time = event.time;
                    this.events.breakfast.events.push({
                        date: event.date,
                        location: event.location,
                        details: event.details || '',
                        presenter: event.presenter || '',
                        address: this.extractAddress(event.location, event.details),
                        mapLink: event.link || this.generateMapLink(event.location)
                    });
                    break;
                    
                case 'meeting':
                    this.events.meeting.time = event.time;
                    this.events.meeting.location = event.location;
                    this.events.meeting.dates.push({
                        date: event.date,
                        details: event.details || '',
                        presenter: event.presenter || '',
                        address: this.extractAddress(event.location, event.details),
                        mapLink: event.link || this.generateMapLink(event.location),
                        specialNotes: event.topic // Using topic field for special notes
                    });
                    break;
                    
                case 'techie':
                    this.events.techie.time = event.time;
                    this.events.techie.location = 'ZOOM'; // Assuming techie nights are always on Zoom
                    this.events.techie.events.push({
                        date: event.date,
                        topic: event.topic || '',
                        details: event.details || '',
                        presenter: event.presenter || '',
                        zoomLink: event.link || 'https://tinyurl.com/RCARC-Events' // Default if not provided
                    });
                    break;
            }
        });
        
        // Sort events by date within each category
        this.sortEventsByDate();
    }
    
    extractAddress(location, details) {
        // Simple address extraction logic - this could be enhanced
        // For now, we'll just return the location as the address if it exists
        return location || '';
    }
    
    generateMapLink(location) {
        // Generate a Google Maps link based on the location
        if (!location) return '';
        return `https://maps.google.com/?q=${encodeURIComponent(location)}`;
    }
    
    sortEventsByDate() {
        // Sort breakfast events
        this.events.breakfast.events.sort((a, b) => 
            this.parseLocalDate(a.date) - this.parseLocalDate(b.date)
        );
        
        // Sort meeting dates
        this.events.meeting.dates.sort((a, b) => 
            this.parseLocalDate(a.date) - this.parseLocalDate(b.date)
        );
        
        // Sort techie events
        this.events.techie.events.sort((a, b) => 
            this.parseLocalDate(a.date) - this.parseLocalDate(b.date)
        );
    }

    parseLocalDate(dateString) {
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day); // Month is 0-based
    }

    getNextEvents() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const nextEvents = [];

        // Get next breakfast event
        const nextBreakfast = this.events.breakfast.events.find(event =>
            this.parseLocalDate(event.date) >= today
        );
        if (nextBreakfast) {
            nextEvents.push({
                type: this.events.breakfast.name,
                date: nextBreakfast.date,
                time: this.events.breakfast.time,
                location: nextBreakfast.location,
                details: nextBreakfast.details,
                presenter: nextBreakfast.presenter,
                address: nextBreakfast.address,
                mapLink: nextBreakfast.mapLink
            });
        }

        // Get next meeting event
        const nextMeetingObj = this.events.meeting.dates.find(meetingDate =>
            this.parseLocalDate(meetingDate.date) >= today
        );
        if (nextMeetingObj) {
            nextEvents.push({
                type: this.events.meeting.name,
                date: nextMeetingObj.date,
                time: this.events.meeting.time,
                location: this.events.meeting.location,
                details: nextMeetingObj.details,
                presenter: nextMeetingObj.presenter,
                address: nextMeetingObj.address,
                mapLink: nextMeetingObj.mapLink,
                specialNotes: nextMeetingObj.specialNotes
            });
        }

        // Get next techie night event
        const nextTechie = this.events.techie.events.find(event =>
            this.parseLocalDate(event.date) >= today
        );
        if (nextTechie) {
            nextEvents.push({
                type: this.events.techie.name,
                date: nextTechie.date,
                time: this.events.techie.time,
                location: this.events.techie.location,
                topic: nextTechie.topic,
                details: nextTechie.details,
                presenter: nextTechie.presenter,
                zoomLink: nextTechie.zoomLink
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
                
                // Build event header
                let eventHtml = `<div class="event-item">`;
                
                // Check if topic exists (for techie nights)
                const topicText = event.topic ? ` – TOPIC: ${event.topic}` : '';
                
                // Check if location is "ZOOM" and make it a link
                const locationText = event.location === 'ZOOM' 
                    ? `<a href="${event.zoomLink}" target="_blank">ZOOM</a>` 
                    : event.location;
                
                // Add main event info
                eventHtml += `<p>${event.type} - ${formattedDate}, ${event.time} – ${locationText}${topicText}</p>`;
                
                // Add event details section if details exist
                if (event.details || event.address || event.specialNotes || event.presenter) {
                    eventHtml += `<div class="event-details">`;
                    
                    if (event.details) {
                        eventHtml += `<p>${event.details}</p>`;
                    }
                    
                    if (event.presenter) {
                        eventHtml += `<p>Presenter: ${event.presenter}</p>`;
                    }
                    
                    if (event.address) {
                        eventHtml += `<p class="event-location-details">Address: ${event.address}`;
                        if (event.mapLink) {
                            eventHtml += ` (<a href="${event.mapLink}" target="_blank">Map</a>)`;
                        }
                        eventHtml += `</p>`;
                    }
                    
                    if (event.specialNotes) {
                        eventHtml += `<p class="event-special-notes">${event.specialNotes}</p>`;
                    }
                    
                    eventHtml += `</div>`;
                }
                
                eventHtml += `</div>`;
                return eventHtml;
            })
            .join('');
    }

    updateRecordingsDisplay() {
        const recordingsContainer = document.querySelector('.recordings-container');
        if (!recordingsContainer) return;

        recordingsContainer.innerHTML = this.recordings
            .map(recording => {
                const date = this.parseLocalDate(recording.date);
                const formattedDate = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long', 
                    day: 'numeric'
                });
                
                return `
                <div class="recording-card">
                    <div class="recording-video">
                        <iframe width="100%" height="100%" src="${recording.embedUrl}" 
                            title="${recording.title}" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                        </iframe>
                    </div>
                    <div class="recording-info">
                        <h3 class="recording-title">${recording.title}</h3>
                        <p class="recording-date">${formattedDate}</p>
                        <p class="recording-presenter">Presenter: ${recording.presenter}</p>
                        <p class="recording-description">${recording.description}</p>
                    </div>
                </div>`;
            })
            .join('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const eventDetailsManager = new EventDetailsManager();
    
    eventDetailsManager.fetchEventsFromDatabase().then(() => {
        // Initialize the calendar widget after events have been fetched
        const calendarContainer = document.querySelector('.calendar-container');
        if (calendarContainer) {
            const calendarWidget = new CalendarWidget('.calendar-container');
            calendarWidget.init(eventDetailsManager);
            positionTooltips();
        }
    });

    eventDetailsManager.updateRecordingsDisplay();

    // Update the display at midnight
    setInterval(() => {
        const now = new Date();
        if (now.getHours() === 0 && now.getMinutes() === 0) {
            eventDetailsManager.updateEventsDisplay();
            // Optionally re-render the calendar here if needed
            const calendarContainer = document.querySelector('.calendar-container');
            if (calendarContainer) {
                const calendarWidget = new CalendarWidget('.calendar-container');
                calendarWidget.init(eventDetailsManager);
                positionTooltips();
            }
        }
    }, 60000);
});
