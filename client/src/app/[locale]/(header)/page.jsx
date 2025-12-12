import Browse from "@/components/browse/Browse";
import { getAuthUser } from "@/features/auth/dal";

import { redirect } from "next/navigation";
import { getLocalizedHref } from "@/lib/utils";

export default async function Home({ params }) {
	const { locale } = await params;

	// const user = await getAuthUser();

	// console.log(user);

	return null;

	if (user)
		return (
			<section className="col-start-2 col-span-full">
				<Browse />
			</section>
		);

	// redirect(getLocalizedHref(locale, "/login"));
}
