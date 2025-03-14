class EventDetailsManager {
    constructor() {
        this.events = {
            breakfast: {
                name: 'CLUB BREAKFAST',
                time: '9:30AM',
                events: [
                    { 
                        date: '2025-03-08', 
                        location: 'Bears Den, Deep River',
                        details: 'Join us for our monthly breakfast at the Bears Den in Deep River. This casual gathering is a great opportunity to meet fellow club members and discuss amateur radio topics.',
                        address: '33 Deep River Rd, Deep River, ON',
                        mapLink: 'https://maps.google.com/?q=Bears+Den+Deep+River'
                    },
                    { 
                        date: '2025-04-12', 
                        location: 'BEST WESTERN PEMBROKE',
                        details: 'Our Pembroke breakfast is held in the restaurant at the Best Western. Come early to grab a good seat!',
                        address: '1 International Dr, Pembroke, ON',
                        mapLink: 'https://maps.google.com/?q=Best+Western+Pembroke'
                    },
                    { 
                        date: '2025-05-10', 
                        location: 'Bears Den, Deep River',
                        details: 'Join us for our monthly breakfast at the Bears Den in Deep River. This casual gathering is a great opportunity to meet fellow club members and discuss amateur radio topics.',
                        address: '33 Deep River Rd, Deep River, ON',
                        mapLink: 'https://maps.google.com/?q=Bears+Den+Deep+River'
                    }
                ]
            },
            meeting: {
                name: 'CLUB MEETING',
                location: 'PETAWAWA CIVIC CENTRE',
                time: '1PM',
                dates: [
                    {
                        date: '2025-03-16',
                        details: 'Monthly club business meeting. This month we are discussing our club strategy, come with ideas and inspiration!',
                        address: '16 Civic Centre Rd, Petawawa, ON',
                        mapLink: 'https://maps.google.com/?q=Petawawa+Civic+Centre',
                        specialNotes: 'Fundraising room, up the stairs and to the right.'
                    },
                    {
                        date: '2025-04-20',
                        details: 'Monthly club business meeting. This meeting will include a special presentation on digital modes.',
                        address: '16 Civic Centre Rd, Petawawa, ON',
                        mapLink: 'https://maps.google.com/?q=Petawawa+Civic+Centre'
                    },
                    {
                        date: '2025-05-18',
                        details: 'Monthly club business meeting. We\'ll be finalizing our field day preparations.',
                        address: '16 Civic Centre Rd, Petawawa, ON',
                        mapLink: 'https://maps.google.com/?q=Petawawa+Civic+Centre'
                    }
                ]
            },
            techie: {
                name: 'TECHIE NIGHT',
                location: 'ZOOM',
                time: '7:30PM',
                events: [
                    { 
                        date: '2025-03-13', 
                        topic: 'Antenna Tuners and Transformers',
                        details: 'Learn about the different types of antenna tuners and impedance matching transformers. We\'ll discuss when to use them and how they work.',
                        presenter: 'John VE3ABC',
                        zoomLink: 'https://tinyurl.com/RCARC-Events'
                    },
                    { 
                        date: '2025-03-27', 
                        topic: 'TBD',
                        details: 'Details to come',
                        presenter: 'TBD',
                        zoomLink: 'https://tinyurl.com/RCARC-Events'
                    },
                    { 
                        date: '2025-04-10', 
                        topic: 'HF Propagation Prediction Tools',
                        details: 'A walkthrough of various software tools and websites for predicting HF propagation conditions.',
                        presenter: 'Mike VE3DEF',
                        zoomLink: 'https://tinyurl.com/RCARC-Events'
                    }
                ]
            }
        };

        this.recordings = [
            {
                title: 'Antenna Tuners and Transformers',
                date: '2025-03-13',
                description: 'Charlie walks us through some tuner and transformer examples, as well as the infamous smith chart.',
                videoId: 'H8vR2uJfquE',
                presenter: 'Charlie VE3XCC',
                embedUrl: 'https://www.youtube.com/embed/H8vR2uJfquE'
            },
            {
                title: 'JS8 Call HF Digital Mode',
                date: '2025-02-27',
                description: 'Introduction to the JS8 Call digital mode for HF communications.',
                videoId: 'nuWv6N3K3Y4',
                presenter: 'Steve VA3WAV',
                embedUrl: 'https://www.youtube.com/embed/nuWv6N3K3Y4'
            },
          //  {
          //      title: 'Antenna Building Workshop',
           //     date: '2025-01-30',
           //     description: 'Learn how to build simple but effective wire antennas for HF.',
          //      videoId: 'example-video-id-3',
           //     presenter: 'Linda VE3MNO',
          //      embedUrl: 'https://www.youtube.com/embed/example-video-id-3'
          //  }
        ];
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
    eventDetailsManager.updateEventsDisplay();
    eventDetailsManager.updateRecordingsDisplay();

    // Update the display at midnight
    setInterval(() => {
        const now = new Date();
        if (now.getHours() === 0 && now.getMinutes() === 0) {
            eventDetailsManager.updateEventsDisplay();
        }
    }, 60000);
});