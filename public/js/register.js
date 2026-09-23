const API_BASE_URL = 'https://calitrack-0hau.onrender.com';

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirmPassword').value;
    
    if (password !== confirm) {
        alert('Passwords do not match');
        return;
    }
    
    try {
        const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, fitness_level: 'beginner' })
        });
        const data = await res.json();
        
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = 'dashboard.html';
        } else {
            alert('Registration failed: ' + (data.error || 'Try again'));
        }
    } catch (err) {
        alert('Error: ' + err.message);
    }
});