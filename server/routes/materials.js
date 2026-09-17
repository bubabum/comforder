const express = require('express');
const router = express.Router();
const pool = require('../config/db');

const SELECT_WITH_JOINS = `
    SELECT
        m.id,
        m.color_id,
        c.name AS color_name,
        m.coating_id,
        co.name AS coating_name,
        m.thickness,
        m.price,
        m.extra_price,
        m.trim_price_category_id,
        tpt.name AS trim_price_category_name
    FROM materials m
    JOIN colors c ON c.id = m.color_id
    JOIN coatings co ON co.id = m.coating_id
    JOIN trim_price_categories tpt ON tpt.id = m.trim_price_category_id
`;

// GET всі матеріали (з підтягнутими назвами)
router.get('/', async (req, res) => {
	try {
		const [rows] = await pool.execute(`${SELECT_WITH_JOINS} ORDER BY m.id`);
		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Server error' });
	}
});

// GET один матеріал по id
router.get('/:id', async (req, res) => {
	try {
		const [rows] = await pool.execute(
			`${SELECT_WITH_JOINS} WHERE m.id = ?`,
			[req.params.id]
		);

		if (rows.length === 0) {
			return res.status(404).json({ error: 'Not found' });
		}

		res.json(rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Server error' });
	}
});

// POST новий матеріал
router.post('/', async (req, res) => {
	const { color_id, coating_id, thickness, price, extra_price, trim_price_category_id } = req.body;

	if (!color_id || !coating_id || thickness == null || price == null || extra_price == null || !trim_price_category_id) {
		return res.status(400).json({ error: 'All fields are required', body: req.body });
	}

	try {
		const [result] = await pool.execute(
			`INSERT INTO materials (color_id, coating_id, thickness, price, extra_price, trim_price_category_id)
             VALUES (?, ?, ?, ?, ?, ?)`,
			[color_id, coating_id, thickness, price, extra_price, trim_price_category_id]
		);

		const [rows] = await pool.execute(
			`${SELECT_WITH_JOINS} WHERE m.id = ?`,
			[result.insertId]
		);

		res.status(201).json(rows[0]);
	} catch (err) {
		console.error(err);
		if (err.code === 'ER_NO_REFERENCED_ROW_2') {
			return res.status(400).json({ error: 'Invalid color_id, coating_id or trim_price_category_id' });
		}
		res.status(500).json({ error: 'Server error' });
	}
});

// PUT оновлення матеріалу
router.put('/:id', async (req, res) => {
	const { color_id, coating_id, thickness, price, extra_price, trim_price_category_id } = req.body;

	if (!color_id || !coating_id || thickness == null || price == null || extra_price == null || !trim_price_category_id) {
		return res.status(400).json({ error: 'All fields are required', body: req.body });
	}

	try {
		const [result] = await pool.execute(
			`UPDATE materials
             SET color_id = ?, coating_id = ?, thickness = ?, price = ?, extra_price = ?, trim_price_category_id = ?
             WHERE id = ?`,
			[color_id, coating_id, thickness, price, extra_price, trim_price_category_id, req.params.id]
		);

		if (result.affectedRows === 0) {
			return res.status(404).json({ error: 'Not found' });
		}

		const [rows] = await pool.execute(
			`${SELECT_WITH_JOINS} WHERE m.id = ?`,
			[req.params.id]
		);

		res.json(rows[0]);
	} catch (err) {
		console.error(err);
		if (err.code === 'ER_NO_REFERENCED_ROW_2') {
			return res.status(400).json({ error: 'Invalid color_id, coating_id or trim_price_category_id' });
		}
		res.status(500).json({ error: 'Server error' });
	}
});

// DELETE матеріал
router.delete('/:id', async (req, res) => {
	try {
		const [result] = await pool.execute(
			'DELETE FROM materials WHERE id = ?',
			[req.params.id]
		);

		if (result.affectedRows === 0) {
			return res.status(404).json({ error: 'Not found' });
		}

		res.status(204).send();
	} catch (err) {
		console.error(err);
		if (err.code === 'ER_ROW_IS_REFERENCED_2') {
			return res.status(409).json({ error: 'Material is in use' });
		}
		res.status(500).json({ error: 'Server error' });
	}
});

module.exports = router;