import { MdCheckCircleOutline } from "react-icons/md";
import { IoMdCloseCircleOutline, IoMdClose } from "react-icons/io";

export default function Toast({
	title,
	error,
	y = "bottom",
	x = "right",
	close,
	children,
}) {
	const position = {
		top: "top-8",
		bottom: "bottom-16",
		left: "left-8",
		right: "right-8",
	};

	return (
		<div
			className={`fixed w-full max-w-md z-90 ${position[y]} ${position[x]}`}
		>
			<article
				className={`bg-white cursor-default rounded-xl drop-shadow-md grid grid-cols-[auto_1fr] gap-4 grid-rows-2 p-4`}
			>
				{error ? (
					<IoMdCloseCircleOutline
						size={32}
						className="text-rose-600"
					/>
				) : (
					<MdCheckCircleOutline
						size={32}
						className="text-amber-600"
					/>
				)}
				<header className="text-xl font-semibold flex gap-4 items-center border-b border-slate-100">
					<h2 className="grow">{title}</h2>
					<button
						onClick={() => close(false)}
						className="font-bold self-start cursor-pointer transition-all duration-75 ease-in bg-white hover:drop-shadow-md p-1 rounded-md"
					>
						<IoMdClose />
					</button>
				</header>
				<p className="col-start-2">{children}</p>
			</article>
		</div>
	);
}
