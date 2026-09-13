export const ruchnyy = [
	{
		id: "nasadka-magnitna-8mm",
		name: "Насадка магнітна 8мм",
		type: "quantity",
		unitId: "piece",
		categoryId: "ruchnyy-insturment",
		quantityStep: 1,
		price: 80,
	},

	{
		id: "skoba-gartovana",
		name: "Скоба гартована",
		type: "option",
		unitId: "piece",
		quantityStep: 1,
		categoryId: "ruchnyy-insturment",
		optionGroup: {
			label: "розмір",
			options: [
				{ label: "6мм", price: 26 },
				{ label: "8мм", price: 28 },
				{ label: "10мм", price: 30 },
				{ label: "12мм", price: 32 },
			],
		},
	},

	{
		id: "skobozabyvnyy-pistolet-rt-0201",
		name: "Скобозабивний пістолет RT-0201",
		type: "quantity",
		unitId: "piece",
		categoryId: "ruchnyy-insturment",
		quantityStep: 1,
		price: 450,
	},

	{
		id: "zaklepky-alyuminiyevi",
		name: "Заклепки алюмінієві",
		type: "option",
		unitId: "piece",
		quantityStep: 1,
		categoryId: "ruchnyy-insturment",
		optionGroup: {
			label: "розмір",
			options: [
				{ label: "4 x 6мм", price: 26 },
				{ label: "4 x 8мм", price: 28 },
				{ label: "4 x 10мм", price: 30 },
				{ label: "4 x 12мм", price: 32 },
				{ label: "4 x 16мм", price: 34 },
			],
		},
	},

	{
		id: "pistolet-zaklepuvalnyy",
		name: "Пістолет заклепувальний",
		type: "quantity",
		unitId: "piece",
		categoryId: "ruchnyy-insturment",
		quantityStep: 1,
		price: 250,
	},

	{
		id: "ruletka-rt-0005",
		name: "Рулетка з фіксатором RT-0005",
		type: "option",
		unitId: "piece",
		quantityStep: 1,
		categoryId: "ruchnyy-insturment",
		optionGroup: {
			label: "розмір",
			options: [
				{ label: "3м x 16мм", price: 90 },
				{ label: "5м x 19мм", price: 120 },
				{ label: "10м x 25мм", price: 250 },
			],
		},
	},
];