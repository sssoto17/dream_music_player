"use client";

import { getLocalizedHref } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { BiSolidLeftArrow } from "react-icons/bi";

export default function Breadcrumb({ path }) {
	const { locale } = useParams();
	const router = useRouter();
	return (
		<nav className="py-2 flex gap-4 items-center text-lg ">
			<button
				className="group flex gap-2 px-4 items-center cursor-pointer hover:font-medium"
				onClick={() => router.back()}
			>
				<BiSolidLeftArrow className="group-hover:text-fuchsia-900" />{" "}
				{!path && "Back to Dashboard"}
			</button>
			{path &&
				path.map(({ title, id }) => (
					<Link
						key={id}
						href={getLocalizedHref(locale, `/browse/${id}`)}
					>
						{title}
					</Link>
				))}
		</nav>
	);
}
