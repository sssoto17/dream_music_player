import Browse from "@/components/browse/Browse";

export default async function Page({ params }) {
	const { locale = "en" } = await params;

	return <Browse locale={locale} />;
}
