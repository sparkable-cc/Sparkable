import { useRouter } from 'next/router';
import React, { useState } from 'react';

export default function PasswordRecovery() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  const handlePasswordRecovery = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const response = await fetch('/user/password-recovery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (email === '') {
      setError(new Error('email is required'));
    } else if (response.ok) {
      router.push('/');
    } else {
      setError(await response.json());
    }
  };

  return (
    <div>
      <header>
        <h1>Password recovery form</h1>
      </header>
      <main>
        <div>
          <form onSubmit={handlePasswordRecovery}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            {error && <p>{error.message}</p>}
            <br />
            <br />
            <button type="submit" disabled={!email}>
              Submit
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
