const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const regexPassword =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,50}$/;

let min = 2;
let max;

export function validateData(formData) {
	const error = {};

	if (formData.has("username")) {
		error.username = validateUsername(formData.get("username"));
	}

	if (formData.has("email")) {
		error.email = validateEmail(formData.get("email"));
	}

	if (formData.has("first_name") || formData.has("last_name")) {
		error.name = validateFullName(
			formData.get("first_name"),
			formData.get("last_name")
		);
	}

	if (formData.has("password")) {
		error.password = validatePassword(
			formData.get("password"),
			formData.get("confirm_password")
		);
	}

	return error;
}

function validateUsername(str) {
	max = 25;
	return (
		(str.length < min || str.length > max) &&
		`Username must be between ${min} and ${max} characters.`
	);
}
function validateEmail(str) {
	return !regexEmail.test(str) && "Please provide a valid email address.";
}

function validateFullName(first, last) {
	max = 30;
	return (
		((first.length || last.length) < min ||
			(first.length || last.length) > max) &&
		"Please provide your full name."
	);
}

function validatePassword(str, check) {
	let error;

	min = 8;
	max = 20;

	if (!regexPassword.test(password)) {
		error = `Password must be between ${min}-${max} characters, and contain at least one upper- and lowercase character, one special character, and a number.`;
	}

	if (check && str !== check) {
		error.password.confirm = "Please confirm your password.";
	}

	return error;
}
