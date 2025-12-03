import { verifyUser } from "@/features/db/users";
import { redirect } from "next/navigation";

export async function GET(request) {
	const key = request.nextUrl.searchParams.get("key");

	const user = await verifyUser(key);

	if (user?.error) {
		redirect("/"); // should redirect to error page
	}

	redirect("/dashboard");
}
