"use client";

import { useRouter } from "next/navigation";
import { RouterProvider } from "react-aria-components";

export default function ClientProviders({ children }) {
	const router = useRouter();

	return <RouterProvider navigate={router.push}>{children}</RouterProvider>;
}
