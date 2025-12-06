import "server-only";
import { cookies } from "next/headers";

export async function createSession({ session, expires_at }) {
	const store = await cookies();

	if (!session) return { isAuth: false };

	store.set("session", session, {
		httpOnly: true,
		secure: true,
		expires: expires_at,
		sameSite: "lax",
		path: "/",
	});

	return { isAuth: true };
}

export async function updateSession() {
	const store = await cookies();
	const refresh_token = store.get("refresh_token").value;

	if (!refresh_token) {
		return { error: "Unauthorized: Please sign in." };
	}

	const access_token = await fetch(
		`${auth_url}/access/token/${user.id}`
	).then((res) => res.json());

	// const { access_token, expire_in, error } = await refreshToken(refresh_token);

	// if (error) {
	//   store.delete("refresh_token");
	//   return { error: "Invalid token." };
	// }

	store.set("access_token", access_token);
}

export const verifySession = async () => {
	const store = await cookies();

	const id = store.get("user_id")?.value;
	const access_token = store.get("access_token")?.value;

	if (!id) return { isAuth: false };

	return { isAuth: true, userID: id, access_token: access_token };
};

export async function deleteSession() {
	(await cookies()).delete("session");
}
