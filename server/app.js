const express = require('express');
const path = require('path');
require('dotenv').config();

const categoriesRouter = require('./routes/categories');
const customersRouter = require('./routes/customers')

const app = express();

app.use(express.json());

// API-роути
app.use('/api/categories', categoriesRouter);
app.use('/api/customers', customersRouter);
// далі додаватимеш: app.use('/api/products', productsRouter); і т.д.

// Статика фронту
app.use(express.static(path.join(__dirname, 'public')));

// SPA fallback — все, що не /api, віддає index.html
app.get(/^(?!\/api).*/, (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});