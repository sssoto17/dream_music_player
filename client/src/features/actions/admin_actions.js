"use server";
import { updateTag } from "next/cache";
import { getCookie } from "../auth/session";

const { ADMIN_BASE: admin_url } = process.env;

export async function ImportLanguages() {
	const admin_id = await getCookie("user_id");

	const res = await fetch(`${admin_url}/lang-support`, {
		method: "GET",
		headers: {
			cookie: `user_id=${admin_id}`,
		},
	});

	if (!res.ok)
		return {
			success: false,
			title: "error",
			message: "error_message",
		};

	const status = await res.json();

	if (status?.error)
		return { success: false, title: "error", message: status?.error };

	updateTag("language");
	updateTag("user");
	return { success: true, title: "success", message: status?.message };
}

export async function BlockUser(prev, user_id) {
	const admin_id = await getCookie("user_id");

	const res = await fetch(`${admin_url}/restrict/${user_id}`, {
		method: "GET",
		headers: {
			cookie: `user_id=${admin_id}`,
		},
	});

	if (!res.ok)
		return {
			...prev,
			success: false,
			message: "error_message",
		};

	const status = await res.json();

	if (status?.error)
		return { ...prev, success: false, message: status?.error };

	updateTag("user");
	return {
		...prev,
		success: true,
		message: status?.message,
		is_blocked: status?.user?.is_blocked,
	};
}
