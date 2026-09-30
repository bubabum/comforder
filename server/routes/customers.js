const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { SERVER_ERROR, NOT_FOUND, NAME_REQUIRED } = require('../utils/errorMessages');

router.get('/', async (req, res) => {
	try {
		const [rows] = await pool.execute(
			'SELECT * FROM customers WHERE is_active = 1 ORDER BY name'
		);
		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: SERVER_ERROR });
	}
});

router.get('/:id', async (req, res) => {
	try {
		const [rows] = await pool.execute(
			'SELECT * FROM customers WHERE id = ?',
			[req.params.id]
		);
		if (rows.length === 0) {
			return res.status(404).json({ error: NOT_FOUND });
		}
		res.json(rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: SERVER_ERROR });
	}
});

router.post('/', async (req, res) => {
	const { name, phone, email, address, notes } = req.body;

	if (!name || !name.trim()) {
		return res.status(400).json({ error: NAME_REQUIRED });
	}

	try {
		const [result] = await pool.execute(
			'INSERT INTO customers (name, phone, email, address, notes) VALUES (?, ?, ?, ?, ?)',
			[name.trim(), phone || null, email || null, address || null, notes || null]
		);

		res.status(201).json({
			id: result.insertId,
			name: name.trim(),
			phone: phone || null,
			email: email || null,
			address: address || null,
			notes: notes || null,
			is_active: 1,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: SERVER_ERROR });
	}
});

router.put('/:id', async (req, res) => {
	const { name, phone, email, address, notes } = req.body;

	if (!name || !name.trim()) {
		return res.status(400).json({ error: NAME_REQUIRED });
	}

	try {
		const [result] = await pool.execute(
			'UPDATE customers SET name = ?, phone = ?, email = ?, address = ?, notes = ? WHERE id = ?',
			[name.trim(), phone || null, email || null, address || null, notes || null, req.params.id]
		);

		if (result.affectedRows === 0) {
			return res.status(404).json({ error: NOT_FOUND });
		}

		res.json({
			id: Number(req.params.id),
			name: name.trim(),
			phone: phone || null,
			email: email || null,
			address: address || null,
			notes: notes || null,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: SERVER_ERROR });
	}
});

router.delete('/:id', async (req, res) => {
	try {
		const [result] = await pool.execute(
			'UPDATE customers SET is_active = 0 WHERE id = ?',
			[req.params.id]
		);
		if (result.affectedRows === 0) {
			return res.status(404).json({ error: NOT_FOUND });
		}
		res.status(204).send();
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: SERVER_ERROR });
	}
});

module.exports = router;