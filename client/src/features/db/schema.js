import { isEmpty } from "@/lib/utils";

const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const regexPassword =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,50}$/;

export function validateData(formData) {
	const error = {};

	if (formData.has("username")) {
		const username = validateUsername(formData.get("username"));

		if (username) {
			error.username = username;
		}
	}

	if (formData.has("email")) {
		const email = validateEmail(formData.get("email"));

		if (email) {
			error.email = email;
		}
	}

	if (formData.has("first_name") || formData.has("last_name")) {
		const name = validateFullName(
			formData.get("first_name"),
			formData.get("last_name")
		);

		if (name) {
			error.name = name;
		}
	}

	if (formData.has("password")) {
		const password = validatePassword(formData.get("password"));

		if (password) {
			error.password = password;
		}
	}

	if (formData.has("confirm_password")) {
		const password = confirmPassword(
			formData.get("password"),
			formData.get("confirm_password")
		);

		if (password && !error.password) {
			error.password = password;
		}
	}

	if (isEmpty(error)) return;

	return error;
}

function validateUsername(str) {
	const min = 2;
	const max = 25;

	if (str.length < min || str.length > max) {
		return `Username must be between ${min} and ${max} characters.`;
	}
}
function validateEmail(str) {
	return !regexEmail.test(str) && "Please provide a valid email address.";
}

function validateFullName(first, last) {
	const min = 2;
	const max = 30;

	console.log(first.length);
	console.log(last.length);
	if (
		first.length < min ||
		last.length < min ||
		first.length > max ||
		last.length > max
	) {
		return "Please provide your full name.";
	}
}

function validatePassword(str) {
	const min = 8;
	const max = 20;

	return (
		(!str || !regexPassword.test(str)) &&
		`Password must be between ${min}-${max} characters, and contain at least one upper- and lowercase character, one special character, and a number.`
	);
}

function confirmPassword(str, check) {
	return str !== check && "Please confirm your password.";
}
