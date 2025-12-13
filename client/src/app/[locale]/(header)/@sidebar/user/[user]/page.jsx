import { Suspense } from "react";
import { getAuthUser, authIsFollowing } from "@/features/auth/dal";
import { UserFollowButton } from "@/components/user/Buttons";
import UserProfile, { UserPlaylists } from "@/components/user/UserProfile";
import { getUsers } from "@/features/db/users";

export default async function UserSidebar({ params }) {
	const { locale = "en", user: username } = await params;
	const {
		user: { id },
	} = await getAuthUser();
	const user = await getUsers(username);

	const isFollowing = await authIsFollowing(username);

	return (
		<aside className="row-span-full text-slate-700 group py-8">
			<Suspense>
				<UserProfile locale={locale} {...user} />
				{user?.id !== id && (
					<UserFollowButton isFollowing={isFollowing} />
				)}
				{user?.id === id && <UserPlaylists />}
			</Suspense>
		</aside>
	);
}
