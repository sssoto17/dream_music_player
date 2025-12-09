import { Suspense } from "react";
import Link from "next/link";
// import WebPlayer from "@/components/WebPlayback";
// import TrackList from "@/components/TrackList";
// import { getAlbums } from "@/features/spotify/api";

export default async function page({ params }) {
	const { id } = await params;

	// const test = await fetch(`${process.env.API_BASE_URL}/token`);

	// console.log(test);

	return (
		<Suspense>
			{/* <WebPlayer albumID={id} /> */}
			{/* <DisplayAlbum albumID={id} /> */}
		</Suspense>
	);
}

// async function DisplayAlbum({ albumID }) {
// 	const { name, artists, tracks } = await getAlbums(albumID);

// 	return (
// 		<section className="p-8 bg-amber-50">
// 			<Link href="/api/auth/logout">Sign out</Link>
// 			<header className="py-6">
// 				<div>
// 					<Link href="/">Go back</Link>
// 					<p>
// 						<span className="opacity-80">{artists[0].name} /</span>{" "}
// 						{name}
// 					</p>
// 				</div>
// 				<h2 className="text-4xl font-semibold font-display">{name}</h2>
// 			</header>
// 			<TrackList {...tracks} />
// 		</section>
// 	);
// }
