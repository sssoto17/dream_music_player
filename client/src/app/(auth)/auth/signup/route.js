import { redirect } from "next/navigation";
import { createSession } from "@/features/auth/session";

export async function GET(request) {
	const key = request.nextUrl.searchParams.get("key");

	if (!key) redirect("/"); // should redirect to error page

	await createSession({
		id: request.nextUrl.searchParams.get("id"),
		username: "",
		access_token: request.nextUrl.searchParams.get("token"),
	});

	redirect(`/create-account?v=${request.nextUrl.searchParams.get("key")}`);
}
