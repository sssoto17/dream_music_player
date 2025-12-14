import { Suspense } from "react";
import { getAuthUser } from "@/features/auth/dal";
import UserProfile from "@/components/user/UserProfile";

export default async function IndexSidebar({ params }) {
	const { locale = "en" } = await params;
	const { isAuth, user } = await getAuthUser();

	if (!isAuth) return null;

	return (
		<Suspense>
			<UserProfile locale={locale} {...user} />
			{/* trending music? friends listening to? */}
		</Suspense>
	);
}
