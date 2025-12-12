"use client";

import { FaUserAltSlash } from "react-icons/fa";
import Image from "next/image";
import { startTransition } from "react";
import { BlockUser } from "@/features/actions/auth_actions";
import Link from "next/link";
import { getLocalizedHref } from "@/lib/utils";

export function UserItem({
	id,
	avatar,
	username,
	first_name,
	last_name,
	followers_total,
	isAdmin,
	isBlocked,
	locale,
}) {
	function handleAdminBlock() {
		startTransition(() => {
			BlockUser(id);
		});
	}
	return (
		<li className="relative text-slate-700 group py-2 text-lg font-medium flex items-center gap-4 text-left hover:cursor-pointer hover:scale-101 transition-all duration-75 ease-in">
			<Image
				className={`${
					isBlocked && "opacity-60"
				} aspect-square max-w-20 object-cover rounded-md`}
				src={avatar}
				width={200}
				height={200}
				alt={username}
			/>
			<header className="grow">
				<h3 className="text-xl font-bold">
					<Link
						className="after:absolute after:inset-0"
						href={getLocalizedHref(locale, `/user/${username}`)}
					>
						{first_name + " " + last_name}
					</Link>
					{isBlocked && (
						<span className="ml-2 text-sm uppercase text-slate-600 font-medium font-copy">
							Restricted
						</span>
					)}
				</h3>
				<p className="text-sm text-slate-500">@{username}</p>
			</header>
			<p>
				{!followers_total
					? "No followers"
					: followers_total == 1
					? `${followers_total} follower`
					: `${followers_total} followers`}
			</p>
			{isAdmin && (
				<button
					onClick={handleAdminBlock}
					aria-label="Block user"
					className="not-group-hover:opacity-0 cursor-pointer hover:scale-105"
				>
					<FaUserAltSlash />
				</button>
			)}
		</li>
	);
}
