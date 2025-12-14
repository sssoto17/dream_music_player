"use server";

import { authToggleFollow, authToggleLikeTrack } from "@/features/auth/dal";
import { getAlbumsByArtist, getSearch } from "@/features/spotify/api";
import { revalidatePath, updateTag } from "next/cache";
import { getUserFeed, getUserPosts, searchUsers } from "../db/users";
import { getCookie } from "../auth/session";

const {
	// AUTH_BASE: auth_url,
	API_BASE: api_url,
	// SERVER: server_url,
} = process.env;

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

export async function PostAction(prev, formData) {
	const user_id = await getCookie("user_id");

	if (!user_id)
		return { success: false, content: formData.get("post"), error };

	const content = formData.get("post");

	if (content.length > 500)
		return {
			...prev,
			success: false,
			error: { content: "Please limit your post to 500 characters." },
		};

	const res = await fetch(`${api_url}/users/${user_id}/post`, {
		method: "POST",
		body: formData,
	});

	if (!res.ok)
		return {
			...prev,
			success: false,
			error: { content: "Your post could not be updated." },
		};

	let feed;

	if (prev.filterByUser) {
		feed = await getUserPosts(user_id);
	} else {
		feed = await getUserFeed(user_id);
	}

	if (!res.ok)
		return {
			...prev,
			success: false,
			error: { content: "Feed could not be updated." },
		};

	return { ...prev, success: true, feed };
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
