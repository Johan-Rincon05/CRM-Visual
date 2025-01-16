document.addEventListener('DOMContentLoaded', function() {
    let currentDate = new Date();
    let events = [];

    // Initialize calendar
    function initCalendar() {
        updateCalendarHeader();
        renderCalendar();
        setupEventListeners();
    }

    function updateCalendarHeader() {
        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                           'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        document.getElementById('currentMonth').textContent = 
            `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }

    function renderCalendar() {
        const grid = document.getElementById('calendarGrid');
        grid.innerHTML = '';

        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        // Get the first Monday before the first day of the month
        const startDate = new Date(firstDay);
        startDate.setDate(firstDay.getDate() - firstDay.getDay() + (firstDay.getDay() === 0 ? -6 : 1));

        for (let i = 0; i < 42; i++) {
            const currentDay = new Date(startDate);
            currentDay.setDate(startDate.getDate() + i);
            
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day' + 
                (currentDay.getMonth() !== currentDate.getMonth() ? ' other-month' : '');
            
            // Add date number
            const dateNumber = document.createElement('div');
            dateNumber.className = 'date';
            dateNumber.textContent = currentDay.getDate();
            dayElement.appendChild(dateNumber);

            // Add events for this day
            const dayEvents = events.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate.toDateString() === currentDay.toDateString();
            });

            dayEvents.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.className = `event ${event.type}`;
                eventElement.textContent = `${event.time} - ${event.title}`;
                eventElement.addEventListener('click', () => showEventDetails(event));
                dayElement.appendChild(eventElement);
            });

            grid.appendChild(dayElement);
        }
    }

    function setupEventListeners() {
        document.getElementById('prevMonth').addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            updateCalendarHeader();
            renderCalendar();
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            updateCalendarHeader();
            renderCalendar();
        });

        document.getElementById('addEventBtn').addEventListener('click', () => {
            document.getElementById('eventModal').style.display = 'block';
        });

        document.querySelectorAll('.close-modal').forEach(button => {
            button.addEventListener('click', function() {
                this.closest('.modal').style.display = 'none';
            });
        });

        document.getElementById('eventForm').addEventListener('submit', handleEventSubmit);
    }

    function handleEventSubmit(e) {
        e.preventDefault();

        const newEvent = {
            title: document.getElementById('eventTitle').value,
            type: document.getElementById('eventType').value,
            date: document.getElementById('eventDate').value,
            time: document.getElementById('eventTime').value,
            participants: document.getElementById('eventParticipants').value.split(',').map(p => p.trim()),
            description: document.getElementById('eventDescription').value,
            attachments: document.getElementById('eventAttachments').value.split('\n').map(a => a.trim())
        };

        events.push(newEvent);
        renderCalendar();
        
        document.getElementById('eventModal').style.display = 'none';
        e.target.reset();
        
        showNotification('Reunión programada exitosamente');
        scheduleEventReminder(newEvent);
    }

    function showEventDetails(event) {
        const modal = document.getElementById('eventDetailsModal');
        const content = document.getElementById('eventDetails');
        
        content.innerHTML = `
            <h3>${event.title}</h3>
            <p><strong>Fecha:</strong> ${formatDate(event.date)}</p>
            <p><strong>Hora:</strong> ${event.time}</p>
            <p><strong>Tipo:</strong> ${formatEventType(event.type)}</p>
            <p><strong>Participantes:</strong> ${event.participants.join(', ')}</p>
            <p><strong>Descripción:</strong> ${event.description}</p>
            <div class="attachments">
                <strong>Documentos:</strong>
                <ul>
                    ${event.attachments.map(a => `<li><a href="${a}" target="_blank">${a}</a></li>`).join('')}
                </ul>
            </div>
        `;
        
        modal.style.display = 'block';
    }

    function formatEventType(type) {
        const types = {
            planning: 'Planificación',
            recording: 'Grabación',
            review: 'Revisión'
        };
        return types[type] || type;
    }

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.getElementById('notificationContainer').appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    function scheduleEventReminder(event) {
        const eventTime = new Date(event.date + 'T' + event.time);
        const reminderTime = new Date(eventTime.getTime() - 30 * 60000); // 30 minutes before

        if (reminderTime > new Date()) {
            setTimeout(() => {
                showNotification(`Recordatorio: "${event.title}" comienza en 30 minutos`);
            }, reminderTime - new Date());
        }
    }

    // Initialize the calendar
    initCalendar();
});
