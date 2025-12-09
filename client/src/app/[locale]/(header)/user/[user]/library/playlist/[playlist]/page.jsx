// generate static params

export default async function Page({ params }) {
	const { playlist } = await params;

	return (
		<section>
			<p>Playlist page</p>
		</section>
	);
}
