import Image from "next/image";
import Link from "next/link";
import { getAvatarSrc, getLocalizedHref } from "@/lib/utils";
import { getUsers } from "@/features/db/users";
import { cacheLife, cacheTag } from "next/cache";

export default async function User({ params }) {
	"use cache";
	const { locale } = await params;
	cacheLife("default");
	cacheTag("user");

	const user = await getUsers().then((users) => users[2]);
	const src = getAvatarSrc(user?.avatar);

	return (
		<main>
			<section>
				<h3>Hello {user.username}</h3>
				<ul>
					<li>
						<Link
							href={getLocalizedHref(
								locale,
								"/dashboard/settings"
							)}
						>
							Account settings
						</Link>
					</li>
					<li>
						<Link
							replace
							href={getLocalizedHref(locale, "/auth/signout")}
						>
							Sign out
						</Link>
					</li>
				</ul>
				{user?.avatar && (
					<Image
						src={src}
						alt="User avatar"
						width={400}
						height={500}
					/>
				)}
			</section>
		</main>
	);
}
