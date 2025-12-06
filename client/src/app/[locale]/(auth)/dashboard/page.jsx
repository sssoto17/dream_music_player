import Image from "next/image";
import Link from "next/link";
import { getAvatarSrc } from "@/lib/utils";
import { getUsers } from "@/features/db/users";
import { cacheLife, cacheTag } from "next/cache";

export default async function User() {
	"use cache";
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
						<Link href="/profile/settings">Account settings</Link>
					</li>
					<li>
						<Link href="/auth/signout">Sign out</Link>
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
