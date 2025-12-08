const { AUTH_BASE: auth_url } = process.env;

export async function getPublicToken() {
	const headers = {};

	const res = await fetch(`${auth_url}/client/token`, {
		next: { revalidate: 3000 },
	});

	if (!res.ok) return { error: "An error occurred." };

	const { access_token, token_type } = await res.json();

	headers.Authorization = `${token_type} ${access_token}`;

	return { headers };
}
