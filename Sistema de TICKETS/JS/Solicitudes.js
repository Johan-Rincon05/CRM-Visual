document.addEventListener('DOMContentLoaded', () => {
    const ticketForm = document.getElementById('ticketForm');

    ticketForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(ticketForm);
        const ticketData = Object.fromEntries(formData);

        // Here you would typically send the data to your backend
        console.log('Ticket Data:', ticketData);

        // Show success message
        showNotification('Ticket enviado exitosamente');
        
        // Reset form
        ticketForm.reset();
    });
});

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
