import { cacheLife, cacheTag } from "next/cache";
import { getAvatarSrc } from "@/lib/utils";

const { API_BASE: api_url, AUTH_BASE: auth_url } = process.env;

export async function createUser(data) {
	const res = await fetch(`${api_url}/users`, {
		method: "POST",
		body: data,
	});

	if (!res.ok) return { error: "Something went wrong. Try again." };

	return await res.json();
}

export async function getUsers(id) {
	"use cache";
	cacheLife("minutes");
	cacheTag("users");

	const res = await fetch(`${api_url}/users` + (id ? `/${id}` : ""));

	if (!res.ok) return { error: "User doesn't exist." };

	const user = await res.json();

	if (user.avatar) {
		const avatar = getAvatarSrc(user.avatar);
		user.avatar = avatar;
	}

	return user;
}

export async function getUserFollowing(id) {
	"use cache";
	cacheLife("minutes");
	cacheTag("user_following");

	const res = await fetch(`${api_url}/users/${id}/following`);

	if (!res.ok) return { error: "Could not complete request." };

	return await res.json();
}

export async function verifyUser(key) {
	const url = `${auth_url}/users/verify/${key}`;

	return await fetch(url).then((res) => res.json());
}

export async function resetUser(email) {
	const url = `${api_url}/users/reset/${email}`;

	return await fetch(url).then((res) => res.json());
}
