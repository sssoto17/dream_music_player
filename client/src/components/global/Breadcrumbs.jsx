"use client";

import { getLocalizedHref } from "@/lib/utils";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function Breadcrumb({ path }) {
	const { locale } = useParams();
	return (
		<nav className="py-2">
			{path.map(({ title, id }) => (
				<Link key={id} href={getLocalizedHref(locale, `/browse/${id}`)}>
					{title}
				</Link>
			))}
		</nav>
	);
}
