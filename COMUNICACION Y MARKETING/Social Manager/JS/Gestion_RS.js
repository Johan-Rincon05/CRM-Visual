document.addEventListener('DOMContentLoaded', function() {
    let currentDate = new Date();
    let currentView = 'month';
    let draggedPost = null;

    // Initialize calendar
    updateCalendar();

    // Event Listeners
    document.getElementById('newPostBtn').addEventListener('click', openNewPostModal);
    document.getElementById('prevBtn').addEventListener('click', () => navigateCalendar('prev'));
    document.getElementById('nextBtn').addEventListener('click', () => navigateCalendar('next'));

    // View Toggle
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentView = e.target.dataset.view;
            updateCalendar();
        });
    });

    function navigateCalendar(direction) {
        if (currentView === 'month') {
            if (direction === 'prev') {
                currentDate.setMonth(currentDate.getMonth() - 1);
            } else {
                currentDate.setMonth(currentDate.getMonth() + 1);
            }
        } else {
            if (direction === 'prev') {
                currentDate.setDate(currentDate.getDate() - 7);
            } else {
                currentDate.setDate(currentDate.getDate() + 7);
            }
        }
        updateCalendar();
    }

    function updateCalendar() {
        const calendarEl = document.getElementById('calendar');
        calendarEl.innerHTML = '';

        if (currentView === 'month') {
            generateMonthView();
        } else {
            generateWeekView();
        }

        // Update current date display
        const dateDisplay = currentDate.toLocaleDateString('es', { 
            month: 'long', 
            year: 'numeric' 
        });
        document.getElementById('currentDate').textContent = 
            dateDisplay.charAt(0).toUpperCase() + dateDisplay.slice(1);
    }

    function generateMonthView() {
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const startingDay = firstDay.getDay();
        const totalDays = lastDay.getDate();

        // Add day headers
        const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        daysOfWeek.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-header';
            dayHeader.textContent = day;
            document.getElementById('calendar').appendChild(dayHeader);
        });

        // Add previous month's days
        const prevMonthDays = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
        for (let i = startingDay - 1; i >= 0; i--) {
            addCalendarDay(prevMonthDays - i, 'different-month');
        }

        // Add current month's days
        for (let i = 1; i <= totalDays; i++) {
            const isToday = isCurrentDay(i);
            addCalendarDay(i, isToday ? 'today' : '');
        }

        // Add next month's days
        const remainingDays = 42 - (startingDay + totalDays);
        for (let i = 1; i <= remainingDays; i++) {
            addCalendarDay(i, 'different-month');
        }
    }

    function generateWeekView() {
        const weekStart = getWeekStart(currentDate);
        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(weekStart);
            currentDay.setDate(weekStart.getDate() + i);
            
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day week-view';
            
            const isToday = isCurrentDay(currentDay.getDate());
            if (isToday) dayEl.classList.add('today');
            
            dayEl.innerHTML = `
                <div class="day-header">
                    <span class="day-name">${currentDay.toLocaleDateString('es', {weekday: 'long'})}</span>
                    <span class="day-number">${currentDay.getDate()}</span>
                </div>
            `;
            
            dayEl.addEventListener('dragover', handleDragOver);
            dayEl.addEventListener('drop', handleDrop);
            
            if (Math.random() > 0.7) {
                addSamplePost(dayEl);
            }
            
            document.getElementById('calendar').appendChild(dayEl);
        }
    }

    function addCalendarDay(dayNumber, additionalClass = '') {
        const dayEl = document.createElement('div');
        dayEl.className = `calendar-day ${additionalClass}`;
        dayEl.innerHTML = `<span class="day-number">${dayNumber}</span>`;
        dayEl.addEventListener('dragover', handleDragOver);
        dayEl.addEventListener('drop', handleDrop);
        
        if (Math.random() > 0.7) {
            addSamplePost(dayEl);
        }
        
        document.getElementById('calendar').appendChild(dayEl);
    }

    function addSamplePost(dayEl) {
        const platforms = ['facebook', 'instagram', 'twitter', 'linkedin'];
        const platform = platforms[Math.floor(Math.random() * platforms.length)];
        
        const postEl = document.createElement('div');
        postEl.className = `post-item platform-${platform}`;
        postEl.draggable = true;
        postEl.innerHTML = `
            <i class="fab fa-${platform}"></i>
            <span>Post de ${platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
        `;
        
        postEl.addEventListener('dragstart', handleDragStart);
        postEl.addEventListener('click', () => openPostDetails(platform));
        
        dayEl.appendChild(postEl);
    }

    function handleDragStart(e) {
        draggedPost = e.target;
        e.target.style.opacity = '0.5';
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    function handleDrop(e) {
        e.preventDefault();
        if (draggedPost) {
            const dropZone = e.target.closest('.calendar-day');
            if (dropZone) {
                dropZone.appendChild(draggedPost);
                draggedPost.style.opacity = '1';
                draggedPost = null;
            }
        }
    }

    function openPostDetails(platform) {
        const detailsModal = document.getElementById('detailsModal');
        const previewEl = detailsModal.querySelector('.post-preview');
        
        previewEl.innerHTML = `
            <div class="post-header">
                <i class="fab fa-${platform}"></i>
                <span>Post de ${platform}</span>
            </div>
            <div class="post-content">
                <p>Contenido de ejemplo para ${platform}</p>
            </div>
        `;
        
        const statValues = detailsModal.querySelectorAll('.stat-value');
        statValues.forEach(stat => {
            stat.textContent = Math.floor(Math.random() * 1000);
        });
        
        detailsModal.style.display = 'block';
    }

    function openNewPostModal() {
        const modal = document.getElementById('postModal');
        modal.style.display = 'block';
        const form = modal.querySelector('form');
        if (form) form.reset();
    }

    function isCurrentDay(day) {
        const today = new Date();
        return day === today.getDate() && 
               currentDate.getMonth() === today.getMonth() && 
               currentDate.getFullYear() === today.getFullYear();
    }

    function getWeekStart(date) {
        const start = new Date(date);
        start.setDate(date.getDate() - date.getDay());
        return start;
    }

    // Modal close handlers
    window.onclick = function(event) {
        const modals = document.getElementsByClassName('modal');
        for (let modal of modals) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        }
    }

    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.onclick = function() {
            this.closest('.modal').style.display = 'none';
        }
    });
});
