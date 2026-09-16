const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
	try {
		const [rows] = await pool.execute(`
			SELECT
                p.id,
                p.name,
                p.type,
                p.category_id,
                c.name AS category_name,
                p.unit_id,
                u.name AS unit_name,
                p.width,
                p.price,
                p.price_multiplier,
                p.quantity_step,
                p.trim_price_type
            FROM products p
            JOIN categories c ON c.id = p.category_id
            JOIN units u ON u.id = p.unit_id
            WHERE p.is_active = 1
            ORDER BY p.id
			`);
		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Server error' });
	}
});

module.exports = router;