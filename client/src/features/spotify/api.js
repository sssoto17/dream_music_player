const { SPOTIFY_API_URL: api } = process.env;
import { getPublicToken } from "@/features/spotify/utils";

export async function getArtists(id) {
	const payload = await getPublicToken();

	return await fetch(`${api}/artists/${id}`, payload).then((res) =>
		res.json()
	);
}

export async function getAlbumsByArtist(id) {
	const payload = await getPublicToken();

	return await fetch(`${api}/artists/${id}/albums`, payload).then((res) =>
		res.json()
	);
}

export async function getAlbums(id) {
	const payload = await getPublicToken();

	return await fetch(`${api}/${id}`, payload).then((res) => res.json());
}

export async function getSearch(query, limit, offset) {
	const payload = await getPublicToken();

	let url = `${api}/search`;
	let type = "type=album,artist,track,playlist";
	let q = [`q=${query}`, type];

	if (limit) {
		q = [...q, `limit=${limit}`];
	}

	if (offset) {
		q = [...q, `offset=${offset}`];
	}

	q = q.join("&");
	url = [url, q].join("?");

	return await fetch(url, payload).then((res) => res.json());
}

export async function getCategories(id, limit, offset) {
	const payload = await getPublicToken();
	let url = `${api}/browse/categories`;
	let q = [];

	if (id) {
		url = [url, id].join("/");

		console.log("test", url + "/playlists");
	}

	// if (locale) {
	// 	q = [...q, `locale=${locale}`];
	// }

	if (limit) {
		q = [...q, `limit=${limit}`];
	}

	if (offset) {
		q = [...q, `offset=${offset}`];
	}

	if (q.length) {
		url = [url, q.join("&")].join("?");
	}

	return await fetch(url, payload).then((res) => res.json());
}
