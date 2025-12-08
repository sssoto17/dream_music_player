"use server";

import { getAlbumsByArtist, getSearch } from "@/features/spotify/api";
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

export async function PaginateAction(prev, isBack) {
	let offset = Number(prev.range) + 5;

	if (isBack) {
		offset = Number(prev.range) - 5;
	}

	const { items } = await getAlbumsByArtist(
		prev.artistID,
		prev.type,
		5,
		offset
	);

	return {
		...prev,
		albums: items,
		range: offset,
	};
}
