"use client";
import { useState, useActionState } from "react";
import AvatarPicker from "../../_components/AvatarPicker";
import { FaArrowRight } from "react-icons/fa6";
import { SignUp } from "../../actions";

export function SignupForm({ username, email, first_name, last_name }) {
  const [avatar, setAvatar] = useState(null);

  const initState = {
    user: {
      username,
      email,
      first_name,
      last_name,
    },
  };
  const [state, submit, isPending] = useActionState(
    SignUp.bind(null, avatar),
    initState
  );

  function handleAvatar(e) {
    setAvatar(e.target.files[0]);
  }

  return (
    <form action={submit} className="grid grid-cols-6 gap-4 items-end">
      <AvatarPicker name="avatar" value={avatar} submit={handleAvatar}>
        Choose an avatar
      </AvatarPicker>
      <FormInput
        name="username"
        value={state?.user?.username}
        error={state?.error?.username}
        disabled={isPending}
      >
        Username
      </FormInput>
      <FormInput
        name="first_name"
        value={state?.user?.first_name}
        error={state?.error?.name}
        disabled={isPending}
        cols="col-span-3"
      >
        First name
      </FormInput>
      <FormInput
        name="last_name"
        value={state?.user?.last_name}
        error={state?.error?.name}
        disabled={isPending}
        cols="col-span-3"
      >
        Last name
      </FormInput>
      <FormInput
        name="email"
        value={state?.user?.email}
        error={state?.error?.email}
        disabled={isPending}
      >
        Email
      </FormInput>
      <FormInput
        name="password"
        value={state?.user?.password}
        error={state?.error?.password}
        disabled={isPending}
        type="password"
      >
        Password
      </FormInput>
      <FormInput
        name="confirm_password"
        error={state?.error?.password || state?.error?.passwordConfirm}
        disabled={isPending}
        type="password"
      >
        Confirm password
      </FormInput>
      <button
        disabled={isPending}
        className="col-span-full flex gap-4 justify-center items-center mt-8 py-3 px-5 cursor-pointer rounded-md bg-fuchsia-700 hover:bg-fuchsia-600 text-white font-bold uppercase tracking-wider font-display"
      >
        Continue <FaArrowRight size={20} />
      </button>
    </form>
  );
}

function FormInput({ children, name, value, disabled, error, type, cols }) {
  const stateStyle = {
    valid: "outline-slate-200 hover:outline-slate-300",
    invalid: "outline-rose-300 hover:outline-rose-400",
  };

  const styles = `outline-1 rounded-xs py-1.5 px-2 focus:outline-slate-400 ${
    error ? stateStyle["invalid"] : stateStyle["valid"]
  }`;

  return (
    <label
      className={`grid gap-y-2 font-medium text-slate-800 ${
        cols ? cols : "col-span-full"
      }`}
      htmlFor={name}
    >
      {children}
      <input
        name={name}
        id={name}
        className={styles}
        type={type || "text"}
        defaultValue={value}
        disabled={disabled}
      />
    </label>
  );
}
