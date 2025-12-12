import { getLocalizedHref } from "@/lib/utils";
import Link from "next/link";

import { AiOutlineDashboard } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";

export default async function SettingsSidebar({ params }) {
	const { locale = "en" } = await params;
	return (
		<aside className="text-slate-700 row-span-2">
			<nav className="py-8 px-12 text-lg h-full font-semibold font-display">
				<ul>
					<li className="py-4 border-b border-b-slate-300">
						<Link
							href={getLocalizedHref(locale, "/user/dashboard")}
							className="flex gap-2 items-center"
						>
							<AiOutlineDashboard /> Dashboard
						</Link>
					</li>
					<li className="py-4 border-b border-b-slate-300">
						<Link
							href={getLocalizedHref(
								locale,
								"/user/dashboard/settings"
							)}
							className="flex gap-2 items-center"
						>
							<IoSettingsOutline /> Settings
						</Link>
					</li>
				</ul>
			</nav>
		</aside>
	);
}
