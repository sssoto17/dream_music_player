import { NextResponse } from "next/server";
import { verifyToken } from "@/features/auth/dal";

export async function GET(req) {
	const access_token = req.cookies.get("access_token")?.value;

	if (!access_token) {
		return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
	}

	const res = access_token ? await verifyToken(access_token) : null;

	if (res?.error) {
		return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
	}

	return NextResponse.json({ isAuth: true, user_id: res.user_id });
}
