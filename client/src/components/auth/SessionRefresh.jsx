"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SessionRefresh() {
	const router = useRouter();

	useEffect(() => {
		async function check() {
			const res = await fetch("/api/session/verify", {
				method: "GET",
				credentials: "include",
			});

			if (res.status === 401) {
				const refreshed = await fetch("/api/session/refresh", {
					method: "GET",
					credentials: "include",
				});

				if (refreshed.ok) {
					router.refresh();
				}
			}
		}

		check();
	});

	return null;
}
