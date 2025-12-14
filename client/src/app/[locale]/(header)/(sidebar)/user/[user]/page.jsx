import { getUsers } from "@/features/db/users";

export async function generateStaticParams() {
	const users = await getUsers();

	return users?.map((user) => ({
		user: user.username,
	}));
}

export default async function UserPage() {
	return (
		<section className="col-start-3 col-span-full py-8">
			<p>Add user activity feed and playlists</p>
		</section>
	);
}
