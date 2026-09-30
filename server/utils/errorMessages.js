module.exports = {
	// Загальні
	SERVER_ERROR: 'Внутрішня помилка сервера. Спробуйте пізніше',
	NOT_FOUND: 'Запис не знайдено',
	NAME_REQUIRED: 'Поле «Назва» обов\'язкове',
	ALL_FIELDS_REQUIRED: 'Заповніть усі обов\'язкові поля',

	// Товари
	// PRODUCT_TYPE_REQUIRED: 'Оберіть тип товару',
	INVALID_PRODUCT_TYPE: 'Некоректний тип товару',
	PRODUCT_CATEGORY_UNIT_REQUIRED: 'Оберіть категорію та одиницю виміру',
	PRODUCT_INVALID_REFERENCES: 'Обрано некоректну категорію, одиницю виміру або цінову категорію',
	PRODUCT_IN_USE: 'Неможливо видалити — товар використовується в замовленнях',

	// Опції товару
	PRODUCT_OPTIONS_REQUIRED: 'Додайте хоча б одну опцію товару',
	PRODUCT_OPTION_FIELDS_REQUIRED: 'Заповніть назву та ціну для кожної опції',

	// Trim (доборні елементи)
	INVALID_TRIM_PRICE_TYPE: 'Некоректний вид планки',
	// TRIM_PRICE_TYPE_REQUIRED: 'Оберіть тип ціноутворення для товару',
	TRIM_FIXED_PRICES_REQUIRED: 'Додайте хоча б одну фіксовану ціну',
	TRIM_FIXED_PRICE_FIELDS_REQUIRED: 'Заповніть цінову категорію та ціну для кожного запису',

	// Матеріали
	MATERIAL_INVALID_REFERENCES: 'Обрано некоректний колір, покриття або цінову категорію',
	MATERIAL_IN_USE: 'Неможливо видалити — матеріал використовується в товарах',

	// Категорії
	CATEGORY_IN_USE: 'Неможливо видалити — матеріал використовується в товарах',
};