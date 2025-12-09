import Image from "next/image";
import { FaUserLarge } from "react-icons/fa6";

const sizes = {
	sm: "w-8",
	default: "w-12",
	lg: "w-24",
	full: "w-full min-w-40 max-w-60 aspect-2/3",
};

export function Avatar({ avatar, username, size = "full", className: styles }) {
	return (
		<Image
			src={avatar}
			alt={username}
			width={480}
			height={480}
			className={`${sizes[size]} ${styles} object-cover rounded-2xl drop-shadow-lg`}
		/>
	);
}

export function AvatarPlaceholder({ size = "full", className: styles }) {
	return (
		<div
			className={`${sizes[size]} ${styles} grid items-end content-end justify-center overflow-clip drop-shadow-lg bg-linear-to-br from-fuchsia-300 to-amber-300 rounded-2xl`}
		>
			<FaUserLarge
				className="text-slate-100 w-full scale-120 translate-y-4"
				size={220}
			/>
		</div>
	);
}

export function AvatarIcon({ avatar, username, size }) {
	if (!avatar) return <AvatarPlaceholder />;

	return (
		<Image
			src={avatar}
			alt={username}
			width={120}
			height={120}
			className={`${sizes[size]} aspect-square object-cover rounded-full drop-shadow-2xl transition-all duration-75 ease-in group-hover:outline-4 outline-amber-100 group-hover:scale-105 group-hover:drop-shadow-4xl`}
		/>
	);
}

export function AvatarIconPlaceholder() {
	return (
		<FaUserLarge
			className="text-slate-500 cursor-pointer group-hover:text-slate-600 rounded-full bg-slate-200 hover:bg-slate-300 aspect-square pt-4"
			size={56}
		/>
	);
}

export function AvatarFallback({ size = "default" }) {
	return (
		<div
			className={`w-full ${sizes[size]} aspect-square rounded-full drop-shadow-md bg-linear-to-b from-amber-50 to-fuchsia-200 animate-pulse`}
		>
			<span className="opacity-0">Loading...</span>
		</div>
	);
}
