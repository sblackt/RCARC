class EventDisplay {
    constructor(options = {}) {
        this.options = {
            apiUrl: 'api.php',
            eventListSelector: '.events-list',
            upcomingLimit: options.upcomingLimit || 3,
            showPastEvents: options.showPastEvents || false,
            hideRecordings: options.hideRecordings || false
        };
        
        // Merge options
        Object.assign(this.options, options);
        
       
        
        // Initialize events array
        this.events = [];
        
        // DOM elements
        this.eventList = document.querySelector(this.options.eventListSelector);
        this.recordingsContainer = document.querySelector(this.options.recordingsContainerSelector);
        
        // Initialize
        this.init();
    }
    
    init() {
        // Fetch events data
        this.fetchEvents()
            .then(() => {
                this.renderEvents();
                if (!this.options.hideRecordings) {
                    this.renderRecordings();
                }
            })
            .catch(error => {
                console.error('Error initializing EventDisplay:', error);
                this.renderError('Failed to load events. Please try again later.');
            });
            
        // Set up event listeners
        this.setupEventListeners();
    }
    
    fetchEvents() {
        return fetch(this.options.apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                this.events = data.events || [];
                return this.events;
            });
    }
    
    renderEvents() {
        if (!this.eventList) return;
        
        // Clear existing content
        this.eventList.innerHTML = '';
        
        // Get current date
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        
        // Filter upcoming events
        let upcomingEvents = this.events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= now;
        }).sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // Limit number of upcoming events if specified
        if (this.options.upcomingLimit > 0) {
            upcomingEvents = upcomingEvents.slice(0, this.options.upcomingLimit);
        }
        
        // Render upcoming events
        if (upcomingEvents.length > 0) {
            const upcomingSection = document.createElement('div');
            upcomingSection.className = 'events-section upcoming-events';
            
            const sectionTitle = document.createElement('h3');
            sectionTitle.textContent = 'Upcoming Events';
            upcomingSection.appendChild(sectionTitle);
            
            upcomingEvents.forEach(event => {
                upcomingSection.appendChild(this.createEventCard(event));
            });
            
            this.eventList.appendChild(upcomingSection);
        } else {
            const noEvents = document.createElement('p');
            noEvents.className = 'no-events';
            noEvents.textContent = 'No upcoming events scheduled. Check back soon!';
            this.eventList.appendChild(noEvents);
        }
        
        // Render past events if enabled
        if (this.options.showPastEvents) {
            const pastEvents = this.events.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate < now;
            }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Most recent first
            
            if (pastEvents.length > 0) {
                const pastSection = document.createElement('div');
                pastSection.className = 'events-section past-events';
                
                const sectionTitle = document.createElement('h3');
                sectionTitle.textContent = 'Past Events';
                pastSection.appendChild(sectionTitle);
                
                pastEvents.forEach(event => {
                    pastSection.appendChild(this.createEventCard(event, true));
                });
                
                this.eventList.appendChild(pastSection);
            }
        }
    }
    
    createEventCard(event, isPast = false) {
        const card = document.createElement('div');
        card.className = `event-card ${isPast ? 'past-event' : 'upcoming-event'}`;
        card.dataset.eventId = event.id;
        
        // Format date
        const eventDate = new Date(event.date);
        const dateString = eventDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Create card content
        card.innerHTML = `
            <div class="event-date">${dateString}</div>
            <h4 class="event-title">${event.title}</h4>
            <div class="event-presenter">${event.presenter || 'TBA'}</div>
            <div class="event-description">${event.description || ''}</div>
            <div class="event-location">${event.location || 'Online'}</div>
            ${event.link ? `<a href="${event.link}" class="event-link" target="_blank">Event Details</a>` : ''}
        `;
        
        return card;
    }
    
    // Public method to refresh events data
    refreshEvents() {
        return this.fetchEvents()
            .then(() => {
                this.renderEvents();
                return true;
            })
            .catch(error => {
                console.error('Error refreshing events:', error);
                return false;
            });
    }
    
    // Public method to add a recording
    addRecording(recording) {
        if (!recording.title || !recording.videoId) {
            console.error('Recording must have at least a title and videoId');
            return false;
        }
        
        this.recordings.unshift(recording);
        if (!this.options.hideRecordings) {
            this.renderRecordings();
        }
        return true;
    }
}