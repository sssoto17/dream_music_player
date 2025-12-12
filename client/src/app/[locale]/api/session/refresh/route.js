import { NextResponse } from "next/server";
import { cookie_options } from "@/features/auth/session";
import { refreshToken } from "@/features/auth/dal";
import { revalidateTag, revalidatePath } from "next/cache";

export async function GET(req) {
	const refresh_token = req.cookies.get("refresh_token")?.value;

	if (!refresh_token) {
		return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
	}

	const res = await refreshToken(refresh_token);

	if (res?.error) {
		const failResponse = NextResponse.json(
			{ isAuth: false, error: "Invalid refresh token." },
			{ status: 401 }
		);

		failResponse.cookies.delete("access_token");
		failResponse.cookies.delete("refresh_token");
		failResponse.cookies.delete("user_id");
		return failResponse;
	}

	const successResponse = NextResponse.json({
		isAuth: true,
		userId: res.user_id,
	});

	successResponse.cookies.set("refresh_token", res.refresh_token, {
		...cookie_options,
		maxAge: 21600,
	});
	successResponse.cookies.set(
		"access_token",
		res.access_token,
		cookie_options
	);
	successResponse.cookies.set("user_id", res.user_id, cookie_options);

	revalidatePath("/", "layout");
	revalidateTag("user", { expire: 0 });
	return successResponse;
}
