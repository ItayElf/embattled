import { useState } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "../assets/imgs/Logo.svg";
import PrimaryButton from "../components/primaryButton";
import TextField from "../components/textField";

interface Props {
  signIn: boolean;
}

export default function Auth({ signIn }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="bg-primary-50 w-full h-screen flex items-center justify-center">
      <form className="bg-white shadow-md shadow-primary-200 flex flex-col p-6 justify-center space-y-9">
        <div className="flex items-center space-x-4">
          <Logo className="h-28 w-20" />
          <h1 className="h2">Embattled</h1>
        </div>
        {!signIn && (
          <TextField
            type="text"
            label="Name"
            value={name}
            setValue={setName}
            required={!signIn}
          />
        )}
        <TextField
          type="email"
          label="Email"
          value={email}
          setValue={setEmail}
          required
        />
        <TextField
          type="password"
          label="Password"
          value={password}
          setValue={setPassword}
          required
        />
        <PrimaryButton>{signIn ? "Sign In" : "Sign Up"}</PrimaryButton>
        <p className="h5 !mt-[60px]">
          {signIn ? "Don't have an account? " : "Already have an account? "}
          {
            <Link
              to={signIn ? "/signUp" : "/signIn"}
              className="text-primary-900"
            >
              Click Here
            </Link>
          }
        </p>
      </form>
    </div>
  );
}
