const express = require('express');
const path = require('path');
require('dotenv').config();

const categoriesRouter = require('./routes/categories');
const customersRouter = require('./routes/customers');
const materialsRouter = require('./routes/materials');
const colorsRouter = require('./routes/colors');
const coatingsRouter = require('./routes/coatings');
const trimPriceTypesRouter = require('./routes/trim-price-types')
const productsRouter = require('./routes/products');
const productOptionsRouter = require('./routes/product-options');

const app = express();

app.use(express.json());

// API-роути
app.use('/api/categories', categoriesRouter);
app.use('/api/customers', customersRouter);
app.use('/api/materials', materialsRouter);
app.use('/api/colors', colorsRouter);
app.use('/api/coatings', coatingsRouter);
app.use('/api/trim-price-types', trimPriceTypesRouter);
app.use('/api/products', productsRouter);
app.use('/api/product-options', productOptionsRouter);
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