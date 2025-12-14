"use server";
import { updateTag } from "next/cache";

export async function ImportLanguages() {
	const res = await fetch(`/api/admin/languages`);

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
