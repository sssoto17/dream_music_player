"use client";
import Link from "next/link";
import { FaMusic } from "react-icons/fa";
import { getLocalizedHref } from "@/lib/utils";
import { useParams } from "next/navigation";

export default function Logo({ variant = "default" }) {
	const { locale } = useParams();

	const variants = {
		icon: "*:size-16",
		default: "flex gap-2 items-end",
		tall: "",
	};

	return (
		<Link
			aria-label="Dream Music Player"
			href={getLocalizedHref(locale, "/")}
			className={`${variants[variant]} text-xl`}
		>
			<FaMusic
				size={48}
				className="mb-1 aspect-square text-white bg-linear-to-b from-fuchsia-600 to-amber-200 p-2 rounded-md"
			/>
			{variant !== "icon" && (
				<span className="font-semibold">Dream Music Player</span>
			)}
		</Link>
	);
}
