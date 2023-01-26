import { useRouter } from "next/router";
import { useState } from "react";

export default function PasswordReset(props: { onSuccess: () => void }) {
  const [ password, setPassword ] = useState("");
  const [ confirmPassword, setConfirmPassword ] = useState("");
  const [ error, setError ] = useState<Error | null>(null);
  const { onSuccess } = props;

  const router = useRouter();

  const handlePasswordReset = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const response = await fetch("/user/password-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, confirmPassword }),
    });

    if (password !== "" && password.length < 8) {
      setError(new Error("Password must be at least 8 characters"));
    }
    if (response.ok) {
      onSuccess();
    } else {
      setError(await response.json());
    }
    const returnTo = router.query.returnTo;

    if (
      returnTo &&
      typeof returnTo === "string" &&
      !returnTo.startsWith("http")
    ) {
      onSuccess();
      await router.push(returnTo);
    } else {
      onSuccess();
      await router.push("/");
    }
  };

  return (
    <div>
      <header>
        <h1>Password reset form</h1>
      </header>
      <main>
        <div>
          <form onSubmit={handlePasswordReset}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <br />
            <br />
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
            {error && <p>{error.message}</p>}
            <br />
            <br />
            <button type="submit" disabled={!password || !confirmPassword}>
              Submit
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
