import styles from './index.module.scss';
import classNames from 'classnames';
import React, { useMemo } from 'react';
import { ApiTypes } from '../../types';
import { getLinks, api } from '../../store/api';
import { setFilters, selectSelectedFilters } from '../../store/UIslice';
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { v4 as uuidv4 } from 'uuid';

// TO-DO: fetch real filters data
const tempData: ApiTypes.Model.Filter[] = [
  {
    name: "Art & Culture",
    slug: "Art+&+Culture"
  },
  {
    name: "Business & Economy",
    slug: "Business+&+Economy"
  },
  {
    name: "Environment",
    slug: "Environment"
  },
  {
    name: "Technology",
    slug: "Technology"
  },
];

export const Filters = () => {
  const dispatch = useAppDispatch();
  const selectedFilters = useAppSelector(selectSelectedFilters);
  const params = selectedFilters?.length ? selectedFilters : undefined;
  const selectLinks = useMemo(() => getLinks.select({ categories: params }), [
    selectedFilters,
  ])

  const onSetSort = (event: any) => {
    const param = event?.target?.getAttribute('data-param');
    if (!param) return;

    dispatch(setFilters(param))
  }

  const { data, isLoading } = useAppSelector(selectLinks)

  return (
    <aside className={styles.filtersSidebar}>
      <span>{data?.total || 0} Links</span>
      <section className={styles.filtersSection}>
        <h4 className={styles.filtersTitle}>Sort by</h4>
        <button className={styles.filterButton}>Random</button>
      </section>
      <section className={styles.filtersSection}>
        <h4 className={styles.filtersTitle}>Filter by category</h4>
        {
          tempData?.length && tempData.map(item => (
            <button
              className={classNames(styles.filterButton, {
                [styles.active]: selectedFilters.find(sortItem => sortItem === item.slug)
              })}
              onClick={onSetSort}
              disabled={isLoading}
              key={uuidv4()}
              data-param={item.slug}>
              {item.name}
            </button>
          ))
        }
      </section>
      <div className={styles.textWrapper}>
        <p className={styles.text}>
          What is the most insightful piece of content you have encountered recently?
        </p>
        <button className={classNames(styles.buttonPrimary, styles.sizeXl, styles.disable)}>Submit a link</button>
      </div>
    </aside>
  )
}