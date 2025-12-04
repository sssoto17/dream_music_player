import { verifySession } from "../auth/session";
import { redirect } from "next/navigation";
import { verifyUser } from "../db/users";

const { AUTH_BASE: auth_url } = process.env;

const user_url = (id) => {
	return `${auth_url}/me/${id}`;
};

export async function authenticateUser(userCredentials) {
	const url = `${auth_url}/login`;
	const payload = {
		method: "POST",
		body: userCredentials,
	};
	return await fetch(url, payload).then((res) => res.json());
}

export async function getAuthUser() {
	const { isAuth, userID } = await verifySession();

	if (!isAuth) redirect("/login");

	return await fetch(user_url(userID)).then((res) => res.json());
}

export async function updateAuthUser(data) {
	let id;
	const key = data.get("r_key");
	const { isAuth, userID } = await verifySession();

	if (!isAuth && !key) redirect("/login");

	if (isAuth) {
		id = userID;
	}

	if (key) {
		const user = await verifyUser(key);

		id = user?.id;
	}

	if (!id) return { error: "Password reset has expired." };

	const url = user_url(id);

	return await fetch(url, {
		method: "PATCH",
		body: data,
	}).then((res) => res.json());
}

export async function deleteAuthUser() {
	const { isAuth, userID } = await verifySession();

	if (!isAuth) redirect("/login");

	return await fetch(user_url(userID), { method: "DELETE" }).then((res) =>
		res.json()
	);
}
