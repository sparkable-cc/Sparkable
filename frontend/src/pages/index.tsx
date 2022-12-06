import Link from 'next/link';
import React from 'react';

function App() {
  return (
    <div>
      <header>
        <p>Header</p>
      </header>
      <main>
        <h1>Butterfy</h1>
        <p>
          <Link href="/signup">Sign up</Link>
          <br />
          <br />
          <Link href="/signin">Sign in</Link>
          <br />
          <br />
          <Link href="/passwordResetForm">Password reset</Link>
          <br />
          <br />
          <Link href="/passwordRecoveryForm">Password recovery</Link>
        </p>
      </main>
    </div>
  );
}

export default App;
