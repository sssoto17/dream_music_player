import Link from "next/link";

export default function Button({
	href,
	formAction,
	action,
	disabled,
	children,
}) {
	// base button styles

	// button variants
	// button sizes

	const style = {
		variant: {
			primary: "bg-fuchsia-700 hover:bg-fuchsia-600 text-white",
			secondary: "",
			ghost: "",
			danger: "",
		},
		size: {
			sm: "",
			base: "",
			lg: "",
		},
	};

	// add optional icon

	if (href) return <Link href={href}>{children}</Link>;

	if (action)
		return (
			<button onClick={action} disabled={disabled}>
				{children}
			</button>
		);

	if (formAction)
		return (
			<button formAction={action} disabled={disabled}>
				{children}
			</button>
		);

	return (
		<button
			className="px-5 py-3 rounded-md font-display font-semibold tracking-wider cursor-pointer"
			disabled={disabled}
		>
			{children}
		</button>
	);
}
