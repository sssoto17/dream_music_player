import Browse from "@/components/browse/Browse";
import { getUsers } from "@/features/db/users";

export async function generateStaticParams() {
	const users = await getUsers();

	return users?.map((user) => ({
		user: user.username,
	}));
}

export default async function UserPage() {
	// const { locale = "en" } = await params;

	return (
		<>
			<Browse />
			<section className="py-8">
				<p>Add user activity feed and playlists</p>
			</section>
		</>
	);
}
