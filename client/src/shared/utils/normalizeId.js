function normalizeId(str) {
	const translitMap = {
		а: "a", б: "b", в: "v", г: "g", ґ: "g",
		д: "d", е: "e", є: "ye", ж: "zh", з: "z",
		и: "y", і: "i", ї: "yi", й: "y", к: "k",
		л: "l", м: "m", н: "n", о: "o", п: "p",
		р: "r", с: "s", т: "t", у: "u", ф: "f",
		х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "shch",
		ь: "", ю: "yu", я: "ya",
	};

	return str
		.toLowerCase()
		.split("")
		.map(char => translitMap[char] ?? char)
		.join("")
		.replace(/['"`]/g, "")          // прибирає лапки
		.replace(/ø/g, "")              // прибирає символ Ø
		.replace(/º/g, "")              // прибирає º
		.replace(/[^a-z0-9]+/g, "-")    // все інше -> -
		.replace(/^-+|-+$/g, "")        // обрізає - по краях
		.replace(/-+/g, "-");           // подвійні - -> один
}