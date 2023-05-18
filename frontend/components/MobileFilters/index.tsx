import styles from "./index.module.scss";
import classNames from "classnames";
import { useMemo, useState, useEffect, useRef } from "react";
import { useLazyGetCategoriesQuery, getCategories } from "../../store/api/articlesApi";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { v4 as uuidv4 } from "uuid";
import { CSSTransition } from "react-transition-group";
import { SortsSelect } from "../SortsSelect";
import { useOutsideClick } from "../../utils/useOutsideClick";
import isEqual from "lodash.isequal";
import { ModalNote } from "../ModalNote";
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

  const [isModalOpen, setModalOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState(selectedFilters);

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
    setCurrentFilters(selectedFilters);
  };

  const onApply = () => {
    dispatch(setFilters(currentFilters));
    onCancel();
  };

  useOutsideClick(nodeRef, () => {
    onCancel();
  });

  useEffect(() => {
    if (!categoriesData) {
      triggerGetCategories();
    }
    if (isModalOpen) {
      setCurrentFilters(selectedFilters);
    }
  }, [isModalOpen, categoriesData]);

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
              onClick={onCancel}
            >
              Cancel
            </span>
            <h3 className={styles.filtersTitle}>Filter</h3>
          </header>
          <section className={styles.filtersListWrapper}>
            <div className={styles.filtersSubtitleWrapper}>
              <h4 className={styles.filtersSubtitle}>Filter by category</h4>
            </div>
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
            {
              !isEqual(currentFilters, selectedFilters) &&
              <button
                className={classNames(styles.applyButton, styles.sizeXl)}
                onClick={onApply}
              >
                Apply
              </button>
            }
          </section>
          <section className={styles.filtersListWrapper}>
            <div className={styles.filtersSubtitleWrapper}>
              <h4 className={styles.filtersSubtitle}>Filter by stage</h4>
              <ModalNote title="Filter by stage">
                <div className={styles.modalText}>In stage 1, you can explore all the submissions.</div>
                <div className={styles.modalText}>In stage 2, you can explore  submissions which received votes.</div>
                <div className={styles.modalText}>To explore stage 2, participate in an upcoming voting round.</div>
                <div className={styles.modalTextLink}>Learn more</div>
                <div className={styles.modalImgWrapper}>
                  <img src="svg/filter-tooltip.svg" alt="icon" />
                </div>
              </ModalNote>
            </div>
            <div className={styles.filtersList}>
              <div className={styles.filterButtonWrapper}>
                <button
                  className={classNames(styles.filterStageItem, {
                    [styles.active]: true
                  })}
                  // onClick={onSetCurrentFilter}
                  // data-param={item.slug}
                  // disabled={articles?.isLoading}
                  key={uuidv4()}
                >
                  Stage 1
                </button>
                <span className={styles.filterButtonNote}>Explore all submissions</span>
              </div>
              <div className={styles.filterButtonWrapper}>
                <button
                  className={classNames(styles.filterStageItem, {
                    [styles.disabled]: true
                  })}
                  // onClick={onSetCurrentFilter}
                  // data-param={item.slug}
                  // disabled={articles?.isLoading}
                  key={uuidv4()}
                >
                  Stage 2
                </button>
                <span className={styles.filterButtonNote}>Explore submissions which received votes</span>
              </div>
            </div>
            {/* {
              !isEqual(currentFilters, selectedFilters) &&
              <button
                className={classNames(styles.applyButton, styles.sizeXl)}
                onClick={onApply}
              >
                Apply
              </button>
            } */}
          </section>

        </div>
      </CSSTransition>
    </>
  );
};
