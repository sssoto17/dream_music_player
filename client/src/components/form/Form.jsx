// create separate react hook to handle form submission logic
import NextForm from "next/form";

export default function Form({ action, children }) {
	return (
		<NextForm
			action={action}
			className="grid lg:grid-cols-6 gap-4 items-end"
		>
			{children}
		</NextForm>
	);
}

export function FormInput({
	name,
	value,
	placeholder,
	type,
	error,
	disabled,
	cols,
	children,
	withErrorLabel,
}) {
	// input sizes; can be full (default; col-span-full), half (col-span-3), or third (col-span-2)
	// input state; default, focus, disabled, invalid based on error state

	const stateStyle = {
		valid: "outline-slate-200 hover:outline-slate-300",
		invalid: "outline-rose-300 hover:outline-rose-400",
	};

	const styles = `outline-1 rounded-xs py-1.5 px-2 focus:outline-slate-400 ${
		error ? stateStyle["invalid"] : stateStyle["valid"]
	}`;

	return (
		<div
			className={`grid gap-y-2 font-medium text-slate-800 ${
				cols ? cols : "col-span-full"
			}`}
		>
			<div className="flex flex-wrap gap-4 items-end">
				<label htmlFor={name}>{children}</label>
				{withErrorLabel && (
					<p className="text-rose-500 text-sm font-semibold">
						{error}
					</p>
				)}
			</div>
			<input
				name={name}
				id={name}
				className={styles}
				type={type || "text"}
				defaultValue={value}
				disabled={disabled}
				placeholder={placeholder}
			/>
		</div>
	);
}
export function FormTextArea({
	name,
	value,
	placeholder,
	disabled,
	rows = 4,
	children,
}) {
	return (
		<textarea
			id={name}
			name={name}
			className="font-display text-slate-700 resize-none bg-white w-full outline-1 rounded-sm py-1.5 px-2 focus:outline-amber-400 outline-slate-200 hover:outline-slate-300"
			rows={rows}
			defaultValue={value}
			disabled={disabled}
			placeholder={placeholder || children}
		/>
	);
}
