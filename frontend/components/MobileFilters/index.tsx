import styles from './index.module.scss';
import classNames from 'classnames';
import React, { useMemo, useState } from 'react';
import { ApiTypes } from '../../types';
import { getLinks } from '../../store/api';
import { setFilter, resetFilter, selectSelectedFilters } from '../../store/UIslice';
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { v4 as uuidv4 } from 'uuid';
import { CSSTransition } from 'react-transition-group';

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

export const MobileFilters = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const selectedFilters = useAppSelector(selectSelectedFilters);
  const params = selectedFilters?.length ? selectedFilters : undefined;
  const selectLinks = useMemo(() => getLinks.select({ categories: params }), [
    selectedFilters,
  ])

  const onSetSort = (event: any) => {
    const param = event?.target?.getAttribute('data-param');
    if (!param) return;

    dispatch(setFilter(param))
  }

  const { data } = useAppSelector(selectLinks);

  const onReset = () => {
    setModalOpen(false);
    dispatch(resetFilter());
  }

  return (
    <>
      <aside className={styles.mobileFiltersWrapper}>
        <div className={styles.buttonsWrapper}>
          <button className={styles.buttonWhite}>
            Newest First
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className={styles.buttonWhite}>
            Filter
          </button>
        </div>
        {
          Boolean(selectedFilters?.length) &&
          <div className={styles.selectedFiltersList}>
            {
              tempData?.length && tempData.map(item => (
                selectedFilters.find(sortItem => sortItem === item.slug) ? (
                  <button
                    key={uuidv4()}
                    onClick={onSetSort}
                    className={styles.selectedFilterItem}
                    data-param={item.slug}>
                    {item.name}
                  </button>
                ) : null
              ))
            }
          </div>
        }
        <span className={styles.counter}>{data?.total || 0} Results</span>
      </aside>
      <CSSTransition in={isModalOpen} timeout={400} classNames={{
        enterActive: styles.enterActive,
        enterDone: styles.enterDone,
        exitActive: styles.exitActive,
        exitDone: styles.exitDone,
      }}>
        <div className={styles.filtersViewport}>
          <header className={styles.filtersHeader}>
            <h3 className={styles.filtersTitle}>Filter</h3>
            <span className={styles.cancelButton} onClick={() => setModalOpen(false)}>Close</span>
          </header>
          <section className={styles.filtersListWrapper}>
            <h4 className={styles.filtersSubtitle}>Filter by category</h4>
            <div className={styles.filtersList}>
              {
                tempData?.length && tempData.map(item => (
                  <button
                    className={classNames(styles.filterItem, {
                      [styles.active]: selectedFilters.find(sortItem => sortItem === item.slug)
                    })}
                    onClick={onSetSort}
                    key={uuidv4()}
                    data-param={item.slug}>
                    {item.name}
                  </button>
                ))
              }
            </div>
          </section>
          <button
            className={classNames(styles.applyButton, styles.sizeXl)}
            onClick={onReset}
          >
            Reset filters
          </button>
        </div>
      </CSSTransition>
    </>
  )
}