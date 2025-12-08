"use client";

import { useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";

export default function LikeButton() {
	const [isFavorite, setIsFavorite] = useState(false);

	return (
		<button
			onClick={() => setIsFavorite(!isFavorite)}
			aria-label="Favorite track"
			className={`${
				isFavorite ? "text-fuchsia-900" : "not-group-hover:opacity-0"
			}  px-2 cursor-pointer grid place-content-center transition-all duration-75 ease-in hover:scale-105 hover:text-fuchsia-900`}
		>
			{isFavorite ? <FaHeart /> : <FaRegHeart />}
		</button>
	);
}
