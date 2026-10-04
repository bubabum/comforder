const express = require('express');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const categoriesRouter = require('./routes/categories');
const customersRouter = require('./routes/customers');
const materialsRouter = require('./routes/materials');
const colorsRouter = require('./routes/colors');
const coatingsRouter = require('./routes/coatings');
const trimPriceCategoriesRouter = require('./routes/trim-price-categories')
const productsRouter = require('./routes/products');
const productOptionsRouter = require('./routes/product-options');
const trimWidthPricesRouter = require('./routes/trim-width-prices');
const trimFixedPricesRouter = require('./routes/trim-fixed-prices');
const unitsRouter = require('./routes/units');

const app = express();

app.use(express.json());

app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: 30 * 24 * 60 * 60 * 1000, // 30 днів
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
	},
}));

app.post('/api/login', (req, res) => {
	const { password } = req.body;
	if (password === process.env.APP_PASSWORD) {
		req.session.authenticated = true;
		return res.json({ success: true });
	}
	res.status(401).json({ error: 'Невірний пароль' });
});

app.post('/api/logout', (req, res) => {
	req.session.destroy(() => res.json({ success: true }));
});

app.get('/api/me', (req, res) => {
	res.json({ authenticated: !!req.session.authenticated });
});

// Захист — усе під /api, крім /login, /logout, /me
app.use('/api', (req, res, next) => {
	if (['/login', '/logout', '/me'].includes(req.path)) return next();
	if (req.session.authenticated) return next();
	res.status(401).json({ error: 'Не авторизовано' });
});

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// app.use(async (req, res, next) => {
// 	await delay(500);
// 	throw new Error
// 	next();
// });

// API-роути
app.use('/api/categories', categoriesRouter);
app.use('/api/customers', customersRouter);
app.use('/api/materials', materialsRouter);
app.use('/api/colors', colorsRouter);
app.use('/api/coatings', coatingsRouter);
app.use('/api/trim-price-categories', trimPriceCategoriesRouter);
app.use('/api/products', productsRouter);
app.use('/api/product-options', productOptionsRouter);
app.use('/api/trim-width-prices', trimWidthPricesRouter);
app.use('/api/trim-fixed-prices', trimFixedPricesRouter);
app.use('/api/units', unitsRouter);

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