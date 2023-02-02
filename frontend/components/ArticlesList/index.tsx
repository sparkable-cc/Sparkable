import { useEffect } from "react";
import { ArticleItem } from "../ArticleItem";
import { v4 as uuidv4 } from "uuid";
import { Spiner } from "../Spiner";
import classNames from "classnames";
import styles from "./index.module.scss";
import { useLazyGetArticlesQuery } from "../../store/api";
import { selectSelectedFilters } from "../../store/UIslice";
import { useAppSelector, usePrevious } from "../../store/hooks";
import isEqual from "lodash.isequal";

export const ArticlesList = () => {
  const [triggerGetArticles, { isLoading, data }] = useLazyGetArticlesQuery();
  const selectedFilters = useAppSelector(selectSelectedFilters);
  const previousSelectedFilters = usePrevious(selectedFilters);

  useEffect(() => {
    triggerGetArticles({});
  }, []);

  useEffect(() => {
    if (!isEqual(selectedFilters, previousSelectedFilters)) {
      const params = selectedFilters?.length ? selectedFilters : undefined;
      triggerGetArticles({ categories: params });
    }
  }, [selectedFilters]);

  return (
    <>
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
    </>
  );
};
