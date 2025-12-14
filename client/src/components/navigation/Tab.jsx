"use client";

import { getLocalizedHref } from "@/lib/utils";
import Link from "next/link";
import {
	useParams,
	usePathname,
	useSelectedLayoutSegment,
} from "next/navigation";

export default function Tab({ endpoint, children }) {
	const { locale } = useParams();
	const segment = useSelectedLayoutSegment();
	const path = usePathname();

	const url = getLocalizedHref(locale, `/user/${segment}${endpoint}`);

	return (
		<Link
			className={
				url === path
					? "text-amber-800 border-b-4 border-b-amber-600"
					: ""
			}
			href={url}
		>
			{children}
		</Link>
	);
}
