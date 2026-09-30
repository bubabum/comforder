const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { SERVER_ERROR } = require('../utils/errorMessages');

router.get('/', async (req, res) => {
	try {
		const [rows] = await pool.execute('SELECT * FROM units ORDER BY name');
		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: SERVER_ERROR });
	}
});

module.exports = router;