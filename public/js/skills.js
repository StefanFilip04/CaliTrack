if (!localStorage.getItem('token')) {
    window.location.href = 'login.html';
}

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const category = btn.dataset.category;
        
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        document.querySelectorAll('.category-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(category).classList.add('active');
    });
});