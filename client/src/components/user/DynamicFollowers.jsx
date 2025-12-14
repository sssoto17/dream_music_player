"use client";

import { useStore } from "zustand";
import { useParams } from "next/navigation";
import { useContext, useState } from "react";
import {
	createFollowersStore,
	FollowersContext,
} from "@/features/store/followers";
import { getLocalizedHref } from "@/lib/utils";
import { GoPeople } from "react-icons/go";
import Link from "next/link";

export function FollowersProvider({ children, ...props }) {
	const [store] = useState(() => createFollowersStore(props));

	return (
		<FollowersContext.Provider value={store}>
			{children}
		</FollowersContext.Provider>
	);
}

export function useFollowersContext(selector) {
	const store = useContext(FollowersContext);

	if (!store) {
		console.log("Missing context provider.");
	}

	return useStore(store, selector);
}

export default function FollowersCount({
	username,
	icon,
	single,
	multi,
	none,
	className: styles,
}) {
	const { locale } = useParams();
	const followers = useFollowersContext((state) => state.followers);

	return (
		<Link
			href={getLocalizedHref(locale, `/user/${username}/followers`)}
			className={`flex gap-1 items-center hover:text-amber-800 lowercase ${styles}`}
		>
			{icon && <GoPeople />}
			{!followers
				? { none }
				: followers === 1
				? `${followers} ${single}`
				: `${followers} ${multi}`}
		</Link>
	);
}
