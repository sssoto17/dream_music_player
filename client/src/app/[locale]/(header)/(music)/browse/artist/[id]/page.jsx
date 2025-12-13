import {
	getAlbumsByArtist,
	getArtists,
	getArtistTopTracks,
} from "@/features/spotify/api";
import Image from "next/image";
import { cacheLife } from "next/cache";
import Breadcrumb from "@/components/navigation/Breadcrumbs";
import ArtistAlbums from "./albums.client";
import TrackList from "@/components/musicplayer/TrackList";
import { PiMicrophoneStageFill } from "react-icons/pi";
import { getAuthLikes } from "@/features/auth/dal";
import { Suspense } from "react";

export default async function Page({ params }) {
	const { id } = await params;

	const albums = await getAlbumsByArtist(id, "album,single", 5);
	const featured = await getAlbumsByArtist(id, "compilation,appears_on", 5);

	return (
		<>
			{/* <main className="scroller *:last:mb-56"> */}
			<Suspense>
				<ArtistProfile artist_id={id} />
				{albums.total && (
					<ArtistAlbums
						artist={id}
						album_type="album,single"
						items={albums.items}
						total={albums.total}
					>
						Albums & singles
					</ArtistAlbums>
				)}
				{featured.total && (
					<ArtistAlbums
						artist={id}
						album_type="compilation,appears_on"
						items={featured.items}
						total={featured.total}
					>
						Also appears on
					</ArtistAlbums>
				)}
				{/* add similar artists */}
			</Suspense>
		</>
	);
}

async function ArtistProfile({ artist_id }) {
	// const likes = await getAuthLikes();

	const { genres, followers, images, name } = await getArtists(artist_id);
	const { tracks } = await getArtistTopTracks(artist_id);

	const followersTotal = new Intl.NumberFormat().format(followers?.total);

	const path = [
		{
			id: artist_id,
			title: name,
			cat: "artist",
		},
	];
	return (
		<section className="col-span-full grid grid-cols-2 gap-x-12 py-8 text-slate-800">
			<header className="col-span-full py-4">
				<Breadcrumb path={path} />
			</header>
			<Image
				src={images[0]?.url}
				width={images[0]?.width}
				height={images[0]?.height}
				alt={name}
				className="rounded-3xl drop-shadow-xl"
			/>
			<article>
				<header className="py-8">
					<h2 className="text-5xl tracking-tight text-fuchsia-900 font-bold font-display cursor-default">
						{name}
					</h2>
					<div className="flex gap-4 items-center uppercase font-semibold tracking-wide text-sm py-2">
						<PiMicrophoneStageFill className="text-amber-800" />
						<ul className="cursor-default">
							{genres.map((genre, id) => {
								return <li key={id}>{genre}</li>;
							})}
						</ul>
					</div>
					{followers?.total && (
						<p className="cursor-default">
							{followersTotal}{" "}
							{followers.total == 1 ? "follower" : "followers"}
						</p>
					)}
				</header>
				<TrackList items={tracks} displayNo={false} />
			</article>
		</section>
	);
}
