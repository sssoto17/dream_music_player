import { Manrope } from "next/font/google";
import "@/styles/globals.css";
import Link from "next/link";
import { getLocalizedHref } from "@/lib/utils";

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
	const { locale } = await params;
	return (
		<html lang="en">
			<body className={`${manrope.variable}`} suppressHydrationWarning>
				<Header locale={locale} />
				{children}
			</body>
		</html>
	);
}

async function Header({ locale }) {
	return (
		<header className="max-w-screen py-4 bg-fuchsia-600 text-white text-xl font-display">
			<nav className="max-w-content mx-auto px-8 flex justify-between items-end">
				<h1 className="text-3xl font-bold">
					<Link
						className="block"
						href={getLocalizedHref(locale, "/")}
					>
						Home
					</Link>
				</h1>

				<ul className="font-semibold">
					<li>
						<Link
							className="block"
							href={getLocalizedHref(locale, "/login")}
						>
							Login
						</Link>
					</li>
				</ul>
			</nav>
		</header>
	);
}
