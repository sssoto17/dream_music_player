import { NextResponse } from "next/server";
import { getAuthUser } from "@/features/auth/dal";

const { ADMIN_BASE: admin_url } = process.env;

export async function GET(req) {
	const user_id = req.cookies.get("user_id")?.value;

	const {
		user: { role },
	} = await getAuthUser(user_id);

	if (role !== "admin") {
		return new NextResponse(
			JSON.stringify({
				error: "Unauthorized: user does not have the necessary permissions.",
			}),
			{
				status: 400,
				headers: { "Content-Type": "application/json" },
			}
		);
	}

	const message = await loadLang();

	return new NextResponse(JSON.stringify(message), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}

async function loadLang() {
	const res = await fetch(`${admin_url}/lang-support`);

	if (!res.ok) return { error: "error_message" };

	return await res.json();
}
