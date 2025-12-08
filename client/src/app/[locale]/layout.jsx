import { Manrope } from "next/font/google";
import "@/styles/globals.css";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import ClientProviders from "@/components/global/ClientProviders";
import SessionRefresh from "@/app/[locale]/(auth)/_components/SessionRefresh";
import { Suspense } from "react";

const manrope = Manrope({
	variable: "--font-manrope",
	subsets: ["latin"],
});

export const metadata = {
	title: "Dream Music Player",
	description: "Your dreamiest music library.",
};

export async function generateStaticParams() {
	const locales = ["en", "dk"];

	return locales.map((lang) => ({
		locale: lang,
	}));
}

export default async function RootLayout({ children, params }) {
	const { locale = "en" } = await params;

	return (
		<html lang="en">
			<body
				className={`${manrope.variable} bg-linear-to-b from-amber-50 to-fuchsia-100`}
				suppressHydrationWarning
			>
				<ClientProviders>
					<SessionRefresh />
					<Header locale={locale} />
					{children}
					<Suspense>
						<Footer />
					</Suspense>
				</ClientProviders>
			</body>
		</html>
	);
}
