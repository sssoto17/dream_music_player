import { Suspense } from "react";
import Logo from "../global/Logo";
import { UserTag } from "../user/Menu";
import { MinimalSearchbar } from "../browse/Search";
import { LocaleSwitchVariant } from "./LocaleSwitch";
import { getAuthUser } from "@/features/auth/dal";
import { getLang } from "@/lib/lang";

export default function Header({ locale }) {
	return (
		<header className="z-70 py-4 h-28 items-center content-center bg-white  font-display drop-shadow-md">
			<nav className="content-layout flex justify-between items-center">
				<Suspense>
					<Logo />
					<Navigation locale={locale} />
				</Suspense>
			</nav>
		</header>
	);
}

async function Navigation({ locale }) {
	const { isAuth, user } = await getAuthUser();
	const dict = await getLang(locale);

	if (!isAuth) return <LocaleSwitchVariant />;

	return (
		<div className="flex gap-4 items-center">
			<MinimalSearchbar>{dict["search"]}</MinimalSearchbar>
			<UserTag {...user} dict={dict} />
		</div>
	);
}
