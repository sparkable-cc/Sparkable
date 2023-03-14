import classNames from 'classnames';
import isEqual from 'lodash.isequal';
import uniqBy from 'lodash.uniqby';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { MobileSubmitLink } from '../../components/MobileSubmitLink';
import { useLazyGetArticlesQuery } from '../../store/api/articlesApi';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  selectArticles,
  selectSelectedFilters,
  selectSort,
  selectTotal,
  setArticles,
  setTotal,
} from '../../store/UIslice';
import { UITypes } from '../../types';
import { usePrevious } from '../../utils/usePrevious';
import { ArticleItem } from '../ArticleItem';
import { Spiner } from '../Spiner';
import styles from './index.module.scss';

interface Props {
  isPreviewPage?: boolean;
}

export const ArticlesList = ({ isPreviewPage }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useAppDispatch();
  const [trigger, { isLoading }] = useLazyGetArticlesQuery();
  const selectedFilters = useAppSelector(selectSelectedFilters);
  const sort = useAppSelector(selectSort);
  const total = useAppSelector(selectTotal);
  const articles = useAppSelector(selectArticles);
  const previousSelectedFilters = usePrevious(selectedFilters);
  const previousSort: UITypes.Option | undefined = usePrevious(sort);
  const PAGE_SIZE = 6;

  const setQueryParams = (page?: number) => {
    const filters = selectedFilters?.length ? selectedFilters : undefined;
    const sorts = sort.value === 'newest-first' ? '-date' : '';

    let queryParams = {
      categories: filters,
    };

    if (sorts) {
      queryParams = { ...queryParams, ...{ sort: sorts } };
    }

    if (page) {
      queryParams = { ...queryParams, ...{ page } };
    }

    return queryParams;
  };

  const onGetData = (page?: number) => {
    const queryParams = setQueryParams(page);

    try {
      trigger(queryParams).then((res) => {
        if (!res.data) return;

        if (
          sort.value === 'newest-first' &&
          previousSort &&
          isEqual(sort, previousSort)
        ) {
          if (res.data?.total < articles.length) {
            dispatch(setArticles(res.data?.links));
          } else {
            dispatch(
              setArticles(uniqBy([...articles, ...res.data?.links], 'id')),
            );
          }
        } else {
          dispatch(setArticles(res.data?.links));
        }

        dispatch(setTotal(res.data?.total));
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onLoadMore = () => {
    const nextPage = currentPage + 1;
    onGetData(nextPage);
    setCurrentPage(nextPage);
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
  }, [selectedFilters, sort]);

  return (
    <>
      <section
        className={classNames(styles.articlesList, {
          [styles.previewPage]: isPreviewPage,
        })}
      >
        {Boolean(articles?.length) &&
          articles.map((item) => <ArticleItem {...item} key={uuidv4()} />)}
      </section>
      {isLoading && <Spiner wrapperClassName={styles.spinnerWrapper} />}
      {Boolean(articles?.length) && (
        <div className={styles.loadMoreWrapper}>
          {sort.value === 'random' ? (
            <button
              disabled={isLoading}
              className={classNames(styles.reshuffleButton)}
              onClick={() => onGetData()}
            >
              Reshuffle
            </button>
          ) : total > articles.length ? (
            <button
              disabled={isLoading}
              onClick={onLoadMore}
              className={classNames(styles.loadMoreButton)}
            >
              Load more
            </button>
          ) : (
            ''
          )}
        </div>
      )}
      <MobileSubmitLink />
    </>
  );
};
