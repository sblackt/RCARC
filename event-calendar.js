class CalendarWidget {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.date = new Date();
        this.currentMonth = this.date.getMonth();
        this.currentYear = this.date.getFullYear();
        this.events = {};
        this.eventDetailsManager = null;
    }

    init(eventDetailsManager) {
        this.eventDetailsManager = eventDetailsManager;
        this.loadEvents();
        this.render();
        this.attachEventListeners();
    }

    loadEvents() {
        // Extract events from eventDetailsManager
        if (!this.eventDetailsManager) return;
        
        this.events = {};
        
        // Get breakfast events
        this.eventDetailsManager.events.breakfast.events.forEach(event => {
            if (!this.events[event.date]) {
                this.events[event.date] = [];
            }
            this.events[event.date].push({
                type: 'breakfast',
                title: 'Club Breakfast',
                location: event.location,
                time: this.eventDetailsManager.events.breakfast.time
            });
        });
        
        // Get meeting events
        this.eventDetailsManager.events.meeting.dates.forEach(event => {
            if (!this.events[event.date]) {
                this.events[event.date] = [];
            }
            this.events[event.date].push({
                type: 'meeting',
                title: 'Club Meeting',
                location: this.eventDetailsManager.events.meeting.location,
                time: this.eventDetailsManager.events.meeting.time
            });
        });
        
        // Get techie night events
        this.eventDetailsManager.events.techie.events.forEach(event => {
            if (!this.events[event.date]) {
                this.events[event.date] = [];
            }
            this.events[event.date].push({
                type: 'techie',
                title: `Techie Night: ${event.topic}`,
                location: 'Zoom',
                time: this.eventDetailsManager.events.techie.time
            });
        });
    }

    getDaysInMonth(month, year) {
        return new Date(year, month + 1, 0).getDate();
    }

    getFirstDayOfMonth(month, year) {
        return new Date(year, month, 1).getDay();
    }

    navigateMonth(direction) {
        this.currentMonth += direction;
        
        if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        } else if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        }
        
        this.render();
    }

    formatEventDate(date) {
        // Convert YYYY-MM-DD to Date object
        const parts = date.split('-');
        return new Date(parts[0], parts[1] - 1, parts[2]);
    }

    hasEvent(day) {
        const dateStr = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return this.events[dateStr] && this.events[dateStr].length > 0;
    }

    getEventsForDay(day) {
        const dateStr = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return this.events[dateStr] || [];
    }

    render() {
        const daysInMonth = this.getDaysInMonth(this.currentMonth, this.currentYear);
        const firstDay = this.getFirstDayOfMonth(this.currentMonth, this.currentYear);
        
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        
        const today = new Date();
        const currentDay = today.getDate();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        let calendarHTML = `
            <div class="calendar-widget">
                <div class="calendar-header">
                    <button class="prev-month">&lt;</button>
                    <h3>${months[this.currentMonth]} ${this.currentYear}</h3>
                    <button class="next-month">&gt;</button>
                </div>
                <div class="calendar-weekdays">
                    <div>Sun</div>
                    <div>Mon</div>
                    <div>Tue</div>
                    <div>Wed</div>
                    <div>Thu</div>
                    <div>Fri</div>
                    <div>Sat</div>
                </div>
                <div class="calendar-body">
        `;
        
        // Fill in leading empty cells
        for (let i = 0; i < firstDay; i++) {
            calendarHTML += `<div class="calendar-day empty"></div>`;
        }
        
        // Fill in days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = day === currentDay && 
                            this.currentMonth === currentMonth && 
                            this.currentYear === currentYear;
            
            const hasEvents = this.hasEvent(day);
            const dayEvents = this.getEventsForDay(day);
            
            let classNames = 'calendar-day';
            if (isToday) classNames += ' today';
            if (hasEvents) classNames += ' has-events';
            
            calendarHTML += `<div class="${classNames}" data-day="${day}">
                <span class="day-number">${day}</span>`;
            
            if (hasEvents) {
                calendarHTML += `<div class="event-indicator">`;
                
                // Add different colored indicators for different event types
                const eventTypes = new Set(dayEvents.map(e => e.type));
                
                if (eventTypes.has('breakfast')) {
                    calendarHTML += `<span class="event-dot breakfast"></span>`;
                }
                if (eventTypes.has('meeting')) {
                    calendarHTML += `<span class="event-dot meeting"></span>`;
                }
                if (eventTypes.has('techie')) {
                    calendarHTML += `<span class="event-dot techie"></span>`;
                }
                
                calendarHTML += `</div>`;
                
                // Add hidden event details that will be shown on hover/click
                calendarHTML += `<div class="event-tooltip">`;
                dayEvents.forEach(event => {
                    calendarHTML += `
                        <div class="event-item ${event.type}">
                            <span class="event-title">${event.title}</span>
                            <span class="event-time">${event.time}</span>
                            <span class="event-location">${event.location}</span>
                        </div>`;
                });
                calendarHTML += `</div>`;
            }
            
            calendarHTML += `</div>`;
        }
        
        calendarHTML += `
                </div>
                <div class="calendar-legend">
                    <div class="legend-item">
                        <span class="event-dot breakfast"></span> Breakfast
                    </div>
                    <div class="legend-item">
                        <span class="event-dot meeting"></span> Meeting
                    </div>
                    <div class="legend-item">
                        <span class="event-dot techie"></span> Techie Night
                    </div>
                </div>
            </div>
        `;
        
        this.container.innerHTML = calendarHTML;
        this.attachEventListeners();
    }

    attachEventListeners() {
        const prevButton = this.container.querySelector('.prev-month');
        const nextButton = this.container.querySelector('.next-month');
        
        if (prevButton) {
            prevButton.addEventListener('click', () => this.navigateMonth(-1));
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', () => this.navigateMonth(1));
        }
        
        // Add event listeners for day cells with events
        const daysWithEvents = this.container.querySelectorAll('.calendar-day.has-events');
        daysWithEvents.forEach(dayElement => {
            // For desktop: show tooltip on hover
            dayElement.addEventListener('mouseenter', function() {
                const tooltip = this.querySelector('.event-tooltip');
                if (tooltip) {
                    tooltip.style.display = 'block';
                }
            });
            
            dayElement.addEventListener('mouseleave', function() {
                const tooltip = this.querySelector('.event-tooltip');
                if (tooltip) {
                    tooltip.style.display = 'none';
                }
            });
            
            // For mobile: toggle tooltip on tap
            dayElement.addEventListener('click', function() {
                const tooltip = this.querySelector('.event-tooltip');
                if (tooltip) {
                    const currentDisplay = tooltip.style.display;
                    tooltip.style.display = currentDisplay === 'block' ? 'none' : 'block';
                }
            });
        });
    }
}

// Modified EventDetailsManager initialization
document.addEventListener('DOMContentLoaded', () => {
    const eventDetailsManager = new EventDetailsManager();
    eventDetailsManager.updateEventsDisplay();
    eventDetailsManager.updateRecordingsDisplay();
    
    // Initialize the calendar widget
    const calendarContainer = document.querySelector('.calendar-container');
    if (calendarContainer) {
        const calendarWidget = new CalendarWidget('.calendar-container');
        calendarWidget.init(eventDetailsManager);
    }

    // Update the display at midnight
    setInterval(() => {
        const now = new Date();
        if (now.getHours() === 0 && now.getMinutes() === 0) {
            eventDetailsManager.updateEventsDisplay();
            
            // Also update the calendar
            if (calendarContainer) {
                const calendarWidget = new CalendarWidget('.calendar-container');
                calendarWidget.init(eventDetailsManager);
            }
        }
    }, 60000);
});

// Add this function to your JavaScript file
function positionTooltips() {
    const calendarDays = document.querySelectorAll('.calendar-day');
    
    calendarDays.forEach(day => {
        const tooltip = day.querySelector('.event-tooltip');
        if (!tooltip) return;
        
        day.addEventListener('mouseenter', () => {
            // Reset position classes
            tooltip.classList.remove('position-top', 'position-bottom', 'position-left', 'position-right');
            
            // Get positions
            const dayRect = day.getBoundingClientRect();
            const calendarRect = document.querySelector('.calendar-widget').getBoundingClientRect();
            
            // Calculate available space in each direction
            const spaceTop = dayRect.top - calendarRect.top;
            const spaceBottom = calendarRect.bottom - dayRect.bottom;
            const spaceLeft = dayRect.left - calendarRect.left;
            const spaceRight = calendarRect.right - dayRect.right;
            
            // Determine best position based on available space
            if (spaceRight >= 150) {
                tooltip.classList.add('position-right');
            } else if (spaceLeft >= 150) {
                tooltip.classList.add('position-left');
            } else if (spaceBottom >= 100) {
                tooltip.classList.add('position-bottom');
            } else {
                tooltip.classList.add('position-top');
            }
        });
    });
}

// Call this function after calendar is rendered
window.addEventListener('load', positionTooltips);
// Also call it when month changes if you have month navigation
document.querySelectorAll('.calendar-header button').forEach(button => {
    button.addEventListener('click', () => {
        // Wait for the calendar to update
        setTimeout(positionTooltips, 100);
    });
});