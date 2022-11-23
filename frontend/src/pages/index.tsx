import Link from 'next/link';
import React from 'react';

function App() {
  return (
    <div>
      <header>
        <p>Header</p>
      </header>
      <main>
        <h1>Butterfly</h1>
        <p>
          <Link href="/signup">Sign up</Link>
          <br />
          <Link href="/content">Content</Link>
        </p>
      </main>
    </div>
  );
}

export default App;
