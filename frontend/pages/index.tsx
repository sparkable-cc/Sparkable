import { useEffect } from 'react';
import type { NextPage } from 'next';
import { Sidebar } from '../components/Sidebar';
import { AuthButtons } from '../components/AuthButtons';
import { Welcome } from '../components/Welcome';
import { ArticleItem } from '../components/ArticleItem';
import { Filters } from '../components/Filters';
import styles from '../styles/Home.module.scss';
import { useLazyGetLinksQuery } from '../store/api/articles';
import { v4 as uuidv4 } from 'uuid';
import { Spiner } from '../components/Spiner';
import classNames from 'classnames';

const HomePage: NextPage = () => {
  const [triggerGetLinks, { isLoading, data }] = useLazyGetLinksQuery();

  const onGetArticles = () => {
    triggerGetLinks();
  };

  useEffect(() => {
    if (!data) {
      onGetArticles();
    }
  }, [data]);

  return (
    <main className={styles.mainWrapper}>
      <Sidebar />
      <section className={styles.container}>
        <AuthButtons />
        <Welcome />
        <div className={styles.contentWrapper}>
          <section className={styles.articlesWrapper} id="explore">
            <div className={styles.exploreTitleWrapper}>
              <div className={styles.exploreButton} />
              <h2 className={styles.exploreTitle}>
                <span>Explore</span> what others have submitted</h2>
            </div>
            <section className={styles.articlesList}>
              {data?.links?.length &&
                data.links.map(item => <ArticleItem
                  {...item}
                  key={uuidv4()}
                />)}
            </section>
            {isLoading && <Spiner wrapperClassName={styles.spinnerWrapper}/>}
            <div className={styles.loadMoreWrapper}>
              <button className={classNames(styles.loadMoreButton, styles.disable)}>Load more</button>
            </div>
          </section>
          <Filters />
        </div>
      </section>
    </main>
  )
}

export default HomePage;