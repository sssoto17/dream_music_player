import { cacheLife, cacheTag } from "next/cache";

export async function getLang(lang) {
	"use cache";
	cacheTag("locale");
	cacheLife("days");
	// const { lang } = await params;
	// const currentLang = (lang && lang[0]) || "en";

	return await fetch(`${process.env.API_BASE}/lang/${lang}`).then((res) =>
		res.json()
	);
}
