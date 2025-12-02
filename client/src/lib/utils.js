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
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const regexPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,50}$/;

export function validateData({
  username,
  email,
  first_name,
  last_name,
  password,
  passwordConfirm,
}) {
  const error = {};

  if (username.length < 2 || username.length > 25) {
    error.username = "Username must be between 2 and 25 characters.";
  }

  if (!regexEmail.test(email)) {
    error.email = "Please provide a valid email address.";
  }

  if (
    (first_name.length || last_name.length) < 2 ||
    (first_name.length || last_name.length) > 30
  ) {
    error.name = "Please provide your full name.";
  }

  if (!regexPassword.test(password)) {
    error.password =
      "Password must be between 8-20 characters, and contain at least one upper- and lowercase character, one special character, and a number.";
  }

  console.log(passwordConfirm);

  if (password !== passwordConfirm || !passwordConfirm) {
    error.passwordConfirm = "Please confirm your password.";
  }

  return error;
}
