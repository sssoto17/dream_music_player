import UserProfile from "@/components/user/UserProfile";
import { Suspense } from "react";
import { verifySessionServer } from "@/features/auth/server";

export default async function IndexSidebar({ params }) {
	// const { locale = "en" } = await params;
	// const { isAuth, user_id } = await verifySessionServer();
	// if (!isAuth) return null;
	// return (
	// 	<Suspense>
	// 		<UserProfile locale={locale} id={user_id} isAuth={user_id} />
	// 	</Suspense>
	// );

	return null;
}
