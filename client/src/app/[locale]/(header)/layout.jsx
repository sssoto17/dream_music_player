import Header from "@/components/navigation/Header";
import Footer from "@/components/navigation/Footer";
import { Suspense } from "react";

export default async function HeaderLayout({ params, sidebar, children }) {
	const { locale = "en" } = await params;

	return (
		<>
			<Header locale={locale} />
			<main className="scroller">
				<div className="grid grid-cols-3 grid-rows-[auto_1fr] gap-x-6 content-start">
					{/* <Suspense>{sidebar}</Suspense> */}
					<Suspense>{children}</Suspense>
				</div>
			</main>
			<Footer />
		</>
	);
}
