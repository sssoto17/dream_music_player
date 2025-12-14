import { UserItem } from "@/app/[locale]/(header)/(sidebar)/user/dashboard/client";
import { getAvatarSrc } from "@/lib/utils";
import { getAuthUser } from "@/features/auth/dal";
import { getUserFollowers, getUserFollowing } from "@/features/db/users";
import { getLang } from "@/lib/lang";

export async function Followers({ params }) {
	const {
		user: { username },
	} = await getAuthUser();
	const { locale = "en", user = username } = await params;

	const followers = await getUserFollowers(user);
	const dict = await getLang(locale);

	if (!followers.length) return <p>{dict["user_no_followers"]}</p>;

	return (
		<ul>
			{followers.map((user) => {
				const src = getAvatarSrc(user.avatar);

				return (
					<UserItem
						key={user.id}
						{...user}
						avatar={src}
						dict={dict}
					/>
				);
			})}
		</ul>
	);
}

export async function Following({ params }) {
	const {
		user: { username },
	} = await getAuthUser();
	const { locale = "en", user = username } = await params;

	const following = await getUserFollowing(user);
	const dict = await getLang(locale);

	if (!following.length) return <p> {dict["user_no_following"]} </p>;

	return (
		<ul>
			{following.map((user) => {
				const src = getAvatarSrc(user.avatar);

				return (
					<UserItem
						key={user.id}
						{...user}
						avatar={src}
						dict={dict}
					/>
				);
			})}
		</ul>
	);
}
