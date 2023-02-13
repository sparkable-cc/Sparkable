import { useEffect } from "react";
import { ArticleItem } from "../ArticleItem";
import { v4 as uuidv4 } from "uuid";
import { Spiner } from "../Spiner"; 
import classNames from "classnames";
import styles from "./index.module.scss";
import { useLazyGetArticlesQuery } from "../../store/api";
import { selectSelectedFilters, selectSort } from "../../store/UIslice";
import { useAppSelector, usePrevious } from "../../store/hooks";
import isEqual from "lodash.isequal";

interface Props {
  isPreviewPage?: boolean
}

export const ArticlesList = ({ isPreviewPage }: Props) => {
  const [ triggerGetArticles, { isLoading, data }] = useLazyGetArticlesQuery();
  const selectedFilters = useAppSelector(selectSelectedFilters);
  const previousSelectedFilters = usePrevious(selectedFilters);
  const sort = useAppSelector(selectSort);
  const previousSort = usePrevious(sort);

  const onGetArticles = () => {
    const params = selectedFilters?.length ? selectedFilters : undefined;
    const sorts = sort.value === "newest-first" ? "-date" : "";

    let data = { 
      categories: params
    }

    if(sorts){
      data = {...data, ...{sort: sorts}}
    }

    triggerGetArticles(data);
  }

  useEffect(() => {
    triggerGetArticles({});
  }, []);

  useEffect(() => {
    if (!isEqual(selectedFilters, previousSelectedFilters)) {
      onGetArticles();
    }
    if(previousSort && !isEqual(sort, previousSort)){
      onGetArticles();
    }
  }, [selectedFilters, sort]);

  return (
    <>
      <section className={classNames(styles.articlesList, { [styles.previewPage]: isPreviewPage })}>
        {data?.links?.length &&
          data.links.map(item => <ArticleItem
            {...item}
            key={uuidv4()}
          />)}
      </section>
      {isLoading && <Spiner wrapperClassName={styles.spinnerWrapper} />}
      <div className={styles.loadMoreWrapper}>
        {
          sort.value === "random" ? 
          <button 
            disabled={isLoading} 
            className={classNames(styles.reshuffleButton)}
            onClick={onGetArticles}
            >
              Reshuffle
            </button> :
          <button className={classNames(styles.loadMoreButton, styles.disable)}>Load more</button>
        }
      </div>
    </>
  );
};
