import type { NextPage } from 'next';
import { Menu } from '../components/Menu';
import { AuthButtons } from '../components/AuthButtons';
import { Welcome } from '../components/Welcome';
import { Filters } from '../components/Filters';
import styles from '../styles/Home.module.scss';
import { ArticlesList } from '../components/ArticlesList';
import { MobileHeader } from '../components/MobileHeader';

const HomePage: NextPage = () => {

  return (
    <main className={styles.mainWrapper}>
      <Menu />
      <MobileHeader />
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