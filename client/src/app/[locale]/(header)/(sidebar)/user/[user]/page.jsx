import UserFeed from "@/components/user/Post";
import { getUser, getUserPosts, getUsers } from "@/features/db/users";

export async function generateStaticParams() {
	const users = await getUsers();

	return users?.map((user) => ({
		user: user.username,
	}));
}

export default async function UserPage({ params }) {
	const { user: username } = await params;

	const user = await getUser(username);

	const feed = await getUserPosts(user.id);

	return <UserFeed user={user} feed={feed} />;
}
