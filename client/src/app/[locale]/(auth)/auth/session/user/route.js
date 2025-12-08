import { getAuthUser } from "@/features/auth/dal";
import { getAvatarSrc } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET(req) {
	const user_id = req.cookies.get("user_id")?.value;

	const res = await getAuthUser(user_id);

	if (res?.error) {
		return NextResponse.json({ error: "No user with matching ID." });
	}

	const user = { ...res };

	const src = getAvatarSrc(user.avatar);

	user.avatar = src;

	return new NextResponse(JSON.stringify(user), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}
