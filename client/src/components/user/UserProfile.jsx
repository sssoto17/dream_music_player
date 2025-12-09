import Link from "next/link";
import { getUsers } from "@/features/db/users";
import { getLocalizedHref } from "@/lib/utils";
import { FaPlay } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import { GoPeople } from "react-icons/go";
import { Avatar, AvatarPlaceholder } from "@/components/user/Avatar";
import { authIsFollowing, getAuthUser } from "@/features/auth/dal";
import {
	UserFollowButton,
	CreatePlaylistButton,
} from "@/components/user/Buttons";

export default async function UserProfile({ locale, id }) {
	const isAuth = await getAuthUser();
	const user = await getUsers(id);

	const ownPage = id === isAuth?.username;

	const isFollowing = await authIsFollowing(id);
	console.log(user.followers_total);

	return (
		<article className="text-slate-700 group grid justify-items-center content-start grid-cols-responsive gap-6 py-8">
			<Link href={getLocalizedHref(locale, `/${user.username}`)}>
				{!user.avatar ? (
					<AvatarPlaceholder className="row-span-2" />
				) : (
					<Avatar {...user} className="row-span-2" />
				)}
			</Link>
			<ProfileDetails {...user} locale={locale} />
			{isAuth && ownPage && <UserPlaylists />}
			{isAuth && !ownPage && (
				<UserFollowButton isFollowing={isFollowing} />
			)}
		</article>
	);
}

function ProfileDetails({
	locale,
	username,
	first_name,
	last_name,
	bio,
	created_at,
	followers_total,
}) {
	const member_since = new Date(created_at).toLocaleDateString();
	return (
		<section className="text-slate-500 w-full max-w-56">
			<header className="group mb-1">
				<h2 className="text-xl/tight text-slate-700 group-hover:text-fuchsia-900 transition-all duration-75 ease-in tracking-tight font-extrabold font-display">
					<Link href={getLocalizedHref(locale, `/${username}`)}>
						{first_name} {last_name}
					</Link>
				</h2>
				<Link
					href={getLocalizedHref(locale, `/${username}`)}
					className="text-slate-400 tracking-tight group-hover:text-amber-800 transition-colors duration-75 ease-in font-light"
				>
					@{username}
				</Link>
			</header>
			<p className="font-display cursor-default flex gap-1 items-center">
				<GoPeople />
				{!followers_total
					? "No followers"
					: followers_total === 1
					? `${followers_total} follower`
					: `${followers_total} followers`}
			</p>
			<p className="text-sm/tight py-4 text-slate-500 cursor-default">
				Member since <span className="font-medium">{member_since}</span>
			</p>
			<p>{bio}</p>
		</section>
	);
}

function UserPlaylists() {
	const samplePlaylists = [
		{ name: "Favorites", type: "user_likes" },
		{ name: "Dance Bops" },
		{ name: "For the feels" },
		{ name: "Christmas 2025" },
		{ name: "Them oldies" },
		{ name: "Disney classics" },
	];
	return (
		<section className="py-8 col-span-full">
			<article className="py-4">
				<header className="cursor-default text-2xl font-semibold">
					<h2>Playlists</h2>
				</header>
				<ul className="my-6 bg-white/40 backdrop-blur-2xl">
					{samplePlaylists.map((playlist, id) => {
						return <UserPlaylistItem key={id} {...playlist} />;
					})}
				</ul>
			</article>
			<CreatePlaylistButton />
		</section>
	);
}

function UserPlaylistItem({ name, type }) {
	return (
		<li className="hover:scale-101 hover:font-semibold hover:text-amber-700 transition-all duration-75 ease-in relative py-2 px-6 rounded-md border-t-2 last:border-b-2 border-white">
			<article>
				<h3 className="text-lg">
					<Link
						href=""
						className="group/item flex gap-4 items-center after:absolute after:inset-0"
					>
						{type ? (
							<FaHeart className="w-8 text-xl text-fuchsia-800" />
						) : (
							<div className="aspect-square w-8 rounded-md bg-linear-to-b from-fuchsia-400 to-amber-100" />
						)}
						<span className="grow">{name}</span>
						<FaPlay className="text-amber-700 group-hover/item:scale-101 not-group-hover/item:opacity-0 transition duration-100" />
					</Link>
				</h3>
			</article>
		</li>
	);
}
