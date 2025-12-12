import { Suspense } from "react";
import UserProfile from "@/components/user/UserProfile";
import { verifySessionServer } from "@/features/auth/server";

export default async function UserSidebar({ params }) {
	const { locale = "en", user } = await params;
	const { isAuth, user_id } = await verifySessionServer();

	if (!isAuth) return null;

	return (
		<Suspense>
			<UserProfile locale={locale} id={user} isAuth={user_id} />
		</Suspense>
	);
}
