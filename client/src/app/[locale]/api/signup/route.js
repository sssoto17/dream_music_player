import { NextResponse } from "next/server";
import { cookie_options } from "@/features/auth/session";

export async function GET(request) {
	const { searchParams, origin } = request.nextUrl;
	const key = searchParams.get("key");

	if (!key) {
		return NextResponse.redirect(`${origin}/login`);
	}

	const redirectUrl = new URL(`${origin}/create_account`);
	redirectUrl.searchParams.set("key", key);

	const response = NextResponse.redirect(redirectUrl);

	// Cookies
	response.cookies.set("refresh_token", key, {
		...cookie_options,
		maxAge: 21600,
	});

	response.cookies.set(
		"access_token",
		searchParams.get("token"),
		cookie_options
	);

	response.cookies.set("user_id", searchParams.get("id"), cookie_options);

	return response;
}
