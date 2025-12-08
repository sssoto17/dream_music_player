import { getUsers } from "@/features/db/users";
import { getAvatarSrc, getLocalizedHref } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export async function generateStaticParams() {
	const users = await getUsers();

	return users.map((user) => ({
		user: user.username,
	}));
}

export default async function UserProfile({ params }) {
	const { locale = "en", user } = await params;

	const { username, avatar, bio, created_at, first_name, last_name } =
		await getUsers(user);

	const displayName = `${first_name} ${last_name}`;
	// console.log(userProfile);
	return (
		<main>
			<section className="grid grid-cols-6 gap-x-8 py-8">
				<Image
					src={getAvatarSrc(avatar)}
					alt={username}
					width={280}
					height={280}
					className="aspect-3/4 object-cover rounded-2xl col-span-2"
				/>
				<article className="col-start-3 col-span-full">
					<header>
						<h2 className="flex gap-2 items-end">
							<Link
								href={getLocalizedHref(locale, `/${username}`)}
							>
								<span className="text-xl/tight font-bold font-display">
									{displayName}
								</span>
								<span className="text-slate-400 font-light">
									@{username}
								</span>
							</Link>
						</h2>
					</header>
				</article>
			</section>
		</main>
	);
}
