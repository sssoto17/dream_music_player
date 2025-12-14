import { Suspense } from "react";
import { getAuthUser } from "@/features/auth/dal";
import UserProfile from "@/components/user/UserProfile";
import { FollowersProvider } from "@/components/user/DynamicFollowers";

export default async function IndexSidebar({ params }) {
	const { locale = "en" } = await params;
	const { isAuth, user } = await getAuthUser();

	if (!isAuth) return null;

	return (
		<Suspense>
			<FollowersProvider
				followers={user?.followers_total}
				isFollowing={false}
			>
				<UserProfile locale={locale} {...user} />
				{/* trending music? friends listening to? */}
			</FollowersProvider>
		</Suspense>
	);
}
