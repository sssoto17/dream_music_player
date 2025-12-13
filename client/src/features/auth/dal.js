"server-only";
import { verifySessionClient } from "./client";
import { verifySessionServer } from "./server";
import { getAvatarSrc } from "@/lib/utils";
import { getUserFollowing } from "../db/users";

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

	if (!res.ok) return { error: "Wrong email or password." };

	return await res.json();
}

export async function getAuthUser() {
	const { isAuth, user_id } = await verifySessionServer();

	if (!isAuth) return { isAuth };

	const res = await fetch(`${auth_url}/me/${user_id}`);

	if (!res.ok) return;

	const user = await res.json();

	if (user.avatar) {
		const avatar = getAvatarSrc(user.avatar);

		user.avatar = avatar;
	}

	return { isAuth, user };
}

export async function updateAuthUser(data) {
	const { isAuth, user_id } = await verifySessionServer();

	if (!isAuth) return { isAuth };

	const res = await fetch(user_url(user_id), {
		method: "PATCH",
		body: data,
	});

	if (!res.ok) {
		const error = await res.json();

		if (!error) return { error: "An error occurred." };

		return error;
	}

	return await res.json();
}

export async function checkResetKey(key) {
	const res = await fetch(`${auth_url}/reset/${key}`);

	if (!res.ok) return { error: "Something went wrong." };

	return await res.json();
}

export async function resetAuthUser(key, data) {
	if (!key) return { error: "Password reset has expired." };

	const res = await fetch(`${auth_url}/reset/${key}`, {
		method: "PATCH",
		body: data,
	});

	if (!res.ok) return { error: "Something went wrong." };
	return await res.json();
}

export async function deleteAuthUser() {
	const { isAuth, user_id } = await verifySessionClient();

	if (!isAuth) return { isAuth };

	return await fetch(user_url(user_id), { method: "DELETE" }).then((res) =>
		res.json()
	);
}

export async function authToggleFollow(data) {
	const { isAuth, user_id } = await verifySessionServer();

	if (!isAuth) return { isAuth };

	const url = `${api_url}/users/${user_id}/follow`;

	const res = fetch(url, {
		method: "POST",
		body: data,
	});

	if (!res.ok) return "error";

	return (await res).json();
}

export async function authToggleLikeTrack(data) {
	const { isAuth, user_id } = await verifySessionClient();

	if (!isAuth) return { isAuth };

	const url = `${api_url}/users/likes/${user_id}`;

	const res = fetch(url, {
		method: "POST",
		body: data,
	});

	if (!res.ok) return "error";

	return (await res).json();
}

export async function authIsFollowing(username) {
	const { isAuth, user_id } = await verifySessionServer();

	if (!isAuth) return { isAuth };

	const following = await getUserFollowing(user_id);

	return following.some((followed) => followed.username == username);
}

export async function getAuthLikes() {
	const { isAuth, user_id } = await verifySessionClient();

	if (!isAuth) return { isAuth };

	const url = `${api_url}/users/likes/${user_id}`;

	const res = await fetch(url);

	if (!res.ok) return "error";

	return await res.json();
}

export async function adminBlockUser(id) {
	const { isAuth } = await verifySessionClient();

	if (!isAuth) return { isAuth };

	const res = await fetch(`${server_url}/admin/restrict/${id}`);

	if (!res.ok) return { error: "Could not complete request." };

	return await res.json();
}
