const { SPOTIFY_URL, SPOTIFY_ALBUMS } = process.env;
import { getPublicToken } from "@/features/spotify/utils";

export async function getAlbums(id) {
  const payload = await getPublicToken();

  return await fetch(`${SPOTIFY_ALBUMS}/${id}`, payload).then((res) =>
    res.json()
  );
}

export async function getCategories() {
  const payload = await getPublicToken();
  return await fetch(`${SPOTIFY_URL}/browse/categories`, payload).then((res) =>
    res.json()
  );
}
