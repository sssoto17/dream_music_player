"use client";
import Image from "next/image";
import { startTransition, useActionState } from "react";
import { PaginateAction } from "../../../../../../../features/actions/user_actions";
import Link from "next/link";
import { getLocalizedHref } from "@/lib/utils";
import { useParams } from "next/navigation";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

export default function ArtistAlbums({
	artist,
	album_type,
	items,
	total,
	children,
}) {
	const [state, navigate, isPending] = useActionState(PaginateAction, {
		artistID: artist,
		type: album_type,
		albums: items,
		range: 5,
	});

	function handleNavigate(e) {
		if (e.target.id == "back") {
			startTransition(() => navigate(true));
		}

		if (e.target.id == "next") {
			startTransition(() => {
				navigate();
			});
		}
	}

	const hasMoreEntries = Number(state?.range + 5) >= total;
	const hasPrevEntries = Number(state?.range - 5) < 0;

	return (
		<section className="col-span-full mb-24">
			<header className="py-4 flex gap-8">
				<h3 className="text-3xl font-bold font-display grow cursor-default">
					{children}
				</h3>
				<nav className="text-slate-700 flex px-8 text-4xl *:p-4 *:not-disabled:cursor-pointer *:disabled:text-slate-400 *:not-disabled:hover:text-amber-800 *:not-disabled:hover:scale-110 transition-all duration-75 ease-in">
					<button
						disabled={hasPrevEntries || isPending}
						aria-label="Back"
						onClick={handleNavigate}
					>
						<IoIosArrowBack id="back" />
					</button>
					<button
						disabled={hasMoreEntries || isPending}
						aria-label="Next"
						onClick={handleNavigate}
					>
						<IoIosArrowForward id="next" />
					</button>
				</nav>
			</header>
			<ul className="h-56 grid grid-cols-5 content-start overflow-visible gap-8 col-span-full">
				{isPending ? (
					<Placeholder />
				) : (
					state?.albums?.map((album) => {
						return <AlbumTile key={album.id} {...album} />;
					})
				)}
			</ul>
		</section>
	);
}
function AlbumTile({ name, images, id }) {
	const { locale } = useParams();
	const { url, width, height } = images[1];
	return (
		<li className="group shrink-0 max-w-56 hover:scale-105 transition-all duration-75 ease-in">
			<Link href={getLocalizedHref(locale, `/browse/album/${id}`)}>
				<Image
					src={url}
					alt={name}
					width={width}
					height={height}
					className="rounded-4xl object-cover aspect-square"
				/>
				<h4 className="not-group-hover:text-slate-600 font-display p-2 text-center not-group-hover:truncate text-sm/tight font-semibold">
					{name}
				</h4>
			</Link>
		</li>
	);
}

function Placeholder() {
	return (
		<>
			<div className="shrink-0 max-w-56">
				<div className="rounded-4xl aspect-square bg-fuchsia-800/10 animate-pulse" />
				<div className="opacity-0 font-display p-2 text-center text-sm/tight font-semibold">
					Loading...
				</div>
			</div>
			<div className="rounded-4xl aspect-square bg-fuchsia-800/10 animate-pulse" />
			<div className="rounded-4xl aspect-square bg-fuchsia-800/10 animate-pulse" />
			<div className="rounded-4xl aspect-square bg-fuchsia-800/10 animate-pulse" />
			<div className="rounded-4xl aspect-square bg-fuchsia-800/10 animate-pulse" />
		</>
	);
}
