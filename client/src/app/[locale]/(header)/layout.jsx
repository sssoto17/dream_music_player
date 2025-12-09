import Header from "@/components/navigation/Header";
import Footer from "@/components/navigation/Footer";
import { Suspense } from "react";

export default async function HeaderLayout({ params, children }) {
	const { locale } = await params;
	return (
		<>
			<Header locale={locale} />
			<Suspense>{children}</Suspense>
			<Footer />
		</>
	);
}
