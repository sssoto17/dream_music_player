import { Manrope } from "next/font/google";
import "@/styles/globals.css";
import Header from "@/components/global/Header";
import ClientProviders from "@/components/global/ClientProviders";
import SessionRefresh from "@/app/[locale]/(auth)/_components/SessionRefresh";

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
					<Footer />
				</ClientProviders>
			</body>
		</html>
	);
}

function Footer() {
	return (
		<footer className="py-4 white/60 backdrop-blur-3xl text-slate-800 text-xl font-semibold font-display">
			<p>Footer</p>
		</footer>
	);
}
