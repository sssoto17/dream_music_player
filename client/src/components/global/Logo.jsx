import Link from "next/link";
import { FaMusic } from "react-icons/fa";
import { getLocalizedHref } from "@/lib/utils";

export function LogoTall({ locale }) {
	return (
		<Link
			aria-label="Dream Music Player"
			href={getLocalizedHref(locale, "/")}
			// className="flex gap-2 items-end"
		>
			<FaMusic
				size={48}
				className="mb-1 aspect-square text-white bg-linear-to-b from-fuchsia-600 to-amber-200 p-2 rounded-md"
			/>
			<span className="font-semibold">Dream Music Player</span>
		</Link>
	);
}

export default function Logo({ locale }) {
	return (
		<Link
			aria-label="Dream Music Player"
			href={getLocalizedHref(locale, "/")}
			className="flex gap-2 items-end"
		>
			<FaMusic
				size={48}
				className="mb-1 aspect-square text-white bg-linear-to-b from-fuchsia-600 to-amber-200 p-2 rounded-md"
			/>
			<span className="font-semibold">Dream Music Player</span>
		</Link>
	);
}

export function LogoIcon({ locale }) {
	return (
		<Link
			aria-label="Dream Music Player"
			href={getLocalizedHref(locale, "/")}
		>
			<FaMusic
				size={64}
				className="aspect-square text-white bg-linear-to-b from-fuchsia-600 to-amber-200 p-2 rounded-md"
			/>
		</Link>
	);
}
