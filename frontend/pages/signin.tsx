import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<
    {
      message: string;
    }[]
  >([]);
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  async function handleSignin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await fetch(`${baseUrl}/user/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (errors.length > 0) {
      setErrors([]);
    } else if (response.ok) {
      router.push('/');
    } else {
      setErrors(await response.json());
    }

    const returnTo = router.query.returnTo;

    if (
      returnTo &&
      typeof returnTo === 'string' &&
      !returnTo.startsWith('http')
    ) {
      await router.push(returnTo);
    } else {
      await router.push('/');
    }
  }

  return (
    <div>
      <header>
        <h1>Sign in</h1>
      </header>
      <main>
        <div>
          <form onSubmit={handleSignin}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            <br />
            <br />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <br />
            <br />
            <div>
              <Link href="/passwordRecoveryForm">
                <p>Forgot password?</p>
              </Link>
            </div>
            <br />
            <br />
            <button type="submit">Sign in</button>
            {errors.map((error) => (
              <div key={`error-${error.message}`}>{error.message}</div>
            ))}
          </form>
        </div>
        <p>Don't have an account yet?</p>
        <div>
          <Link href="/signup">
            <button>Sign up</button>
          </Link>
        </div>
      </main>
    </div>
  );
}
