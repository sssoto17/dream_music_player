"use client";

import Image from "next/image";
import Link from "next/link";
import { SearchBar } from "./Search";
import { useActionState } from "react";
import { SearchAction } from "@/features/actions/user_actions";
import { formatDuration } from "@/lib/utils";

export default function Browse({ className: styles }) {
	const [state, submit, isPending] = useActionState(SearchAction);

	return (
		<section className={`py-8 col-span-full ${styles}`}>
			<header>
				<SearchBar
					action={submit}
					value={state?.q}
					isPending={isPending}
				/>
			</header>
			{!state || state?.error ? (
				<p>{state?.error}</p>
			) : (
				<>
					<BrowseScroller
						loading={isPending}
						items={state?.result?.artists}
					/>
					<BrowseList
						loading={isPending}
						items={state?.result?.other}
					/>
				</>
			)}
		</section>
	);
}

function BrowseScroller({ items, loading }) {
	return (
		<article
			className={`relative transition-transform ease-in duration-75 ${
				loading && "animate-pulse opacity-70"
			}`}
		>
			<ul className="scroll-smooth snap-x *:snap-start flex gap-4 my-8 py-1 scroller scroller-hidden overflow-x-scroll w-full relative">
				{items.map((item) => {
					return <ArtistItem key={item.id} {...item} />;
				})}
			</ul>
			<div className="absolute rounded-2xl inset-0 bg-linear-to-l from-white via-white/0 to-25% pointer-events-none" />
		</article>
	);
}

function BrowseList({ items, loading }) {
	return (
		<ul
			className={`py-8 max-h-180 overflow-y-scroll scroller transition-all ease-in duration-75 ${
				loading && "animate-pulse opacity-70"
			}`}
		>
			{items.map((item) => {
				if (item.type == "album")
					return <AlbumItem key={item.id} {...item} />;
				if (item.type == "track")
					return <TrackItem key={item.id} {...item} />;
			})}
		</ul>
	);
}

function ArtistItem({ id, name, images, followers }) {
	const link = `/browse/artist/${id}`;
	return (
		<li className="shrink-0 relative group flex items-center gap-6 p-2 rounded-lg text-slate-800 hover:bg-white/80">
			{images.length ? (
				<Image
					src={images[2].url}
					alt={name}
					width={images[2].width}
					height={images[2].height}
					className="rounded-full w-24 aspect-square object-cover"
				/>
			) : (
				<PlaceholderImg />
			)}
			<header className="grow">
				<h3 className="text-lg font-semibold font-display">
					<Link href={link} className="after:absolute after:inset-0">
						{name}
					</Link>
				</h3>
				<p className="text-slate-400 group-hover:text-slate-600">
					{followers.total == 1
						? followers.total + " follower"
						: !followers.total
						? "No followers"
						: followers.total + " followers"}
				</p>
			</header>
		</li>
	);
}

function AlbumItem({ id, artists, images, name, release_date }) {
	const { url, height, width } = images[2];

	const artistName = artists.map((artist) => artist.name).join(", ");
	const link = `/browse/album/${id}`;
	const releaseYear = new Date(release_date).getFullYear();

	return (
		<li className="relative flex items-center gap-6 p-2 rounded-lg text-slate-800 hover:bg-slate-50">
			<Image
				src={url}
				alt={name}
				width={width}
				height={height}
				className="rounded-md"
			/>
			<header className="grow">
				<h3 className="text-lg font-semibold font-display">
					<Link href={link} className="after:absolute after:inset-0">
						{name}
					</Link>
				</h3>
				<p className="text-slate-700">{artistName}</p>
			</header>
			<p>{releaseYear}</p>
		</li>
	);
}

function TrackItem({ album, artists, duration_ms, name: trackTitle }) {
	const { name: albumTitle, images, id } = album;
	const { url, height, width } = images[2];

	const artistName = artists.map((artist) => artist.name).join(", ");
	const link = `/browse/album/${id}`;

	return (
		<li className="relative group flex items-center gap-6 p-2 rounded-lg text-slate-800 hover:bg-slate-50">
			<Image
				src={url}
				alt={albumTitle}
				width={width}
				height={height}
				className="rounded-md w-16 aspect-square object-cover"
			/>
			<header className="grow">
				<h3 className="text-lg font-semibold font-display">
					<Link href={link} className="after:absolute after:inset-0">
						{trackTitle}
					</Link>
				</h3>
				<p className="text-slate-500 group-hover:text-slate-600">
					{artistName}
				</p>
			</header>
			<p>{formatDuration(duration_ms)}</p>
			{/* {trackTitle} */}
			{/* <li className="relative group flex items-center gap-6 p-2 rounded-lg text-slate-800 hover:bg-slate-50">
			</li> */}
		</li>
	);
}

function PlaceholderImg() {
	return (
		<div className="rounded-md w-16 aspect-square bg-linear-to-b from-amber-300 to-fuchsia-500 grid content-center p-1">
			<p className="uppercase font-bold text-sm/tight text-white text-center">
				Missing image
			</p>
		</div>
	);
}
