import styles from "./index.module.scss";
import classNames from "classnames";
import { useMemo, useState, useEffect, useRef } from "react";
import { useLazyGetCategoriesQuery, getCategories } from "../../store/api";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { v4 as uuidv4 } from "uuid";
import { CSSTransition } from "react-transition-group";
import { SortsSelect } from "../SortsSelect";
import { useOutsideClick } from '../../utils/useOutsideClick';
import isEqual from "lodash.isequal";
import {
  setFilters,
  selectSelectedFilters,
  selectTotal,
  selectArticles,
} from "../../store/UIslice";

export const MobileFilters = () => {
  const dispatch = useAppDispatch();
  const [triggerGetCategories] = useLazyGetCategoriesQuery();

  const selectedFilters = useAppSelector(selectSelectedFilters);
  const articles = useAppSelector(selectArticles);
  const selectCategories = useMemo(() => getCategories.select(), []);
  const categories = useAppSelector(selectCategories);
  const total = useAppSelector(selectTotal);

  const [isModalOpen, setModalOpen] = useState(!false);
  const [currentFilters, setCurrentFilters] = useState<string[]>(selectedFilters)

  const categoriesData = categories?.data?.categories;
  const nodeRef = useRef(null);

  const onSetCurrentFilter = (event: any) => {
    const param = event?.target?.getAttribute("data-param");
    if (!param) return;

    if (currentFilters?.find(item => item === param)) {
      setCurrentFilters(currentFilters.filter(item => item !== param));
    } else {
      setCurrentFilters([...currentFilters, ...[param]]);
    }
  };

  const onCancel = () => {
    setModalOpen(false);
    setCurrentFilters([]);
  };

  const onApply = () => {
    dispatch(setFilters(currentFilters));
  }

  useOutsideClick(nodeRef, () => {
    onCancel();
  });

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
        <span className={styles.totalCounter}>
          {articles.length} / {total} submissions
        </span>
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
              onClick={onCancel}>
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
                        [styles.active]: currentFilters.find(sortItem => sortItem === item.slug)
                      })}
                      onClick={onSetCurrentFilter}
                      data-param={item.slug}
                    >
                      {item.name}
                    </button>
                  </div>
                ))
              }
            </div>
          </section>
          {
            !isEqual(currentFilters, selectedFilters) &&
            <button className={classNames(styles.applyButton, styles.sizeXl)}
              onClick={onApply}>
              Apply
            </button>
          }
        </div>
      </CSSTransition>
    </>
  );
};
