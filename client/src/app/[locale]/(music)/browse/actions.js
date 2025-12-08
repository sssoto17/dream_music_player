"use server";

import { getSearch } from "@/features/spotify/api";
import { revalidatePath } from "next/cache";

export async function SearchAction(prev, formData) {
	if (!formData) {
		revalidatePath("/");
		return { q: "" };
	}

	const q = formData.get("q");
	const { tracks, artists, albums, error } = await getSearch(q, 10);

	if (error)
		return {
			error: "No matching results",
		};

	return {
		q: q,
		result: {
			artists: artists.items,
			other: [...tracks?.items, ...albums?.items],
		},
	};
}
