﻿if (!localStorage.getItem('token')) {
    window.location.href = 'login.html';
}

const API = 'https://calisthenics-app-rnsz.onrender.com';
const token = localStorage.getItem('token');

async function loadWorkouts() {
    console.log('Loading workouts...');
    
    try {
        const res = await fetch(API + '/api/workouts/my-workouts', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        
        console.log('Response status:', res.status);
        
        if (!res.ok) {
            console.error('API error:', res.status);
            document.getElementById('workoutsList').innerHTML = '<div class="empty-message">Error loading workouts. Please refresh.</div>';
            return;
        }
        
        const workouts = await res.json();
        console.log('Workouts from API:', workouts);
        
        const container = document.getElementById('workoutsList');
        
        if (!workouts || workouts.length === 0) {
            container.innerHTML = '<div class="empty-message">No workouts yet. Create your first workout!</div>';
            return;
        }
        
        container.innerHTML = '';
        for (let i = 0; i < workouts.length; i++) {
            const w = workouts[i];
            console.log('Rendering workout:', w.name);
            
            container.innerHTML += `
                <div class="workout-card">
                    <div class="workout-header" onclick="toggleWorkout(${w.id})">
                        <div>
                            <div class="workout-title">${escapeHtml(w.name)}</div>
                            <div class="exercise-count">${w.exercises ? w.exercises.length : 0} exercises</div>
                        </div>
                        <button class="delete-workout" onclick="event.stopPropagation(); deleteWorkout(${w.id})">🗑️</button>
                    </div>
                    <div class="workout-exercises" id="exercises-${w.id}">
                        ${(w.exercises && w.exercises.length > 0) ? w.exercises.map(ex => `
                            <div class="exercise-item">
                                <div>
                                    <div class="exercise-name">${escapeHtml(ex.name)}</div>
                                    <div class="exercise-details">${ex.sets} sets × ${ex.reps} reps</div>
                                </div>
                                <button class="delete-exercise" onclick="deleteExercise(${ex.id})">🗑️</button>
                            </div>
                        `).join('') : '<div class="empty-message" style="padding: 10px;">No exercises yet. Add your first exercise!</div>'}
                        <button class="add-exercise-btn" onclick="openModal(${w.id})">+ Add Exercise</button>
                    </div>
                </div>
            `;
        }
    } catch (err) {
        console.error('Error loading workouts:', err);
        document.getElementById('workoutsList').innerHTML = '<div class="empty-message">Error loading workouts: ' + err.message + '</div>';
    }
}

function toggleWorkout(id) {
    const el = document.getElementById('exercises-' + id);
    if (el) el.classList.toggle('show');
}

async function addWorkout() {
    const name = document.getElementById('workoutName').value.trim();
    if (!name) {
        alert('Please enter a workout name');
        return;
    }
    
    console.log('Adding workout:', name);
    
    try {
        const res = await fetch(API + '/api/workouts/my-workouts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ name: name })
        });
        
        console.log('Add response status:', res.status);
        
        if (!res.ok) {
            const error = await res.json();
            console.error('Error:', error);
            alert('Failed to create workout: ' + (error.error || 'Unknown error'));
            return;
        }
        
        const result = await res.json();
        console.log('Created workout:', result);
        
        document.getElementById('workoutName').value = '';
        await loadWorkouts();
    } catch (err) {
        console.error('Error adding workout:', err);
        alert('Failed to create workout: ' + err.message);
    }
}

async function deleteWorkout(id) {
    if (!confirm('Delete this workout?')) return;
    
    try {
        const res = await fetch(API + '/api/workouts/my-workouts/' + id, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        });
        
        if (!res.ok) {
            alert('Failed to delete workout');
            return;
        }
        
        await loadWorkouts();
    } catch (err) {
        console.error('Error:', err);
        alert('Failed to delete workout');
    }
}

function openModal(workoutId) {
    window.currentWorkoutId = workoutId;
    document.getElementById('exerciseName').value = '';
    document.getElementById('exerciseSets').value = '';
    document.getElementById('exerciseReps').value = '';
    document.getElementById('exerciseModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('exerciseModal').style.display = 'none';
}

async function addExercise() {
    const name = document.getElementById('exerciseName').value.trim();
    const sets = parseInt(document.getElementById('exerciseSets').value);
    const reps = parseInt(document.getElementById('exerciseReps').value);
    
    if (!name) {
        alert('Please enter an exercise name');
        return;
    }
    if (isNaN(sets) || sets < 1) {
        alert('Please enter valid sets');
        return;
    }
    if (isNaN(reps) || reps < 1) {
        alert('Please enter valid reps');
        return;
    }
    
    try {
        const res = await fetch(API + '/api/workouts/my-workouts/' + window.currentWorkoutId + '/exercises', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ name: name, sets: sets, reps: reps })
        });
        
        if (!res.ok) {
            const error = await res.json();
            alert('Failed to add exercise: ' + (error.error || 'Unknown error'));
            return;
        }
        
        closeModal();
        await loadWorkouts();
    } catch (err) {
        console.error('Error:', err);
        alert('Failed to add exercise: ' + err.message);
    }
}

async function deleteExercise(exerciseId) {
    if (!confirm('Delete this exercise?')) return;
    
    try {
        const res = await fetch(API + '/api/workouts/my-exercises/' + exerciseId, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        });
        
        if (!res.ok) {
            alert('Failed to delete exercise');
            return;
        }
        
        await loadWorkouts();
    } catch (err) {
        console.error('Error:', err);
        alert('Failed to delete exercise');
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Set up event listeners
document.getElementById('addWorkoutBtn').onclick = addWorkout;
document.getElementById('saveExerciseBtn').onclick = addExercise;
document.getElementById('workoutName').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addWorkout();
});

window.onclick = (event) => {
    if (event.target === document.getElementById('exerciseModal')) {
        closeModal();
    }
};

// Load workouts when page loads
loadWorkouts();