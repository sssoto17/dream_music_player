// FORMATTING

export function formatDuration(ms) {
	const date = new Date(ms);

	const min = `${date.getMinutes()}`.padStart(2, "0");
	const sec = `${date.getSeconds()}`.padStart(2, "0");
	return `${min}:${sec}`;
}

export function setExpiration(days, hours) {
	const minutes = 60 * 60 * 1000;
	return new Date(Date.now() + days * hours * minutes);
}

export function formatTrackProgress(duration, position) {
	return Math.round((position / duration) * 100);
}

export function getAvatarSrc(path) {
	return `${process.env.SERVER}/${path}`;
}

// GENERATORS

export function genBase64() {
	const credentials = process.env.SPOTIFY_CLIENT_CREDENTIALS;
	const encoded = new Buffer.from(credentials).toString("base64");

	return `Basic ${encoded}`;
}

export function generateRandomString(length) {
	const possible =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const values = crypto.getRandomValues(new Uint8Array(length));
	return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

// VALIDATION

export function isEmpty(obj) {
	const hasKeys = Object.keys(obj);

	return !hasKeys.length;
}
