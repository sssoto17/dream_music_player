import { Suspense } from "react";
import { getAuthUser } from "@/features/auth/dal";
import UserProfile from "@/components/user/UserProfile";

export default async function IndexSidebar({ params }) {
	const { locale = "en" } = await params;
	const { isAuth, user } = await getAuthUser();

	if (!isAuth) return null;

	return (
		<aside className="row-span-full text-slate-700 group py-8">
			<Suspense>
				<UserProfile locale={locale} {...user} />
				{/* trending music? friends listening to? */}
			</Suspense>
		</aside>
	);
}
