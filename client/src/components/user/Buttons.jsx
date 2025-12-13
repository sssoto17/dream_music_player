"use client";

import { useAuth } from "@/features/auth/hooks";
import { startTransition, useState } from "react";
import { FaPlus, FaRegHeart, FaHeart } from "react-icons/fa";
import { FollowAction, LikeAction } from "@/features/actions/user_actions";
import { getLocalizedHref } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";

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

export function UserFollowButton({ isFollowing }) {
	const [isActive, setIsActive] = useState(isFollowing);
	const { user } = useParams();

	function handleFollow() {
		const payload = new FormData();
		payload.append("username", user);

		startTransition(() => {
			FollowAction(payload);
		});

		setIsActive(!isActive);
	}

	const stateStyle = isActive
		? "bg-fuchsia-500 hover:bg-fuchsia-600"
		: "bg-fuchsia-700 hover:bg-fuchsia-600";

	return (
		<button
			onClick={handleFollow}
			onMouseEnter={(e) => {
				if (isActive) {
					e.target.textContent = "Unfollow";
				}
			}}
			onMouseLeave={(e) => {
				if (isActive) {
					e.target.textContent = "Following";
				}
			}}
			className={`${stateStyle} text-white my-8 max-w-48 w-full flex place-content-center items-center gap-2 mx-auto rounded-full py-2 px-4 font-semibold font-display cursor-pointer hover:scale-101 transition-all duration-75 ease-in`}
		>
			{isActive ? "Following" : "Follow"}
		</button>
	);
}
