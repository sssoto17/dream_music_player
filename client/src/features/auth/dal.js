"server-only";
// import { verifySession } from "../auth/session";
import { redirect } from "next/navigation";
import { getCookie } from "./session";
// import { getLocalizedHref } from "@/lib/utils";
// import { verifySession } from "./session";
import { verifySessionClient } from "./client";
import { getAvatarSrc } from "@/lib/utils";
// import { cookies } from "next/headers";
// import { verifyUser } from "../db/users";
// import { cacheLife } from "next/cache";
import { getUserFollowing } from "../db/users";
import { verifySessionServer } from "./server";

const {
	AUTH_BASE: auth_url,
	API_BASE: api_url,
	SERVER: server_url,
} = process.env;

const user_url = (id) => {
	return `${auth_url}/me/${id}`;
};

export async function verifyToken(access_token) {
	const res = await fetch(`${auth_url}/sessions/verify/${access_token}`);
	if (!res.ok) return { error: "Invalid json." };

	return await res.json();
}

export async function refreshToken(refresh_token) {
	const res = await fetch(`${auth_url}/sessions/refresh/${refresh_token}`);
	if (!res.ok) return { error: "Invalid json." };

	return await res.json();
}

export async function authenticateUser(credentials) {
	const res = await fetch(`${auth_url}/login`, {
		method: "POST",
		body: credentials,
	});

	if (!res.ok) return;

	return await res.json();
}

export async function getAuthUser() {
	const user_id = await getCookie("user_id");

	const res = await fetch(`${auth_url}/me/${user_id}`);

	if (!res.ok) return;

	const user = await res.json();

	if (user.avatar) {
		const avatar = getAvatarSrc(user.avatar);

		user.avatar = avatar;
	}

	return user;
}

export async function updateAuthUser(data) {
	const { isAuth, user_id } = await verifySessionServer();

	if (!isAuth) return redirect("/login");

	console.log(user_id);

	const res = await fetch(user_url(user_id), {
		method: "PATCH",
		body: data,
	});

	if (!res.ok) {
		return { error: "an error occurred." };
	}

	return await res.json();
}

export async function resetAuthUser(data, key) {
	if (!key) return { error: "Password reset has expired." };

	return await fetch(`${auth_url}/reset/${key}`, {
		method: "PATCH",
		body: data,
	}).then((res) => res.json());
}

export async function deleteAuthUser() {
	const { isAuth, user_id } = await verifySessionClient();

	if (!isAuth) return redirect("/login");

	return await fetch(user_url(user_id), { method: "DELETE" }).then((res) =>
		res.json()
	);
}

export async function authToggleFollow(data) {
	const user_id = await getCookie("user_id");

	if (!user_id) return;

	const url = `${api_url}/users/${user_id}/follow`;

	const res = fetch(url, {
		method: "POST",
		body: data,
	});

	if (!res.ok) return "error";

	return (await res).json();
}

export async function authToggleLikeTrack(data) {
	const user_id = await getCookie("user_id");

	if (!user_id) return;

	const url = `${api_url}/users/likes/${user_id}`;

	const res = fetch(url, {
		method: "POST",
		body: data,
	});

	if (!res.ok) return "error";

	return (await res).json();
}

export async function authIsFollowing(username) {
	const user_id = await getCookie("user_id");

	const following = await getUserFollowing(user_id);

	return following.some((followed) => followed.username == username);
}

export async function getAuthLikes() {
	const user_id = await getCookie("user_id");

	if (!user_id) return;

	const url = `${api_url}/users/likes/${user_id}`;

	const res = await fetch(url);

	if (!res.ok) return "error";

	return await res.json();
}

export async function adminBlockUser(id) {
	const res = await fetch(`${server_url}/admin/restrict/${id}`);

	console.log(res);

	if (!res.ok) return { error: "Could not complete request." };

	return await res.json();
}
