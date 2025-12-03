import { FaUserLarge, FaPencil } from "react-icons/fa6";
import Image from "next/image";

export default function AvatarPicker({
	name,
	value,
	submit,
	remove,
	children,
}) {
	return (
		<label
			htmlFor={name}
			className="group relative grid place-content-center place-items-center text-slate-600 hover:text-slate-400 hover:underline text-xs/tight gap-y-1 text-center col-span-full"
		>
			<AvatarPickerIcon hasPreview={value} />
			{value ? (
				<span className="z-10 cursor-pointer" onClick={remove}>
					Remove
				</span>
			) : (
				children
			)}
			<input
				name={name}
				type="file"
				accept="image/*"
				onChange={submit}
				className="opacity-0 absolute inset-0 hover:cursor-pointer"
			/>
		</label>
	);
}

function AvatarPickerIcon({ hasPreview }) {
	// console.log(hasPreview);
	return (
		<div className="relative *:transition-all *:duration-75">
			{hasPreview && !hasPreview.includes("undefined") ? (
				<Image
					src={hasPreview}
					alt="Preview of user avatar."
					width={56}
					height={56}
					className="aspect-square object-cover rounded-full group-hover:opacity-80"
				/>
			) : (
				<FaUserLarge
					className="text-slate-500 group-hover:text-slate-600 rounded-full bg-slate-200 group-hover:bg-slate-300 aspect-square pt-4"
					size={56}
				/>
			)}
			<FaPencil
				size={18}
				className="not-group-hover:hidden p-1 absolute right-0 bottom-0 text-white bg-slate-700 rounded-full aspect-square"
			/>
		</div>
	);
}
