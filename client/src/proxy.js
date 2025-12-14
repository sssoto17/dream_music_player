import { NextResponse } from "next/server";
import { getLocale } from "./lib/lang";
import { getCookie } from "./features/auth/session";

const authRoutes = ["/user", "/create_account"];
const pubRoutes = ["/login", "/login/reset"];

const checkAuthRoute = (pathname) => {
	return authRoutes.find((route) => pathname.includes(route));
};

const checkPubRoute = (pathname) => {
	return pubRoutes.find((route) => pathname.includes(route));
};

export default async function proxy(req) {
	const { pathname } = req.nextUrl;

	const locale = getLocale(pathname);
	const session = await getCookie("access_token");

	// AUTH REDIRECTS

	const isAuth = checkAuthRoute(pathname);
	const isPub = checkPubRoute(pathname);

	if (!session && isAuth) {
		req.nextUrl.pathname = !locale ? "/login" : `/${locale}/login`;

		return NextResponse.redirect(
			new URL(req.nextUrl.pathname, req.nextUrl)
		);
	}

	if (session && isPub) {
		req.nextUrl.pathname = !locale ? "/" : `/${locale}`;

		return NextResponse.redirect(
			new URL(req.nextUrl.pathname, req.nextUrl)
		);
	}

	// LOCALE URL

	if (!locale) {
		req.nextUrl.pathname = `/en${pathname}`;

		return NextResponse.rewrite(new URL(req.nextUrl.pathname, req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!_next).*)"],
};
