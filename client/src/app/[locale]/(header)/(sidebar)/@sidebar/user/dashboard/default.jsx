import { getLang } from "@/lib/lang";
import { getLocalizedHref } from "@/lib/utils";
import Link from "next/link";

import { AiOutlineDashboard } from "react-icons/ai";
import { GoPeople } from "react-icons/go";
import { IoSettingsOutline } from "react-icons/io5";

export default async function SettingsSidebar({ params }) {
	const { locale = "en" } = await params;
	const dict = await getLang(locale);

	const nav = [
		{
			title: dict["dashboard"],
			icon: <AiOutlineDashboard />,
			url: "/user/dashboard",
			locale,
		},
		{
			title: dict["followers"],
			icon: <GoPeople />,
			url: "/user/dashboard/followers",
			locale,
		},
		{
			title: dict["settings"],
			icon: <IoSettingsOutline />,
			url: "/user/dashboard/settings",
			locale,
		},
	];
	return (
		<nav className="place-self-center w-full max-w-sm px-12 text-lg font-semibold font-display text-slate-700">
			<ul>
				{nav.map((item, id) => {
					return <NavItem key={id} {...item} />;
				})}
			</ul>
		</nav>
	);
}

function NavItem({ title, icon, url, locale }) {
	return (
		<li className="py-4 border-b border-b-slate-300">
			<Link
				href={getLocalizedHref(locale, url)}
				className="flex gap-2 items-center"
			>
				{icon} {title}
			</Link>
		</li>
	);
}
