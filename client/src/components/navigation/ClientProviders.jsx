"use client";

import { useRouter, useParams } from "next/navigation";
import { RouterProvider } from "react-aria-components";
import Link from "next/link";
import { getLocalizedHref } from "@/lib/utils";

export default function ClientProviders({ children }) {
	const router = useRouter();

	return <RouterProvider navigate={router.push}>{children}</RouterProvider>;
}

export function SignInButton() {
	const { locale } = useParams();
	return (
		<Link
			className="block font-semibold text-white py-1 px-8 rounded-full bg-fuchsia-600 hover:bg-fuchsia-700 transition-colors duration-75 ease-in font-copy tracking-wide"
			href={getLocalizedHref(locale, "/login")}
		>
			Login
		</Link>
	);
}
