import BrowseList from "@/components/browse/Browse";
import { getAlbums } from "@/features/spotify/api";
import { Suspense } from "react";
import Image from "next/image";
import { cacheLife } from "next/cache";
import { getLocalizedHref } from "@/lib/utils";
import Breadcrumb from "@/components/navigation/Breadcrumbs";
import Link from "next/link";
import TrackList from "@/components/musicplayer/TrackList";

export default async function Page({ params }) {
	"use cache";
	cacheLife("hours");
	const { id: album_id } = await params;

	const album = await getAlbums(album_id);
	// const albums = await getAlbumsByArtist(id);

	// console.log(albums);
	// const { name, icons } = await getCategories(id);

	// const breadcrumbPath = [{ title: name, id: id }];

	return (
		<>
			<section className="content-layout grid grid-cols-2 gap-12 py-16 text-slate-800">
				<Image
					src={album.images[0]?.url}
					width={album.images[0]?.width}
					height={album.images[0]?.height}
					alt={album.name}
					className="rounded-3xl drop-shadow-xl"
				/>
				<AlbumTracks {...album} />
			</section>
			{/* <Suspense>
				<BrowseList locale={locale} id={id} />
				</Suspense> */}
		</>
	);
}

function AlbumTracks({ id, name, artists, tracks }) {
	const path = [
		{
			title: artists[0].name,
			id: artists[0].id,
			cat: "artist",
		},
		{
			title: name,
			id: id,
			cat: "album",
		},
	];
	return (
		<article>
			<header className="py-6">
				<div className="flex gap-4 items-center">
					<Breadcrumb path={path} />
					{/* <p>
						<span className="opacity-80">{artists[0].name} /</span>{" "}
						{name}
					</p> */}
				</div>
				<h2 className="cursor-default text-4xl font-semibold font-display">
					{name}
				</h2>
			</header>
			<TrackList {...tracks} />
		</article>
	);
}

function Header({ url, width, height, children }) {
	return (
		<header className="flex gap-4 items-center py-8">
			<Image
				src={url}
				width={width}
				height={height}
				alt={children}
				className="w-20 object-cover rounded-lg"
			/>
			<h2 className="text-4xl font-bold font-display text-slate-800">
				{children}
			</h2>
		</header>
	);
}
