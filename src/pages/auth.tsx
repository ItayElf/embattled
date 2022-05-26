import { FormEvent, useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from "../assets/imgs/Logo.svg";
import PrimaryButton from "../components/primaryButton";
import TextField from "../components/textField";
import { BASE_API } from "../constants";
import globals from "../globals";
import { postFetch } from "../utils/fetchUtils";

interface Props {
  signIn: boolean;
}

export default function Auth({ signIn }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError("");
      if (password.length < 8 && !signIn) {
        setError("Password has to be at least 8 characters.");
        return;
      }
      const payload = { name, password, email };
      try {
        const res = await postFetch(
          BASE_API + `auth/${signIn ? "login" : "register"}`,
          payload
        );
        if (!res.ok) {
          setError(await res.text());
          return;
        } else {
          const json = JSON.parse(await res.text());
          localStorage.setItem("refreshToken", json["refresh_token"]);
          globals.accessToken = json["access_token"];
        }
      } catch (e: any) {
        setError((e + "").replace("Error: ", ""));
        return;
      }
      navigate("/rooms");
    },
    [email, name, password, signIn, navigate]
  );

  return (
    <div className="flex h-screen w-full items-center justify-center bg-primary-50">
      <form
        className="flex flex-col justify-center space-y-9 bg-white p-6 shadow-md shadow-primary-200"
        onSubmit={onSubmit}
      >
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
        {error && <span className="h6 text-primary-900">{error}</span>}
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
