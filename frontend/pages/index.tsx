import type { NextPage } from 'next';
import { Sidebar } from '../components/Sidebar';
import { AuthButtons } from '../components/AuthButtons';
import { Welcome } from '../components/Welcome';
import styles from '../styles/Home.module.scss';

const HomePage: NextPage = () => {
  return (
    <main className={styles.mainWrapper}>
      <Sidebar />
      <section className={styles.container}>
        <header className={styles.header}>
          <AuthButtons />
        </header>
        <Welcome />
      </section>
    </main>
  )
}

export default HomePage;