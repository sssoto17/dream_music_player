import Link from "next/link";
import { Suspense } from "react";
import { getLocalizedHref } from "@/lib/utils";
import { getCookie } from "@/features/auth/session";
import { getAuthUser } from "@/features/auth/dal";
import { UserTag, SignInButton } from "../user/Avatar";
import { MinimalSearchbar } from "../browse/Search";
import Logo from "./Logo";

export default async function Header({ locale }) {
	return (
		<header className="z-10 items-center content-center py-4 h-28 bg-white text-slate-800 text-xl font-display drop-shadow-md">
			<nav className="flex justify-between items-center">
				<Logo locale={locale} />
				<Suspense>
					<Navigation />
				</Suspense>
			</nav>
		</header>
	);
}

async function Navigation() {
	const userID = await getCookie("user_id");

	return (
		<div className="flex gap-4 items-center">
			<MinimalSearchbar />
			<AuthGuardServer id={userID} />
		</div>
	);
}

async function AuthGuardServer({ id }) {
	const user = await getAuthUser(id);

	if (!user) return <SignInButton />;

	return <UserTag {...user} />;
}
