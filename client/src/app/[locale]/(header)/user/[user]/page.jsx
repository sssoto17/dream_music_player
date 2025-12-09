import Browse from "@/components/browse/Browse";
import { getUsers } from "@/features/db/users";
import { getAvatarSrc, getLocalizedHref } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export async function generateStaticParams() {
	const users = await getUsers();

	return users?.map((user) => ({
		user: user.username,
	}));
}

export default async function Page({ params }) {
	const { locale = "en", user } = await params;

	console.log(user);

	return <Browse />;
	return (
		<section className="py-8">
			<p>Add user activity feed and playlists</p>
		</section>
	);
}
