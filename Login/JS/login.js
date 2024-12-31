document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.login-form');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        form.classList.add('loading');
        
        // Simular proceso de login
        setTimeout(() => {
            form.classList.remove('loading');
            window.location.href = 'dashboard.html';
        }, 2000);
    });
});
