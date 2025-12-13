import { Suspense } from "react";
import Logo from "../global/Logo";
import { UserTag } from "../user/Menu";
import { MinimalSearchbar } from "../browse/Search";
import { LocaleSwitchVariant } from "./LocaleSwitch";
import { getAuthUser } from "@/features/auth/dal";

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
	const { isAuth, user } = await getAuthUser();

	if (!isAuth) return <LocaleSwitchVariant />;

	return (
		<div className="flex gap-4 items-center">
			<MinimalSearchbar />
			<UserTag {...user} />
		</div>
	);
}
