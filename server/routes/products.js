const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const {
	SERVER_ERROR,
	NOT_FOUND,
	NAME_REQUIRED,
	INVALID_PRODUCT_TYPE,
	PRODUCT_CATEGORY_UNIT_REQUIRED,
	PRODUCT_INVALID_REFERENCES,
	PRODUCT_OPTIONS_REQUIRED,
	PRODUCT_OPTION_FIELDS_REQUIRED,
	INVALID_TRIM_PRICE_TYPE,
	TRIM_FIXED_PRICES_REQUIRED,
	TRIM_FIXED_PRICE_FIELDS_REQUIRED,
	PRODUCT_IN_USE,
} = require('../utils/errorMessages');

const SELECT_LIST = `
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
`;

router.get('/', async (req, res) => {
	try {
		const [rows] = await pool.execute(`${SELECT_LIST} WHERE p.is_active = 1 ORDER BY p.id`);
		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: SERVER_ERROR });
	}
});

router.get('/:id', async (req, res) => {
	try {
		const [rows] = await pool.execute(`${SELECT_LIST} WHERE p.id = ?`, [req.params.id]);

		if (rows.length === 0) {
			return res.status(404).json({ error: NOT_FOUND });
		}

		res.json(rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: SERVER_ERROR });
	}
});

router.put('/:id', async (req, res) => {
	const {
		name,
		type,
		category_id,
		unit_id,
		width,
		price,
		price_multiplier,
		quantity_step,
		trim_price_type,
		options,
		fixed_prices,
	} = req.body;

	if (!name || !name.trim()) {
		return res.status(400).json({ error: NAME_REQUIRED });
	}
	if (!type || !['sheet', 'option', 'quantity', 'trim'].includes(type)) {
		return res.status(400).json({ error: INVALID_PRODUCT_TYPE });
	}
	if (!category_id || !unit_id) {
		return res.status(400).json({ error: PRODUCT_CATEGORY_UNIT_REQUIRED });
	}
	if (type === 'option') {
		if (!Array.isArray(options) || options.length === 0) {
			return res.status(400).json({ error: PRODUCT_OPTIONS_REQUIRED });
		}
		for (const option of options) {
			if (!option.name || !option.name.trim() || option.price == null) {
				return res.status(400).json({ error: PRODUCT_OPTION_FIELDS_REQUIRED });
			}
		}
	}
	if (type === 'trim') {
		if (!trim_price_type || !['fixed', 'widthBased'].includes(trim_price_type)) {
			return res.status(400).json({ error: INVALID_TRIM_PRICE_TYPE });
		}
		if (trim_price_type === 'fixed') {
			if (!Array.isArray(fixed_prices) || fixed_prices.length === 0) {
				return res.status(400).json({ error: TRIM_FIXED_PRICES_REQUIRED });
			}
			for (const fp of fixed_prices) {
				if (!fp.trim_price_category_id || fp.price == null) {
					return res.status(400).json({ error: TRIM_FIXED_PRICE_FIELDS_REQUIRED });
				}
			}
		}
	}

	const connection = await pool.getConnection();

	try {
		await connection.beginTransaction();

		const [result] = await connection.execute(
			`UPDATE products
             SET name = ?, type = ?, category_id = ?, unit_id = ?,
                 width = ?, price = ?, price_multiplier = ?, quantity_step = ?, trim_price_type = ?
             WHERE id = ?`,
			[
				name.trim(),
				type,
				category_id,
				unit_id,
				width ?? null,
				price ?? null,
				price_multiplier ?? null,
				quantity_step ?? 1,
				type === 'trim' ? trim_price_type : null,
				req.params.id,
			]
		);

		if (result.affectedRows === 0) {
			await connection.rollback();
			return res.status(404).json({ error: NOT_FOUND });
		}

		if (type === 'option') {
			await connection.execute('DELETE FROM product_options WHERE product_id = ?', [req.params.id]);

			for (const option of options) {
				await connection.execute(
					'INSERT INTO product_options (product_id, name, price) VALUES (?, ?, ?)',
					[req.params.id, option.name.trim(), option.price]
				);
			}
		}

		if (type === 'trim' && trim_price_type === 'fixed') {
			await connection.execute('DELETE FROM trim_fixed_prices WHERE product_id = ?', [req.params.id]);

			for (const fp of fixed_prices) {
				await connection.execute(
					'INSERT INTO trim_fixed_prices (product_id, trim_price_category_id, price) VALUES (?, ?, ?)',
					[req.params.id, fp.trim_price_category_id, fp.price]
				);
			}
		}

		await connection.commit();

		const [rows] = await pool.execute(`${SELECT_LIST} WHERE p.id = ?`, [req.params.id]);

		if (type === 'option') {
			const [optionRows] = await pool.execute(
				'SELECT id, name, price FROM product_options WHERE product_id = ? ORDER BY id',
				[req.params.id]
			);
			rows[0].options = optionRows;
		}

		if (type === 'trim' && trim_price_type === 'fixed') {
			const [fixedPriceRows] = await pool.execute(
				'SELECT id, trim_price_category_id, price FROM trim_fixed_prices WHERE product_id = ? ORDER BY trim_price_category_id',
				[req.params.id]
			);
			rows[0].fixed_prices = fixedPriceRows;
		}

		res.json(rows[0]);
	} catch (err) {
		await connection.rollback();
		console.error(err);
		if (err.code === 'ER_NO_REFERENCED_ROW_2') {
			return res.status(400).json({ error: PRODUCT_INVALID_REFERENCES });
		}
		res.status(500).json({ error: SERVER_ERROR });
	} finally {
		connection.release();
	}
});

router.post('/', async (req, res) => {
	const {
		name,
		type,
		category_id,
		unit_id,
		width,
		price,
		price_multiplier,
		quantity_step,
		trim_price_type,
		options,
		fixed_prices,
	} = req.body;

	if (!name || !name.trim()) {
		return res.status(400).json({ error: NAME_REQUIRED });
	}
	if (!type || !['sheet', 'option', 'quantity', 'trim'].includes(type)) {
		return res.status(400).json({ error: INVALID_PRODUCT_TYPE });
	}
	if (!category_id || !unit_id) {
		return res.status(400).json({ error: PRODUCT_CATEGORY_UNIT_REQUIRED });
	}
	if (type === 'option') {
		if (!Array.isArray(options) || options.length === 0) {
			return res.status(400).json({ error: PRODUCT_OPTIONS_REQUIRED });
		}
		for (const option of options) {
			if (!option.name || !option.name.trim() || option.price == null) {
				return res.status(400).json({ error: PRODUCT_OPTION_FIELDS_REQUIRED });
			}
		}
	}
	if (type === 'trim') {
		if (!trim_price_type || !['fixed', 'widthBased'].includes(trim_price_type)) {
			return res.status(400).json({ error: INVALID_TRIM_PRICE_TYPE });
		}
		if (trim_price_type === 'fixed') {
			if (!Array.isArray(fixed_prices) || fixed_prices.length === 0) {
				return res.status(400).json({ error: TRIM_FIXED_PRICES_REQUIRED });
			}
			for (const fp of fixed_prices) {
				if (!fp.trim_price_category_id || fp.price == null) {
					return res.status(400).json({ error: TRIM_FIXED_PRICE_FIELDS_REQUIRED });
				}
			}
		}
	}

	const connection = await pool.getConnection();

	try {
		await connection.beginTransaction();

		const [result] = await connection.execute(
			`INSERT INTO products
                (name, type, category_id, unit_id, width, price, price_multiplier, quantity_step, trim_price_type)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				name.trim(),
				type,
				category_id,
				unit_id,
				width ?? null,
				price ?? null,
				price_multiplier ?? null,
				quantity_step ?? 1,
				type === 'trim' ? trim_price_type : null,
			]
		);

		const newProductId = result.insertId;

		if (type === 'option') {
			for (const option of options) {
				await connection.execute(
					'INSERT INTO product_options (product_id, name, price) VALUES (?, ?, ?)',
					[newProductId, option.name.trim(), option.price]
				);
			}
		}

		if (type === 'trim' && trim_price_type === 'fixed') {
			for (const fp of fixed_prices) {
				await connection.execute(
					'INSERT INTO trim_fixed_prices (product_id, trim_price_category_id, price) VALUES (?, ?, ?)',
					[newProductId, fp.trim_price_category_id, fp.price]
				);
			}
		}

		await connection.commit();

		const [rows] = await pool.execute(`${SELECT_LIST} WHERE p.id = ?`, [newProductId]);

		if (type === 'option') {
			const [optionRows] = await pool.execute(
				'SELECT id, name, price FROM product_options WHERE product_id = ? ORDER BY id',
				[newProductId]
			);
			rows[0].options = optionRows;
		}

		if (type === 'trim' && trim_price_type === 'fixed') {
			const [fixedPriceRows] = await pool.execute(
				'SELECT id, trim_price_category_id, price FROM trim_fixed_prices WHERE product_id = ? ORDER BY trim_price_category_id',
				[newProductId]
			);
			rows[0].fixed_prices = fixedPriceRows;
		}

		res.status(201).json(rows[0]);
	} catch (err) {
		await connection.rollback();
		console.error(err);
		if (err.code === 'ER_NO_REFERENCED_ROW_2') {
			return res.status(400).json({ error: PRODUCT_INVALID_REFERENCES });
		}
		res.status(500).json({ error: SERVER_ERROR });
	} finally {
		connection.release();
	}
});

router.delete('/:id', async (req, res) => {
	try {
		const [result] = await pool.execute(
			'UPDATE products SET is_active = 0 WHERE id = ?',
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

router.delete('/:id/hard', async (req, res) => {
	try {
		const [result] = await pool.execute(
			'DELETE FROM products WHERE id = ?',
			[req.params.id]
		);

		if (result.affectedRows === 0) {
			return res.status(404).json({ error: NOT_FOUND });
		}

		res.status(204).send();
	} catch (err) {
		console.error(err);
		if (err.code === 'ER_ROW_IS_REFERENCED_2') {
			return res.status(409).json({ error: PRODUCT_IN_USE });
		}
		res.status(500).json({ error: SERVER_ERROR });
	}
});

module.exports = router;