import { Manrope } from "next/font/google";
import "@/styles/globals.css";
import Link from "next/link";
import { getLocalizedHref } from "@/lib/utils";
import LocaleSwitch from "@/components/global/LocaleSwitch";
import ClientProviders from "@/components/global/ClientProviders";

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
				className={`${manrope.variable} min-h-screen`}
				suppressHydrationWarning
			>
				<ClientProviders>
					<Header locale={locale} />
					{children}
					<Footer />
				</ClientProviders>
			</body>
		</html>
	);
}

async function Header({ locale }) {
	console.log(locale);
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

				<div className="flex gap-4 items-center">
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
					<LocaleSwitch active={locale} />
				</div>
			</nav>
		</header>
	);
}

function Footer() {
	return (
		<footer className="max-w-screen bg-fuchsia-100 text-slate-800 text-xl font-semibold font-display">
			<p className="max-w-content mx-auto px-8">Footer</p>
		</footer>
	);
}
