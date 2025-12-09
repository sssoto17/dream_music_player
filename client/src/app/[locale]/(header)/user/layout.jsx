export default function UserLayout({ children, sidebar, playlist }) {
	return (
		<main>
			<div className="grid grid-cols-3 grid-rows-[auto_1fr] gap-x-6 py-8 content-start">
				{sidebar}
				{playlist}
				<section className="col-start-2 col-span-full">
					{children}
				</section>
			</div>
		</main>
	);
}
