if (!localStorage.getItem('token')) {
    window.location.href = 'login.html';
}

// API_BASE_URL is already defined in auth.js, so don't redeclare
const token = localStorage.getItem('token');

async function loadStats() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/workouts`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const workouts = await res.json();
            document.getElementById('totalWorkouts').innerText = workouts.length;
            document.getElementById('totalCalories').innerText = workouts.length * 100;
        }
    } catch (err) {
        console.error(err);
    }
}

// Only run if the elements exist
if (document.getElementById('totalWorkouts')) {
    loadStats();
}