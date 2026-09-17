CREATE TABLE IF NOT EXISTS coatings (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS colors (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS trim_price_categories (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS materials (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    color_id INT UNSIGNED NOT NULL,
    coating_id INT UNSIGNED NOT NULL,
    thickness DECIMAL(3,2) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    extra_price DECIMAL(10,2) NOT NULL,
    trim_price_category_id INT UNSIGNED NOT NULL,

    PRIMARY KEY (id),

    CONSTRAINT fk_materials_color
        FOREIGN KEY (color_id)
        REFERENCES colors (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_materials_coating
        FOREIGN KEY (coating_id)
        REFERENCES coatings (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

	 CONSTRAINT fk_materials_trim_price_category
        FOREIGN KEY (trim_price_category_id)
        REFERENCES trim_price_categories (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS units (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(150) NOT NULL,
	type ENUM('sheet','option','quantity','trim') NOT NULL,
	category_id INT UNSIGNED NOT NULL,
	unit_id INT UNSIGNED NOT NULL,
	width DECIMAL(7,2),
	price DECIMAL(10,2),
	price_multiplier DECIMAL(6,3),
	quantity_step DECIMAL(6,2) DEFAULT 1,
	trim_price_type ENUM('fixed','widthBased'),
	is_active TINYINT(1) DEFAULT 1,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (category_id) REFERENCES categories(id),
	FOREIGN KEY (unit_id) REFERENCES units(id)
);

CREATE TABLE IF NOT EXISTS product_options (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	product_id INT UNSIGNED NOT NULL,
	name VARCHAR(100) NOT NULL,
	price DECIMAL(10,2) NOT NULL,
	FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS trim_fixed_prices (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id INT UNSIGNED NOT NULL,   -- було VARCHAR(64)
  trim_price_category_id INT UNSIGNED NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  UNIQUE KEY (product_id, trim_price_category_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (trim_price_category_id) REFERENCES trim_price_categories(id)
);

CREATE TABLE IF NOT EXISTS trim_width_prices (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    width SMALLINT UNSIGNED NOT NULL,
    trim_price_category_id INT UNSIGNED NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (trim_price_category_id) REFERENCES trim_price_categories(id) ON DELETE RESTRICT,
    UNIQUE KEY uq_width_type (width, trim_price_category_id)
);

CREATE TABLE customers (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    email VARCHAR(150),
    address VARCHAR(255),
    notes TEXT,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);