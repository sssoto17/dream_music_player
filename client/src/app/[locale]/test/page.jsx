export async function generateStaticParams() {
	const locales = ["en", "dk"];

	return locales.map((lang) => ({
		locale: lang,
	}));
}

export default async function Page({ params }) {
	const { locale } = await params;

	const lang = { en: "Welcome", dk: "Velkommen" };
	return (
		<main>
			<h1>{lang[locale]}</h1>
		</main>
	);
}
