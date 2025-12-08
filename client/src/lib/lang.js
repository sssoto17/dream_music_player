const { API_BASE: api } = process.env;

export const locales = [
	{
		label: "English",
		lang: "en",
		flag: "fi fi-gb",
	},
	{
		label: "Danish",
		lang: "dk",
		flag: "fi fi-dk",
	},
];

export const getLocale = (pathname) => {
	return locales.find((locale) => pathname.startsWith(`/${locale.lang}`));
};

export const redirectedPathname = (locale, path) => {
	const segments = path.split("/");
	const hasLocale = locales.some((locale) => segments.includes(locale.lang));

	if (!hasLocale) {
		if (locale == "en") return path;

		return segments.toSpliced(1, 0, locale).join("/");
	}

	if (locale == "en") {
		const path = segments.toSpliced(1, 1).join("/");
		if (!path) return "/";
		return path;
	}

	segments[1] = locale;

	return segments.join("/");
};

export async function getLang(lang) {
	return await fetch(`${api}/lang/${lang}`).then((res) => res.json());
}
