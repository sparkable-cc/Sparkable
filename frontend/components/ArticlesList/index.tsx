import { useEffect } from 'react';
import { ArticleItem } from '../ArticleItem';
import { useLazyGetLinksQuery } from '../../store/api/articles';
import { v4 as uuidv4 } from 'uuid';
import { Spiner } from '../Spiner';
import { MobileFilters } from '../MobileFilters';
import classNames from 'classnames';
import styles from './index.module.scss';

export const ArticlesList = () => {
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
    <section className={styles.articlesWrapper} id="explore">
      <div className={styles.exploreTitleWrapper}>
        <div className={styles.exploreButton} />
        <h2 className={styles.exploreTitle}>
          <span>Explore</span> what others have submitted</h2>
      </div>
      <MobileFilters />
      <section className={styles.articlesList}>
        {data?.links?.length &&
          data.links.map(item => <ArticleItem
            {...item}
            key={uuidv4()}
          />)}
      </section>
      {isLoading && <Spiner wrapperClassName={styles.spinnerWrapper} />}
      <div className={styles.loadMoreWrapper}>
        <button className={classNames(styles.loadMoreButton, styles.disable)}>Load more</button>
      </div>
    </section>
  )
}