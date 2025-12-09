import UserProfile from "@/components/user/UserProfile";
import AuthGuard from "../_components/AuthGuard";
import { getAuthUser } from "@/features/auth/dal";
import { Suspense } from "react";

export default async function UserSidebar({ params }) {
	const { locale = "en", user } = await params;

	return (
		<Suspense>
			<AuthGuard
				placeholder={
					<div className="bg-white/70 rounded-2xl w-full min-h-160 animate-pulse" />
				}
			>
				<aside className="row-span-full">
					<UserProfile locale={locale} id={user} />
				</aside>
			</AuthGuard>
		</Suspense>
	);
}
