const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/:id', async (req, res) => {
	const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
	try {
		const [rows] = await pool.execute(
			'SELECT id, name, price FROM product_options WHERE product_id = ?',
			[req.params.id]
		);
		// await delay(3000);
		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Server error' });
	}
});

module.exports = router;