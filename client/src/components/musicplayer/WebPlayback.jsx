import Image from "next/image";
import { getAlbums } from "../../features/spotify/api";
import PlaybackInterface from "./WebPlayback.client";
// import PlaybackInterface from "./WebPlayback.client";

export default async function WebPlayer({ albumID }) {
	const {
		tracks: { items },
		images,
	} = await getAlbums(albumID);

	return (
		<section className="relative grid">
			<Image
				src={images[0].url}
				alt="Album cover"
				loading="eager"
				width={images[0].width}
				height={images[0].height}
				className="object-cover place-self-center"
			/>
			{/* <PlaybackInterface tracks={items} token="test" /> */}
		</section>
	);
}

export function WebPlayerFooter() {
	return <PlaybackInterface />;
}
