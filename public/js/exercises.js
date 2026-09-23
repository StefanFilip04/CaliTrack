if (!localStorage.getItem('token')) {
    window.location.href = 'login.html';
}

const API_BASE_URL = '';
const token = localStorage.getItem('token');

const exercises = [
    // Push exercises
    { id: 1, name: "Planche", category: "push", muscles: "Shoulders, Chest, Triceps", difficulty: "elite" },
    { id: 2, name: "Handstand Pushup", category: "push", muscles: "Shoulders, Triceps", difficulty: "advanced" },
    { id: 3, name: "90° Pushup", category: "push", muscles: "Shoulders, Chest", difficulty: "elite" },
    { id: 4, name: "Pseudo Planche Pushup", category: "push", muscles: "Shoulders, Chest", difficulty: "intermediate" },
    { id: 5, name: "Dips", category: "push", muscles: "Chest, Triceps", difficulty: "beginner" },
    { id: 6, name: "Pushup", category: "push", muscles: "Chest, Triceps", difficulty: "beginner" },
    { id: 7, name: "Decline Pushup", category: "push", muscles: "Upper Chest", difficulty: "intermediate" },
    { id: 8, name: "Archer Pushup", category: "push", muscles: "Chest, Triceps", difficulty: "advanced" },
    { id: 9, name: "Ring Pushup", category: "push", muscles: "Chest, Triceps, Core", difficulty: "intermediate" },
    { id: 10, name: "RTO Pushup", category: "push", muscles: "Chest, Triceps", difficulty: "advanced" },
    
    // Pull exercises
    { id: 11, name: "Front Lever", category: "pull", muscles: "Back, Core, Biceps", difficulty: "elite" },
    { id: 12, name: "Muscle-up", category: "pull", muscles: "Back, Biceps, Triceps", difficulty: "advanced" },
    { id: 13, name: "One Arm Pull-up", category: "pull", muscles: "Back, Biceps", difficulty: "elite" },
    { id: 14, name: "Pull-up", category: "pull", muscles: "Back, Biceps", difficulty: "beginner" },
    { id: 15, name: "Back Lever", category: "pull", muscles: "Back, Core, Shoulders", difficulty: "advanced" },
    { id: 16, name: "Wide Pull-up", category: "pull", muscles: "Lats", difficulty: "intermediate" },
    { id: 17, name: "Chin-up", category: "pull", muscles: "Biceps, Back", difficulty: "beginner" },
    { id: 18, name: "Typewriter Pull-up", category: "pull", muscles: "Lats, Biceps", difficulty: "advanced" },
    { id: 19, name: "Archer Pull-up", category: "pull", muscles: "Lats, Biceps", difficulty: "advanced" },
    { id: 20, name: "Ice Cream Maker", category: "pull", muscles: "Back, Core", difficulty: "intermediate" },
    
    // Legs exercises
    { id: 21, name: "Pistol Squat", category: "legs", muscles: "Quads, Glutes, Hamstrings", difficulty: "intermediate" },
    { id: 22, name: "Shrimp Squat", category: "legs", muscles: "Quads, Glutes", difficulty: "advanced" },
    { id: 23, name: "Sissy Squat", category: "legs", muscles: "Quads", difficulty: "intermediate" },
    { id: 24, name: "Nordic Curl", category: "legs", muscles: "Hamstrings", difficulty: "advanced" },
    { id: 25, name: "Single Leg Squat", category: "legs", muscles: "Quads, Glutes", difficulty: "intermediate" },
    { id: 26, name: "Bulgarian Split Squat", category: "legs", muscles: "Quads, Glutes", difficulty: "beginner" },
    { id: 27, name: "Cossack Squat", category: "legs", muscles: "Adductors, Quads", difficulty: "intermediate" },
    { id: 28, name: "Deep Step-up", category: "legs", muscles: "Quads, Glutes", difficulty: "beginner" },
    { id: 29, name: "Box Jump", category: "legs", muscles: "Quads, Glutes, Calves", difficulty: "intermediate" },
    { id: 30, name: "Broad Jump", category: "legs", muscles: "Quads, Glutes, Hamstrings", difficulty: "intermediate" },
    
    // Core exercises
    { id: 31, name: "Dragon Flag", category: "core", muscles: "Abs, Core", difficulty: "advanced" },
    { id: 32, name: "Human Flag", category: "core", muscles: "Obliques, Shoulders, Lats", difficulty: "elite" },
    { id: 33, name: "L-Sit", category: "core", muscles: "Abs, Hip Flexors", difficulty: "intermediate" },
    { id: 34, name: "V-Sit", category: "core", muscles: "Abs, Core", difficulty: "advanced" },
    { id: 35, name: "Hanging Leg Raise", category: "core", muscles: "Abs", difficulty: "intermediate" },
    { id: 36, name: "Ab Wheel Rollout", category: "core", muscles: "Abs", difficulty: "advanced" },
    { id: 37, name: "Plank", category: "core", muscles: "Abs, Core", difficulty: "beginner" },
    { id: 38, name: "Side Plank", category: "core", muscles: "Obliques", difficulty: "beginner" },
    { id: 39, name: "Reverse Hyperextension", category: "core", muscles: "Lower Back", difficulty: "intermediate" },
    { id: 40, name: "Window Wiper", category: "core", muscles: "Obliques, Abs", difficulty: "advanced" },
    
    // Skills
    { id: 41, name: "Handstand", category: "skill", muscles: "Shoulders, Core, Balance", difficulty: "intermediate" },
    { id: 42, name: "Freestanding HSPU", category: "skill", muscles: "Shoulders, Triceps", difficulty: "elite" },
    { id: 43, name: "Elbow Lever", category: "skill", muscles: "Core, Shoulders", difficulty: "beginner" },
    { id: 44, name: "Tuck Planche", category: "skill", muscles: "Shoulders", difficulty: "intermediate" },
    { id: 45, name: "Advanced Tuck Planche", category: "skill", muscles: "Shoulders", difficulty: "advanced" },
    { id: 46, name: "Straddle Planche", category: "skill", muscles: "Shoulders", difficulty: "elite" },
    { id: 47, name: "Crow Pose", category: "skill", muscles: "Arms, Core", difficulty: "beginner" },
    { id: 48, name: "Headstand", category: "skill", muscles: "Neck, Shoulders, Core", difficulty: "beginner" }
];

let userProgress = {};
let currentCategory = 'all';

async function loadProgress() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/workouts/exercise-progress`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const progress = await res.json();
            userProgress = {};
            progress.forEach(p => {
                const key = `${p.category}_${p.exercise_id}`;
                userProgress[key] = p.completed === 1;
            });
        }
    } catch (err) {
        console.error('Error loading progress:', err);
    }
    updateAllPercentages();
    renderExercises();
}

async function saveProgress(category, exerciseId, completed) {
    try {
        const res = await fetch(`${API_BASE_URL}/api/workouts/exercise-progress`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ category, exerciseId, completed: completed ? 1 : 0 })
        });
        if (!res.ok) {
            console.error('Save failed:', await res.text());
        }
    } catch (err) {
        console.error('Error saving progress:', err);
    }
}

function updateCategoryPercentage(category) {
    const categoryExercises = exercises.filter(ex => ex.category === category);
    if (categoryExercises.length === 0) return 0;
    
    let completed = 0;
    categoryExercises.forEach(ex => {
        const key = `${category}_${ex.id}`;
        if (userProgress[key]) completed++;
    });
    
    const percent = Math.round((completed / categoryExercises.length) * 100);
    const percentEl = document.getElementById(`percent-${category}`);
    if (percentEl) percentEl.innerText = `${percent}%`;
    return percent;
}

function updateAllPercentages() {
    const categories = ['push', 'pull', 'legs', 'core', 'skill'];
    let totalCompleted = 0;
    let totalExercises = 0;
    
    categories.forEach(cat => {
        const catExercises = exercises.filter(ex => ex.category === cat);
        totalExercises += catExercises.length;
        
        let completed = 0;
        catExercises.forEach(ex => {
            const key = `${cat}_${ex.id}`;
            if (userProgress[key]) completed++;
        });
        totalCompleted += completed;
        
        const percent = Math.round((completed / catExercises.length) * 100);
        const percentEl = document.getElementById(`percent-${cat}`);
        if (percentEl) percentEl.innerText = `${percent}%`;
    });
    
    const overallPercent = totalExercises === 0 ? 0 : Math.round((totalCompleted / totalExercises) * 100);
    const fillEl = document.getElementById('totalProgressFill');
    const percentEl = document.getElementById('totalProgressPercent');
    if (fillEl) fillEl.style.width = `${overallPercent}%`;
    if (percentEl) percentEl.innerText = `${overallPercent}%`;
}

function getDifficultyClass(difficulty) {
    return `difficulty-${difficulty}`;
}

function getEmojiForExercise(name) {
    const emojis = {
        'Planche': '💪', 'Handstand Pushup': '🙃', 'Pushup': '💪', 'Dips': '🏋️',
        'Front Lever': '🦅', 'Muscle-up': '⚡', 'Pull-up': '💪', 'Back Lever': '🦅',
        'Pistol Squat': '🦵', 'Shrimp Squat': '🦵', 'Dragon Flag': '🎯', 'Human Flag': '🏁',
        'L-Sit': '📐', 'V-Sit': '📐', 'Handstand': '🙃', 'Crow Pose': '🐦'
    };
    return emojis[name] || '🎯';
}

function renderExercises() {
    const grid = document.getElementById('exercisesGrid');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    let filtered = exercises;
    if (currentCategory !== 'all') {
        filtered = filtered.filter(ex => ex.category === currentCategory);
    }
    if (searchTerm) {
        filtered = filtered.filter(ex => ex.name.toLowerCase().includes(searchTerm));
    }
    
    if (filtered.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px; color: #aaa;">No exercises found</div>';
        return;
    }
    
    grid.innerHTML = filtered.map(ex => {
        const key = `${ex.category}_${ex.id}`;
        const isCompleted = userProgress[key] || false;
        
        return `
            <div class="exercise-card">
                <div class="exercise-image" style="background: linear-gradient(135deg, #1a1a2e, #0a0a0a); display: flex; align-items: center; justify-content: center; font-size: 48px; min-height: 160px;">
                    ${getEmojiForExercise(ex.name)}
                    <input type="checkbox" class="exercise-checkbox" data-category="${ex.category}" data-id="${ex.id}" ${isCompleted ? 'checked' : ''}>
                    <span class="exercise-difficulty ${getDifficultyClass(ex.difficulty)}">${ex.difficulty}</span>
                </div>
                <div class="exercise-info">
                    <div class="exercise-name">${ex.name}</div>
                    <div class="exercise-muscles">${ex.muscles}</div>
                    ${isCompleted ? '<div class="completed-badge">✓ Completed</div>' : ''}
                </div>
            </div>
        `;
    }).join('');
    
    // Add event listeners to checkboxes
    document.querySelectorAll('.exercise-checkbox').forEach(cb => {
        cb.addEventListener('change', async (e) => {
            e.stopPropagation();
            const category = cb.dataset.category;
            const exerciseId = parseInt(cb.dataset.id);
            const completed = cb.checked;
            
            const key = `${category}_${exerciseId}`;
            userProgress[key] = completed;
            await saveProgress(category, exerciseId, completed);
            updateAllPercentages();
            renderExercises();
        });
    });
}

// Category click handlers
document.querySelectorAll('.category').forEach(cat => {
    cat.addEventListener('click', () => {
        document.querySelectorAll('.category').forEach(c => c.classList.remove('active'));
        cat.classList.add('active');
        currentCategory = cat.dataset.category;
        renderExercises();
    });
});

// Search input
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', () => {
        renderExercises();
    });
}

// Initial load
loadProgress();