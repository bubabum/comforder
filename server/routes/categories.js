const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET всі категорії
router.get('/', async (req, res) => {
	try {
		const [rows] = await pool.execute('SELECT * FROM categories ORDER BY id');
		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Server error' });
	}
});

// GET категорія по id
router.get('/:id', async (req, res) => {
	try {
		const [rows] = await pool.execute(
			'SELECT * FROM categories WHERE id = ?',
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

// POST нова категорія
router.post('/', async (req, res) => {
	const { name } = req.body;
	if (!name || !name.trim()) {
		return res.status(400).json({ error: 'Name is required' });
	}
	try {
		const [result] = await pool.execute(
			'INSERT INTO categories (name) VALUES (?)',
			[name.trim()]
		);
		res.status(201).json({ id: result.insertId, name: name.trim() });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Server error' });
	}
});

// PUT оновлення
router.put('/:id', async (req, res) => {
	const { name } = req.body;
	if (!name || !name.trim()) {
		return res.status(400).json({ error: 'Name is required' });
	}
	try {
		const [result] = await pool.execute(
			'UPDATE categories SET name = ? WHERE id = ?',
			[name.trim(), req.params.id]
		);
		if (result.affectedRows === 0) {
			return res.status(404).json({ error: 'Not found' });
		}
		res.json({ id: Number(req.params.id), name: name.trim() });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Server error' });
	}
});

// DELETE
router.delete('/:id', async (req, res) => {
	try {
		const [result] = await pool.execute(
			'DELETE FROM categories WHERE id = ?',
			[req.params.id]
		);
		if (result.affectedRows === 0) {
			return res.status(404).json({ error: 'Not found' });
		}
		res.status(204).send();
	} catch (err) {
		console.error(err);
		// FK-конфлікт (категорія використовується товаром) — MySQL поверне ER_ROW_IS_REFERENCED_2
		if (err.code === 'ER_ROW_IS_REFERENCED_2') {
			return res.status(409).json({ error: 'Category is in use' });
		}
		res.status(500).json({ error: 'Server error' });
	}
});

module.exports = router;