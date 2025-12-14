"use server";

import { authToggleFollow, authToggleLikeTrack } from "@/features/auth/dal";
import { getAlbumsByArtist, getSearch } from "@/features/spotify/api";
import { revalidatePath, updateTag } from "next/cache";
import { searchUsers } from "../db/users";

const error = { error: "Could not complete request." };

export async function FollowAction(formData) {
	const res = await authToggleFollow(formData);

	if (!res.ok) return error;

	updateTag("user");
	updateTag("followers");
	revalidatePath("/", "layout");
	return await res.json();
}

export async function LikeAction(formData) {
	const res = await authToggleLikeTrack(formData);

	if (!res.ok) return error;

	return await res.json();
}

export async function SearchAction(prev, formData) {
	if (!formData) {
		revalidatePath("/", "layout");
		return { q: "" };
	}

	const q = formData.get("q");
	const users = await searchUsers(q);
	const { tracks, artists, albums, error } = await getSearch(q, 10);

	if (users?.error || error) {
		return {
			error: "No matching results.",
		};
	}

	updateTag("search");
	return {
		q: q,
		result: {
			users: users,
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
