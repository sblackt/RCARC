document.addEventListener("DOMContentLoaded", function () {
    const eventsList = document.getElementById("events-list");
    const eventForm = document.getElementById("event-form");
    
    // Fetch events from the backend
    function fetchEvents() {
        fetch("fetch_events.php")
            .then(response => response.json())
            .then(data => {
                eventsList.innerHTML = "";
                data.forEach(event => {
                    const eventItem = document.createElement("div");
                    eventItem.innerHTML = `
                        <p>${event.date} - ${event.description}</p>
                        <button onclick="editEvent(${event.id}, '${event.date}', '${event.description}')">Edit</button>
                        <button onclick="deleteEvent(${event.id})">Delete</button>
                    `;
                    eventsList.appendChild(eventItem);
                });
            })
            .catch(error => console.error("Error fetching events:", error));
    }

    // Add or update an event
    eventForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const formData = new FormData(eventForm);
        fetch("save_event.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
            fetchEvents();
            eventForm.reset();
        })
        .catch(error => console.error("Error saving event:", error));
    });

    // Edit an event
    window.editEvent = function (id, date, description) {
        document.getElementById("event-id").value = id;
        document.getElementById("event-date").value = date;
        document.getElementById("event-description").value = description;
    }

    // Delete an event
    window.deleteEvent = function (id) {
        if (confirm("Are you sure you want to delete this event?")) {
            fetch("delete_event.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `id=${id}`
            })
            .then(response => response.text())
            .then(data => {
                alert(data);
                fetchEvents();
            })
            .catch(error => console.error("Error deleting event:", error));
        }
    }

    // Initial fetch of events
    fetchEvents();
});
