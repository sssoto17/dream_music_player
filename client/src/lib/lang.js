export async function getLang(params) {
	const { lang } = await params;
	const currentLang = (lang && lang[0]) || "en";

	return await fetch(`${process.env.API_BASE}/lang/${currentLang}`).then(
		(res) => res.json()
	);
}
