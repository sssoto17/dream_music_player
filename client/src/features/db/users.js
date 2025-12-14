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

export async function getUser(id) {
	const res = await fetch(`${api_url}/users/${id}`, {
		cache: "force-cache",
		next: { revalidate: 300, tags: ["user", "users"] },
	});

	if (!res.ok) return { error: "User doesn't exist." };

	const user = await res.json();

	if (user.avatar) {
		const avatar = getAvatarSrc(user.avatar);
		user.avatar = avatar;
	}

	return user;
}

export async function getUsers() {
	const res = await fetch(`${api_url}/users`, {
		cache: "force-cache",
		next: { revalidate: 300, tags: ["users"] },
	});

	if (!res.ok) return { error: "No users." };

	return await res.json();
}

export async function searchUsers(query) {
	const res = await fetch(`${api_url}/search/users?q=${query}`, {
		cache: "no-cache",
		next: { revalidate: 0 },
	});

	if (!res.ok) return { error: "No matching results." };

	const result = await res.json();

	const users = result.map((user) => {
		if (user.avatar) {
			const avatar = getAvatarSrc(user.avatar);
			user.avatar = avatar;
			return user;
		}
	});

	return users;
}

export async function getUserFollowers(id) {
	const res = await fetch(`${api_url}/users/${id}/followers`, {
		cache: "force-cache",
		next: { revalidate: 150, tags: ["user", "followers"] },
	});

	if (!res.ok) return { error: "Could not complete request." };

	return await res.json();
}

export async function getUserFollowing(id) {
	const res = await fetch(`${api_url}/users/${id}/following`, {
		cache: "force-cache",
		next: { revalidate: 150, tags: ["user", "followers"] },
	});

	if (!res.ok) return { error: "Could not complete request." };

	return await res.json();
}

export async function verifyUser(key) {
	const url = `${auth_url}/users/verify/${key}`;

	return await fetch(url).then((res) => res.json());
}

export async function resetUser(email) {
	const url = `${api_url}/users/reset/${email}`;

	const res = await fetch(url);

	if (!res.ok) return { error: "Something went wrong." };

	return await res.json();
}
