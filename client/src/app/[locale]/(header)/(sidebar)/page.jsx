import { getAuthUser } from "@/features/auth/dal";
import { redirect } from "next/navigation";
import { getLocalizedHref } from "@/lib/utils";
import { getUserFeed } from "@/features/db/users";
import UserFeed from "@/components/user/Post";

export default async function Home({ params }) {
	const { locale } = await params;

	const { isAuth, user } = await getAuthUser();

	if (!isAuth) redirect(getLocalizedHref(locale, "/login"));

	const feed = await getUserFeed(user.id);

	return <UserFeed user={user} feed={feed} />;
}
