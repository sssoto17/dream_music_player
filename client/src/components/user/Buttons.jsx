"use client";

import useAuth from "@/features/hooks/useAuth";
import { startTransition, useActionState, useState } from "react";
import { FaPlus, FaRegHeart, FaHeart } from "react-icons/fa";
import { LikeAction, FollowAction } from "@/features/actions/user_actions";
import { getLocalizedHref } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { useFollowersContext } from "./DynamicFollowers";

export default function LikeButton({ trackId, isLiked }) {
	const { isAuth } = useAuth();

	if (!isAuth) return;

	function handleLike() {
		const payload = new FormData();
		payload.append("track_id", trackId);

		startTransition(() => LikeAction(payload));
	}

	return (
		<button
			onClick={handleLike}
			aria-label="Favorite track"
			className={`${
				isLiked ? "text-fuchsia-900" : "not-group-hover:opacity-0"
			}  px-2 cursor-pointer grid place-content-center transition-all duration-75 ease-in hover:scale-105 hover:text-fuchsia-900`}
		>
			{isLiked ? <FaHeart /> : <FaRegHeart />}
		</button>
	);
}

export function CreatePlaylistButton() {
	const router = useRouter();
	const { locale } = useParams();
	const { user, isLoading } = useAuth();

	return (
		<button
			disabled={isLoading}
			onClick={() =>
				router.push(
					getLocalizedHref(
						locale,
						`/user/${user?.username}/library/playlist/create`
					)
				)
			}
			className="flex disabled:bg-slate-300 items-center gap-2 mx-auto place-content-center bg-fuchsia-700 hover:bg-fuchsia-600 w-full max-w-64 rounded-full py-2 px-4 font-semibold font-display not-disabled:cursor-pointer hover:scale-101 transition-all duration-75 ease-in text-white"
		>
			<FaPlus /> Create playlist
		</button>
	);
}

export function UserFollowButton({ dict }) {
	const { user } = useParams();
	const isActive = useFollowersContext((s) => s.isFollowing);
	const toggleFollow = useFollowersContext((s) => s.toggleFollow);

	function handleFollow() {
		const payload = new FormData();
		payload.append("username", user);

		startTransition(() => {
			FollowAction(payload);
		});

		toggleFollow();
	}

	const stateStyle = isActive
		? "bg-fuchsia-500 hover:bg-fuchsia-600"
		: "bg-fuchsia-700 hover:bg-fuchsia-600";

	return (
		<button
			onClick={handleFollow}
			onMouseEnter={(e) => {
				if (isActive) {
					e.target.textContent = dict["unfollow"];
				}
			}}
			onMouseLeave={(e) => {
				if (isActive) {
					e.target.textContent = dict["following"];
				}
			}}
			className={`${stateStyle} text-white my-8 max-w-48 w-full flex place-content-center items-center gap-2 mx-auto rounded-full py-2 px-4 font-semibold font-display cursor-pointer hover:scale-101 transition-all duration-75 ease-in`}
		>
			{isActive ? dict["following"] : dict["follow"]}
		</button>
	);
}

import { GrLanguage } from "react-icons/gr";
import { ImSpinner2 } from "react-icons/im";
import { ImportLanguages } from "@/features/actions/admin_actions";
import Toast from "../global/Toast";

export function AdminLanguageButton({ dict, children }) {
	const [state, submit, isPending] = useActionState(ImportLanguages);
	const [toastActive, setToastActive] = useState(false);

	function handleLanguages() {
		startTransition(() => {
			submit();
		});

		setToastActive(true);
	}

	return (
		<>
			<button
				onClick={handleLanguages}
				disabled={isPending}
				className={`group bg-slate-700 hover:bg-slate-600 disabled:bg-slate-300 text-white max-w-48 w-full flex place-content-center items-center gap-2 rounded-full py-1 px-2 font-semibold font-display text-sm cursor-pointer transition-all duration-75 ease-in`}
			>
				<GrLanguage className="group-disabled:hidden" />
				<ImSpinner2 className="not-group-disabled:hidden animate-spin" />
				{children}
			</button>
			{!isPending && toastActive && (
				<Toast
					title={dict[state?.title]}
					error={Boolean(!state?.success)}
					close={setToastActive}
				>
					{dict[state?.message]}
				</Toast>
			)}
		</>
	);
}
