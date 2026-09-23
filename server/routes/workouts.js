const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../database');
const router = express.Router();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied.' });
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

// GET all workouts WITH their exercises
router.get('/', authenticateToken, async (req, res) => {
    try {
        const [workouts] = await db.query(
            'SELECT * FROM workouts WHERE user_id = ? ORDER BY workout_date DESC',
            [req.user.id]
        );

        // Fetch exercises for each workout
        for (const w of workouts) {
            const [exercises] = await db.query(
                'SELECT id, exercise_name, sets, reps, hold_time FROM exercises WHERE workout_id = ?',
                [w.id]
            );
            w.exercises = exercises;
        }

        res.json(workouts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// CREATE workout
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { name, notes } = req.body;
        const [result] = await db.query(
            'INSERT INTO workouts (user_id, workout_date, name, notes) VALUES (?, NOW(), ?, ?)',
            [req.user.id, name || 'Workout', notes || '']
        );
        res.status(201).json({ message: 'Workout saved', workoutId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE workout
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const [result] = await db.query(
            'DELETE FROM workouts WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
        res.json({ message: 'Deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ADD exercise to a workout
router.post('/:id/exercises', authenticateToken, async (req, res) => {
    try {
        const workoutId = req.params.id;
        const { exercise_name, sets, reps, hold_time } = req.body;

        // Verify workout belongs to this user
        const [check] = await db.query(
            'SELECT id FROM workouts WHERE id = ? AND user_id = ?',
            [workoutId, req.user.id]
        );
        if (check.length === 0) return res.status(404).json({ error: 'Workout not found' });

        const [result] = await db.query(
            'INSERT INTO exercises (workout_id, exercise_name, sets, reps, hold_time) VALUES (?, ?, ?, ?, ?)',
            [workoutId, exercise_name, sets || null, reps || null, hold_time || null]
        );

        res.status(201).json({ message: 'Exercise added', exerciseId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE exercise
router.delete('/exercises/:id', authenticateToken, async (req, res) => {
    try {
        // Verify the exercise belongs to a workout owned by this user
        const [check] = await db.query(
            `SELECT e.id FROM exercises e
             JOIN workouts w ON e.workout_id = w.id
             WHERE e.id = ? AND w.user_id = ?`,
            [req.params.id, req.user.id]
        );
        if (check.length === 0) return res.status(404).json({ error: 'Not found' });

        await db.query('DELETE FROM exercises WHERE id = ?', [req.params.id]);
        res.json({ message: 'Deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;