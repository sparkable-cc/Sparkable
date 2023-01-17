import type { NextPage } from 'next';
import { Sidebar } from '../components/Sidebar';
import { AuthButtons } from '../components/AuthButtons';
import { Welcome } from '../components/Welcome';
import { Filters } from '../components/Filters';
import styles from '../styles/Home.module.scss';
import { ArticlesList } from '../components/ArticlesList';

const HomePage: NextPage = () => {

  return (
    <main className={styles.mainWrapper}>
      <Sidebar />
      <section className={styles.container}>
        <AuthButtons />
        <Welcome />
        <div className={styles.contentWrapper}>
          <ArticlesList />
          <Filters />
        </div>
      </section>
    </main>
  )
}

export default HomePage;