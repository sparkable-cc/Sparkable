import { useEffect, useState } from "react";
import { ArticleItem } from "../ArticleItem";
import { v4 as uuidv4 } from "uuid";
import { Spiner } from "../Spiner";
import classNames from "classnames";
import styles from "./index.module.scss";
import { useLazyGetArticlesQuery } from "../../store/api";
import { selectSelectedFilters, selectSort } from "../../store/UIslice";
import { useAppSelector, usePrevious } from "../../store/hooks";
import isEqual from "lodash.isequal";
import { ApiTypes, UITypes } from "../../types";
import uniqBy from "lodash.uniqby";

interface Props {
  isPreviewPage?: boolean
}

export const ArticlesList = ({ isPreviewPage }: Props) => {
  const [ articles, setArticles ] = useState<ApiTypes.Model.Link[]>([]);
  const [ total, setTotal ] = useState(0);

  const [ trigger, { isLoading }] = useLazyGetArticlesQuery();
  const selectedFilters = useAppSelector(selectSelectedFilters);
  const sort = useAppSelector(selectSort);

  const previousSelectedFilters = usePrevious(selectedFilters);
  const previousSort: UITypes.Option | undefined = usePrevious(sort);

  const PAGE_SIZE = 6;

  const setQueryParams = (page?: number) => {
    const filters = selectedFilters?.length ? selectedFilters : undefined;
    const sorts = sort.value === "newest-first" ? "-date" : "";

    let queryParams = {
      categories: filters
    };

    if (sorts) {
      queryParams = { ...queryParams, ...{ sort: sorts }};
    }

    if (page) {
      queryParams = { ...queryParams, ...{ page }};
    }

    return queryParams;
  };

  const onGetData = (page?: number) => {
    const queryParams = setQueryParams(page);

    try {
      trigger(queryParams).then(res => {
        if (!res.data) return;

        if (sort.value === "newest-first" && previousSort && isEqual(sort, previousSort)) {

          if (res.data?.total < articles.length) {
            setArticles(res.data?.links);
          } else {
            setArticles(uniqBy([ ...articles, ...res.data?.links ], "id"));
          }

        } else {
          setArticles(res.data?.links);
        }

        setTotal(res.data?.total);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const calculatePageNumber = (total, itemIndex) => {
    return Math.ceil(++itemIndex / total);
  };

  const onLoadMore = () => {
    onGetData(calculatePageNumber(total, PAGE_SIZE) + 1);
  };

  useEffect(() => {
    onGetData();
  }, []);

  useEffect(() => {
    if (!isEqual(selectedFilters, previousSelectedFilters)) {
      onGetData();
    }
    if (previousSort && !isEqual(sort, previousSort)) {
      onGetData();
    }
  }, [ selectedFilters, sort ]);

  return (
    <>
      <section className={classNames(styles.articlesList, { [styles.previewPage]: isPreviewPage })}>
        {articles?.length &&
          articles.map(item => <ArticleItem
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
              onClick={() => onGetData()}
            >
              Reshuffle
            </button> :
            total > articles.length ?
              <button
                disabled={isLoading}
                onClick={onLoadMore}
                className={classNames(styles.loadMoreButton)}
              >
                Load more
              </button> :
              ""
        }
      </div>
    </>
  );
};
