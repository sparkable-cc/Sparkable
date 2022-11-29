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
        </p>
      </main>
    </div>
  );
}

export default App;
