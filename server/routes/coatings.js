const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
	try {
		const [rows] = await pool.execute('SELECT * FROM coatings ORDER BY id');
		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Server error' });
	}
});

module.exports = router;