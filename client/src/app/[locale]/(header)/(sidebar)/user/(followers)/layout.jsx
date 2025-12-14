import Tab from "@/components/navigation/Tab";
import { getLang } from "@/lib/lang";
import { Suspense } from "react";
import { ImSpinner2 } from "react-icons/im";

export default async function FollowersLayout({ children, params }) {
	const { locale = "en" } = await params;
	const dict = await getLang(locale);

	return (
		<section className="col-start-2 col-span-full grid gap-y-2">
			<nav className="my-4 flex text-xl font-semibold text-slate-500 *:pl-4 *:pr-8 border-b border-b-amber-600">
				<Tab endpoint="/followers">{dict["followers"]}</Tab>
				<Tab endpoint="/following">{dict["following"]}</Tab>
			</nav>
			<Suspense fallback={<Loader />}>{children}</Suspense>
		</section>
	);
}

function Loader() {
	return (
		<p className="text-slate-500 text-lg animate-pulse flex gap-2 items-center">
			Loading
			<ImSpinner2 size={20} className="animate-spin" />
		</p>
	);
}
