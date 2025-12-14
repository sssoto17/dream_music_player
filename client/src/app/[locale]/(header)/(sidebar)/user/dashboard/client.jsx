"use client";

import Image from "next/image";
import Link from "next/link";
import { getLocalizedHref } from "@/lib/utils";
import { useParams } from "next/navigation";
import FollowersCount, {
	FollowersProvider,
} from "@/components/user/DynamicFollowers";
import { AdminBlockButton } from "@/components/admin/Buttons";
import { useActionState, startTransition } from "react";
import { BlockUser } from "@/features/actions/admin_actions";
import { AvatarIcon } from "@/components/user/Avatar";

export function UserItem({
	id,
	avatar,
	username,
	first_name,
	last_name,
	followers_total,
	isAdmin,
	is_blocked,
	dict,
}) {
	const { locale = "en" } = useParams();
	const [state, submit, isPending] = useActionState(BlockUser, {
		is_blocked: is_blocked,
	});

	function handleAdminBlock() {
		startTransition(() => {
			submit(id);
		});
	}

	return (
		<li className="relative text-slate-700 group py-2 text-lg font-medium flex items-center gap-4 text-left hover:cursor-pointer hover:scale-101 transition-all duration-75 ease-in">
			<AvatarIcon
				avatar={avatar}
				username={username}
				size="lg"
				className={`${
					state?.is_blocked && "opacity-60"
				} aspect-square max-w-20 object-cover rounded-md`}
			/>
			<header className="grow">
				<h3 className="text-xl font-bold">
					<Link
						className="after:absolute after:inset-0"
						href={getLocalizedHref(locale, `/user/${username}`)}
					>
						{first_name + " " + last_name}
					</Link>
					{state?.is_blocked && (
						<span className="ml-2 text-sm uppercase text-slate-600 font-medium font-copy">
							Restricted
						</span>
					)}
				</h3>
				<p className="text-sm text-slate-500">@{username}</p>
			</header>
			<FollowersProvider followers={followers_total}>
				<FollowersCount username={username} dict={dict} />
			</FollowersProvider>
			{isAdmin && (
				<AdminBlockButton
					{...state}
					isPending={isPending}
					action={handleAdminBlock}
				/>
			)}
		</li>
	);
}
