import { Suspense } from "react";
import { getCookie } from "@/features/auth/session";
import { getAuthUser } from "@/features/auth/dal";
import { UserTag } from "../user/Menu";
import { MinimalSearchbar } from "../browse/Search";
import Logo from "../global/Logo";
import { LocaleSwitchVariant } from "./LocaleSwitch";
import { SignInButton, SignUpButton } from "./ClientProviders";

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
	const user_id = await getCookie("user_id");
	const user = await getAuthUser(user_id);

	return (
		<div className="flex gap-4 items-center">
			{!user ? (
				<>
					<LocaleSwitchVariant />
				</>
			) : (
				<>
					<MinimalSearchbar />
					<UserTag {...user} />
				</>
			)}
		</div>
	);
}
