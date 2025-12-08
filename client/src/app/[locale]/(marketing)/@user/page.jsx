import Image from "next/image";
import { getAuthUser } from "@/features/auth/dal";
import { getCookie } from "@/features/auth/session";
import Link from "next/link";
import { getLocalizedHref } from "@/lib/utils";
import { GoPeople } from "react-icons/go";

export default async function UserProfile({ locale }) {
	const userID = await getCookie("user_id");
	const user = await getAuthUser(userID);

	if (!user) return;

	return (
		<article className="text-slate-700 group grid content-start grid-cols-2 gap-x-6 py-8">
			<Link href={getLocalizedHref(locale, `/${user.username}`)}>
				<Image
					src={user.avatar}
					alt={user.username}
					width={480}
					height={480}
					className="aspect-2/3 object-cover rounded-2xl row-span-2"
				/>
			</Link>
			<ProfileDetails {...user} locale={locale} />
			<UserPlaylists />
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
}) {
	const member_since = new Date(created_at).toLocaleDateString();
	return (
		<section className="text-slate-500">
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
				125 followers
			</p>
			<p className="text-sm/tight py-4 text-slate-500 cursor-default">
				Member since <span className="font-medium">{member_since}</span>
			</p>
			<p>{bio}</p>
		</section>
	);
}

import { FaPlus, FaPlay } from "react-icons/fa6";

function UserPlaylists() {
	const samplePlaylists = [
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
					{samplePlaylists.map(({ name }, id) => {
						return (
							<li
								key={id}
								className="hover:scale-101 hover:font-semibold hover:text-amber-700 transition-all duration-75 ease-in relative py-2 px-6 rounded-md border-t-2 last:border-b-2 border-white"
							>
								<article>
									<h3 className="text-lg">
										<Link
											href=""
											className="group/item flex gap-4 items-center after:absolute after:inset-0"
										>
											<span className="grow">{name}</span>
											<FaPlay className="text-amber-700 group-hover/item:scale-101 not-group-hover/item:opacity-0 transition duration-100" />
										</Link>
									</h3>
								</article>
							</li>
						);
					})}
				</ul>
			</article>
			<button className="flex items-center gap-2 mx-auto place-content-center bg-fuchsia-700 hover:bg-fuchsia-600 w-full max-w-64 rounded-full py-2 px-4 font-semibold font-display cursor-pointer hover:scale-101 transition-all duration-75 ease-in text-white">
				<FaPlus /> Create playlist
			</button>
		</section>
	);
}
