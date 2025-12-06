import { redirect } from "next/navigation";
import { deleteSession } from "@/features/auth/session";

const allowedLocales = ["en", "dk"];

const getLocale = (pathname) => {
	return allowedLocales.find((locale) => pathname.startsWith(`/${locale}`));
};

export async function GET(req) {
	const { pathname } = req.nextUrl;

	const locale = getLocale(pathname);

	await deleteSession();

	if (!locale) redirect("/login");

	redirect(`/${locale}/login`);
}
