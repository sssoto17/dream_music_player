"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { locales, redirectedPathname } from "@/lib/lang";
import { MenuItem, MenuSection, Text } from "react-aria-components";

export default function LocaleSwitch() {
	return (
		<MenuSection className="flex gap-2 items-center px-2 py-1">
			{locales.map((locale, id) => {
				return <LocaleButton key={id} {...locale} />;
			})}
		</MenuSection>
	);
}

function LocaleButton({ lang, label, flag }) {
	const pathname = usePathname();
	const url = redirectedPathname(lang, pathname);

	return (
		<MenuItem
			href={url}
			aria-label={label}
			className="transition-all duration-75 ease-in hover:scale-105"
		>
			<span className={`${flag} aspect-square rounded-full text-xs`} />
			<Text slot="label" className="hidden">
				{label}
			</Text>
			<Text slot="description" className="hidden">
				Switch language to {label}
			</Text>
		</MenuItem>
	);
}

export function LocaleSwitchVariant() {
	const path = usePathname();
	const { locale } = useParams();

	const locales = [
		{
			label: "English",
			lang: "en",
			flag: "fi fi-gb",
		},
		{
			label: "Danish",
			lang: "dk",
			flag: "fi fi-dk",
		},
	];

	const redirectedPathname = (locale) => {
		const segments = path.split("/");
		const hasLocale = locales.some((locale) =>
			segments.includes(locale.lang)
		);

		if (!hasLocale) {
			if (locale == "en") return path;

			return segments.toSpliced(1, 0, locale).join("/");
		}

		if (locale == "en") {
			const path = segments.toSpliced(1, 1).join("/");
			if (!path) return "/";
			return path;
		}

		segments[1] = locale;

		return segments.join("/");
	};

	return (
		<ul className="flex gap-2 items-center">
			{locales.map(({ label, lang, flag }) => {
				const link = redirectedPathname(lang);
				return (
					<li key={lang}>
						<Link
							href={link}
							replace
							aria-label={label}
							className="flex items-center"
						>
							<span
								className={`${flag} aspect-square rounded-full text-sm`}
							/>
						</Link>
					</li>
				);
			})}
		</ul>
	);
}
