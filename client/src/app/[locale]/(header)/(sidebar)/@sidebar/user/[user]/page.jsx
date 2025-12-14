import { Suspense } from "react";
import { getAuthUser, authIsFollowing } from "@/features/auth/dal";
import { UserFollowButton } from "@/components/user/Buttons";
import UserProfile, { UserPlaylists } from "@/components/user/UserProfile";
import { FollowersProvider } from "@/components/user/DynamicFollowers";
import { getUser } from "@/features/db/users";
import { getLang } from "@/lib/lang";

export default async function UserSidebar({ params }) {
	const {
		user: { username: authUser },
	} = await getAuthUser();
	const { locale = "en", user: username = authUser } = await params;
	const { followers_total } = await getUser(username);
	const dict = await getLang(locale);

	const isFollowing = await authIsFollowing(username);

	return (
		<Suspense>
			<UserProfile locale={locale} id={username} />
			{username !== authUser && (
				<FollowersProvider
					followers={followers_total}
					isFollowing={isFollowing}
				>
					<UserFollowButton dict={dict} />
				</FollowersProvider>
			)}
			{username === authUser && <UserPlaylists />}
		</Suspense>
	);
}
