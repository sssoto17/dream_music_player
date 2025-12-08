import BrowseList from "@/components/browse/Browse";
import {
	getAlbumsByArtist,
	getArtists,
	getCategories,
} from "@/features/spotify/api";
import { Suspense } from "react";
import Image from "next/image";
import { cacheLife } from "next/cache";
import { getLocalizedHref } from "@/lib/utils";
import Breadcrumb from "@/components/global/Breadcrumbs";

export default async function Page({ params }) {
	"use cache";
	cacheLife("hours");
	const { locale = "en", artistID } = await params;

	const { genres, followers, id, images, name } = await getArtists(artistID);
	const albums = await getAlbumsByArtist(id);

	// console.log(albums);
	// const { name, icons } = await getCategories(id);

	const breadcrumbPath = [{ title: name, id: id }];

	return (
		<main>
			<section className="grid grid-cols-2 gap-12 py-16 text-slate-800">
				<Image
					src={images[0]?.url}
					width={images[0]?.width}
					height={images[0]?.height}
					alt={name}
					className="rounded-3xl drop-shadow-xl"
				/>
				<article>
					<header>
						{/* <Breadcrumb path={breadcrumbPath} /> */}
						<h2 className="text-4xl font-display font-bold cursor-default">
							{name}
						</h2>
						<ul>
							{genres.map((genre, id) => {
								return <li key={id}>{genre}</li>;
							})}
						</ul>
						<p>{followers?.total}</p>
					</header>
				</article>
				<ul>
					{albums?.items.map((album, id) => {
						return <li key={id}>{album.name}</li>;
					})}
				</ul>

				{/* <Header {...icons[0]}>{name}</Header> */}
			</section>
			{/* <Suspense>
				<BrowseList locale={locale} id={id} />
			</Suspense> */}
		</main>
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
