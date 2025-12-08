"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function LocaleSwitch() {
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
								className={`${flag} aspect-square rounded-full text-xs`}
							/>
						</Link>
					</li>
				);
			})}
		</ul>
	);
}
