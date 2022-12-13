import { useRouter } from 'next/router';
import { useState } from 'react';

type Props = {
  onSuccess: () => void;
};

export default function Signup(props: Props) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<Error | null>(null);

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch('http://localhost:5000/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password }),
    });

    if (password !== '' && password.length < 8) {
      setError(new Error('Password must be at least 8 characters'));
    }
    if (response.ok) {
      props.onSuccess();
    } else {
      setError(await response.json());
    }
    const returnTo = router.query.returnTo;

    if (
      returnTo &&
      typeof returnTo === 'string' &&
      !returnTo.startsWith('http')
    ) {
      props.onSuccess();
      await router.push(returnTo);
    } else {
      props.onSuccess();
      await router.push('/');
    }
  };

  return (
    <div>
      <header>
        <h1>Sign up</h1>
      </header>
      <main>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Your email address"
          />
          <br />
          <br />
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Your username"
          />
          <br />
          <br />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Your password"
          />
          {error && <p>{error.message}</p>}
          <br />
          <br />
          <button type="submit" disabled={!email || !username || !password}>
            Sign up
          </button>
        </form>
      </main>
    </div>
  );
}
