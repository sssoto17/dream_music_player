import { Manrope } from "next/font/google";
import "@/styles/globals.css";
import ClientProviders from "@/components/navigation/ClientProviders";
import SessionRefresh from "./(header)/user/_components/SessionRefresh";

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

export default async function RootLayout({ children }) {
	return (
		<html lang="en">
			<body
				className={`${manrope.variable} bg-linear-to-b from-amber-50 to-fuchsia-100`}
				suppressHydrationWarning
			>
				<ClientProviders>
					<SessionRefresh />
					{children}
				</ClientProviders>
			</body>
		</html>
	);
}
