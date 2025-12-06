import Link from "next/link";
import { Suspense } from "react";
import { getUsers } from "@/features/db/users";
import Image from "next/image";
import { getAvatarSrc } from "@/lib/utils";

export default async function Home({ params }) {
	const { locale } = await params;

	// const testAlbum = `/album/${process.env.SPOTIFY_TEST_ALBUM}`;

	return (
		<main className="h-screen">
			{/* <Link className="block" href={getLocalizedHref(locale, testAlbum)}>
				Go to album
			</Link> */}
			<Suspense>
				<User lang={locale} />
			</Suspense>
		</main>
	);
}

async function User() {
	const user = await getUsers().then((users) => users[2]);

	if (!user) {
		return <p>No user found.</p>;
	}

	const avatar = getAvatarSrc(user.avatar);

	return (
		<div>
			<p> {user.username} </p>
			{user.avatar && (
				<Image
					src={avatar}
					alt={user.username}
					width={200}
					height={200}
				/>
			)}
		</div>
	);
}
