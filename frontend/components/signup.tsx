import { useRouter } from 'next/router';
import React, { useState } from 'react';

type Props = {
  onSuccess: () => void;
};

export default function Signup(props: Props) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<Error>();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch('/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password }),
    });
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
      await props.onSuccess();
      await router.push(returnTo);
    } else {
      await props.onSuccess();
      await router.push('/');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Your email address"
        />
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Your username"
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Your password"
        />
        <button type="submit" disabled={!email || !username || !password}>
          Sign up
        </button>
      </form>
    </div>
  );
}
