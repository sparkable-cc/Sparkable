import styles from "./index.module.scss";
import classNames from "classnames";
import { useMemo, useEffect } from "react";
import { getArticles, getCategories, useLazyGetCategoriesQuery } from "../../store/api";
import { setFilter, selectSelectedFilters } from "../../store/UIslice";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { v4 as uuidv4 } from "uuid";

export const Filters = () => {
  const dispatch = useAppDispatch();
  const [triggerGetCategories] = useLazyGetCategoriesQuery();
  const selectedFilters = useAppSelector(selectSelectedFilters);
  const params = selectedFilters?.length ? selectedFilters : undefined;
  const selectArticles = useMemo(() => getArticles.select({ categories: params }), [
    selectedFilters,
  ]);
  const selectCategories = useMemo(() => getCategories.select(), []);

  const onSetFilter = (event: any) => {
    const param = event?.target?.getAttribute("data-param");
    if (!param) return;

    dispatch(setFilter(param));
  };

  const articles = useAppSelector(selectArticles);
  const categories = useAppSelector(selectCategories);
  const categoriesData = categories?.data?.categories;

  useEffect(() => {
    if (!categoriesData) {
      triggerGetCategories();
    }
  }, []);

  return (
    <aside className={styles.filtersSidebar}>
      <span>{articles?.data?.total || 0} Links</span>
      <section className={classNames(styles.filtersSection, styles.disable)}>
        <h4 className={styles.filtersTitle}>Sort by</h4>
        <button className={classNames(styles.filterButton, styles.disable)}>Random</button>
      </section>
      <section className={styles.filtersSection}>
        <h4 className={styles.filtersTitle}>Filter by category</h4>
        {
          categoriesData && categoriesData?.map(item => (
            <button
              className={classNames(styles.filterButton, {
                [styles.active]: selectedFilters.find(sortItem => sortItem === item.slug)
              })}
              onClick={onSetFilter}
              disabled={articles?.isLoading}
              key={uuidv4()}
              data-param={item.slug}
            >
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
  );
};
