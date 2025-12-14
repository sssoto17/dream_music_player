import Header from "@/components/navigation/Header";
import Footer from "@/components/navigation/Footer";

export default async function HeaderLayout({ params, children }) {
	const { locale = "en" } = await params;

	return (
		<>
			<Header locale={locale} />
			{children}
			<Footer />
		</>
	);
}
