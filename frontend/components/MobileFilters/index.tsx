import styles from "./index.module.scss";
import classNames from "classnames";
import { useMemo, useState, useEffect, useRef } from "react";
import { getArticles, useLazyGetCategoriesQuery, getCategories } from "../../store/api";
import { setFilter, resetFilter, selectSelectedFilters } from "../../store/UIslice";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { v4 as uuidv4 } from "uuid";
import { CSSTransition } from "react-transition-group";
import { SortsSelect } from "../SortsSelect";
import { useOutsideClick } from '../../utils/useOutsideClick';

/*
TO-DO:

- change calling logic to on "Apply" button click
- add total counter to the desktop view

*/


export const MobileFilters = () => {
  const [isModalOpen, setModalOpen] = useState(!false);
  const nodeRef = useRef(null);
  const dispatch = useAppDispatch();
  const [triggerGetCategories] = useLazyGetCategoriesQuery();
  const selectedFilters = useAppSelector(selectSelectedFilters);
  const params = selectedFilters?.length ? selectedFilters : undefined;
  const selectArticles = useMemo(() => getArticles.select({ categories: params }), [
    selectedFilters,
  ]);
  const selectCategories = useMemo(() => getCategories.select(), []);
  const articles = useAppSelector(selectArticles);
  const categories = useAppSelector(selectCategories);
  const categoriesData = categories?.data?.categories;

  useOutsideClick(nodeRef, () => {
    setModalOpen(false);
  });


  const onSetFilter = (event: any) => {
    const param = event?.target?.getAttribute("data-param");
    if (!param) return;

    dispatch(setFilter(param));
  };

  const onReset = () => {
    setModalOpen(false);
    // dispatch(resetFilter());
  };

  useEffect(() => {
    if (!categoriesData) {
      triggerGetCategories();
    }
  }, []);

  return (
    <>
      <aside className={styles.mobileFiltersWrapper}>
        <div className={styles.buttonsWrapper}>
          <SortsSelect isForcedMobile />
          <button
            onClick={() => setModalOpen(true)}
            className={styles.filterButton}
          >
            Filter
            {
              Boolean(selectedFilters?.length) &&
              <span className={styles.filterCounter}>
                {selectedFilters?.length}
              </span>
            }
          </button>
        </div>
        {/* {
          Boolean(selectedFilters?.length) &&
          <div className={styles.selectedFiltersList}>
            {
              categoriesData?.length && categoriesData.map(item => (
                selectedFilters.find(sortItem => sortItem === item.slug) ? (
                  <button
                    key={uuidv4()}
                    onClick={onSetFilter}
                    className={styles.selectedFilterItem}
                    data-param={item.slug}
                  >
                    {item.name}
                  </button>
                ) : null
              ))
            }
          </div>
        } */}
        <span className={styles.counter}>{articles?.data?.total || 0} Results</span>
      </aside>
      <CSSTransition
        nodeRef={nodeRef} in={isModalOpen} timeout={400} classNames={{
          enterActive: styles.enterActive,
          enterDone: styles.enterDone,
          exitActive: styles.exitActive,
          exitDone: styles.exitDone,
        }}
      >
        <div ref={nodeRef} className={styles.filtersViewport}>
          <header className={styles.filtersHeader}>
            <span
              className={styles.cancelButton}
              onClick={onReset}>
              Cancel
            </span>
            <h3 className={styles.filtersTitle}>Filter</h3>
          </header>
          <section className={styles.filtersListWrapper}>
            <h4 className={styles.filtersSubtitle}>Filter by category</h4>
            <div className={styles.filtersList}>
              {
                categoriesData?.length && categoriesData.map(item => (
                  <div key={uuidv4()}>
                    <button
                      className={classNames(styles.filterItem, {
                        [styles.active]: selectedFilters.find(sortItem => sortItem === item.slug)
                      })}
                      onClick={onSetFilter}
                      data-param={item.slug}
                    >
                      {item.name}
                    </button>
                  </div>
                ))
              }
            </div>
          </section>
          <button className={classNames(styles.applyButton, styles.sizeXl)}>
            Apply
          </button>
        </div>
      </CSSTransition>
    </>
  );
};
