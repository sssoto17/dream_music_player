import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/user/Avatar";
import { CreatePlaylistButton } from "@/components/user/Buttons";
import { getLocalizedHref } from "@/lib/utils";
import { FaPlay } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import { RiPoliceBadgeLine } from "react-icons/ri";
import { Suspense } from "react";
import { getUser } from "@/features/db/users";
import FollowersCount from "./DynamicFollowers";
import { getLang } from "@/lib/lang";

export default async function UserProfileSidebar({ locale, id }) {
	const user = await getUser(id);
	const dict = await getLang(locale);

	return (
		<section className="grid content-start grid-res-cols-4xs gap-6 w-full">
			<Suspense fallback={<AvatarFallback size="full" />}>
				<Link
					href={getLocalizedHref(locale, `/user/${user?.username}`)}
				>
					<Avatar {...user} className="row-span-2" />
				</Link>
			</Suspense>
			<ProfileDetails locale={locale} {...user} dict={dict} />
		</section>
	);
}

function ProfileDetails({
	locale,
	username,
	first_name,
	last_name,
	bio,
	created_at,
	role,
	dict,
}) {
	const member_since = new Date(created_at).toLocaleDateString();
	return (
		<section className="text-slate-500 w-full max-w-56">
			<header className="group mb-1">
				<h2 className="text-xl/tight text-slate-700 transition-all duration-75 ease-in tracking-tight font-extrabold font-display">
					<Link
						href={getLocalizedHref(locale, `/user/${username}`)}
						className="flex gap-2 items-center text-fuchsia-900"
					>
						<span>
							{first_name} {last_name}
						</span>
						{role === "admin" && (
							<RiPoliceBadgeLine aria-label="Admin badge" />
						)}
					</Link>
				</h2>
				<Link
					href={getLocalizedHref(locale, `/user/${username}`)}
					className="text-slate-400 tracking-tight hover:text-amber-800 transition-colors duration-75 ease-in font-light"
				>
					@{username}
				</Link>
			</header>
			<FollowersCount
				username={username}
				className="font-display"
				icon
				dict={dict}
			/>
			<p className="text-sm/tight py-4 text-slate-500 cursor-default">
				{dict["member_since"]}{" "}
				<span className="font-medium">{member_since}</span>
			</p>
			<p>{bio}</p>
		</section>
	);
}

export function UserPlaylists() {
	const samplePlaylists = [
		{ name: "Favorites", type: "user_likes" },
		{ name: "Dance Bops" },
		{ name: "For the feels" },
		{ name: "Christmas 2025" },
		{ name: "Them oldies" },
		{ name: "Disney classics" },
	];
	return (
		<section>
			<article className="py-4">
				<header className="cursor-default text-2xl font-semibold">
					<h2>Playlists</h2>
				</header>
				<ul className="my-4 bg-white/40 backdrop-blur-2xl min-w-4xs">
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
