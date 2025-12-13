"use client";

import { getLocalizedHref } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { BiSolidLeftArrow } from "react-icons/bi";
import { Fragment } from "react/jsx-runtime";

export default function Breadcrumb({ path }) {
	const { locale } = useParams();
	const router = useRouter();
	return (
		<nav className="py-2 flex gap-2 items-center text-lg ">
			<button
				className="group flex gap-2 px-4 items-center cursor-pointer hover:font-medium"
				onClick={() => router.push("/browse")}
			>
				<BiSolidLeftArrow className="group-hover:text-fuchsia-900" />
				{!path && "Back"}
			</button>
			{path &&
				path.map(({ title, id, cat }) => (
					<Fragment key={id}>
						<Link
							className="last-of-type:font-semibold last-of-type:text-xl"
							href={getLocalizedHref(
								locale,
								`/browse/${cat}/${id}`
							)}
						>
							{title}
						</Link>
						<span className="last:hidden">/</span>
					</Fragment>
				))}
		</nav>
	);
}
