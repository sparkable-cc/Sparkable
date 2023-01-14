import type { NextPage } from 'next';
import { Sidebar } from '../components/Sidebar';
import { AuthButtons } from '../components/AuthButtons';
import { Welcome } from '../components/Welcome';
import { ArticleItem } from '../components/ArticleItem';
import { Filters } from '../components/Filters';
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
        <div className={styles.contentWrapper}>
          <section className={styles.articlesWrapper}>
            <div className={styles.exploreTitleWrapper}>
              <div className={styles.exploreButton} />
              <h2 className={styles.exploreTitle}>
                <span>Explore</span> what others have submitted</h2>
            </div>
            <section className={styles.articlesList}>
              <ArticleItem />
              <ArticleItem />
              <ArticleItem />
              <ArticleItem />
              <ArticleItem />
            </section>
            <div className={styles.loadMoreWrapper}>
              <button className={styles.loadMoreButton}>Load more</button>
            </div>
          </section>
          <Filters />
        </div>
      </section>
    </main>
  )
}

export default HomePage;