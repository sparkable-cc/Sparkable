import { useMemo, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { StageButton } from "../StageButton";
import {
  getArticles,
  getCategories,
  useLazyGetCategoriesQuery,
} from "../../store/api/articlesApi";
import {
  setFilters,
  setVotingStage,
  selectSelectedFilters,
  selectSelectedVotingStage,
} from "../../store/UIslice";
import isEqual from "lodash.isequal";
import { ModalNote } from "../ModalNote";
import styles from "./index.module.scss";
import classNames from "classnames";
import { v4 as uuidv4 } from "uuid";

export const Filters = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const selectedFilters = useAppSelector(selectSelectedFilters);
  const selectedVotingStage = useAppSelector(selectSelectedVotingStage);
  const params = selectedFilters?.length ? selectedFilters : undefined;
  const selectCategories = useMemo(() => getCategories.select(), []);
  const selectArticles = useMemo(() => getArticles.select({ categories: params }), [
    selectedFilters,
  ]);
  const articles = useAppSelector(selectArticles);
  const categories = useAppSelector(selectCategories);
  const categoriesData = categories?.data?.categories;
  const [ currentFilters, setCurrentFilters ] = useState<string[]>(selectedFilters);
  const [ currentVotingStage, setCurrentVotingStage ] = useState<number | undefined>(selectedVotingStage);
  const [triggerGetCategories] = useLazyGetCategoriesQuery();

  const onSetCurrentFilter = (event: any) => {
    const param = event?.target?.getAttribute("data-param");
    if (!param) return;

    if (currentFilters?.find(item => item === param)) {
      setCurrentFilters(currentFilters.filter(item => item !== param));
    } else {
      setCurrentFilters([ ...currentFilters, ...[param] ]);
    }
  };

  const onSetCurrentStage = (value: number) => {
    if (!value) return;

    if (currentVotingStage === value) {
      setCurrentVotingStage(undefined);
    } else {
      setCurrentVotingStage(value);
    }
  };

  const onApply = () => {
    dispatch(setFilters(currentFilters));
    dispatch(setVotingStage(currentVotingStage));
  };

  const checkApplyButton = () => {
    if (!isEqual(currentFilters, selectedFilters)) {
      return true;
    }
    if (!isEqual(currentVotingStage, selectedVotingStage)) {
      return true;
    }
  };

  useEffect(() => {
    if (!categoriesData) {
      triggerGetCategories();
    }
  }, []);

  return (
    <aside className={styles.filtersSidebar}>
      <section className={styles.filtersSection}>
        <h4 className={styles.filtersTitle}>Filter by category</h4>
        {
          categoriesData && categoriesData?.map(item => (
            <button
              className={classNames(styles.filterButton, {
                [styles.active]: currentFilters.find(sortItem => sortItem === item.slug)
              })}
              onClick={onSetCurrentFilter}
              disabled={articles?.isLoading}
              key={uuidv4()}
              data-param={item.slug}
            >
              {item.name}
            </button>
          ))
        }
      </section>
      <section className={styles.filtersSection}>
        <div className={styles.filtersTitleWrapper}>
          <h4 className={styles.filtersTitle}>Filter by stage</h4>
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
        <div className={styles.filterButtonWrapper}>
          <StageButton
            currentVotingStage={currentVotingStage}
            onButtonClick={onSetCurrentStage}
            value={1}
          >
            Stage 1
          </StageButton>
          <span className={styles.filterButtonNote}>Explore all submissions</span>
        </div>
        <div className={styles.filterButtonWrapper}>
          <StageButton
            currentVotingStage={currentVotingStage}
            onButtonClick={onSetCurrentStage}
            value={2}
          >
            Stage 2
          </StageButton>
          <span className={styles.filterButtonNote}>Explore submissions which received votes</span>
        </div>
      </section>
      {
        checkApplyButton() &&
        <button
          className={styles.applyButton}
          onClick={onApply}
        >
          Apply
        </button>
      }
      <div className={styles.textWrapper}>
        <p className={styles.text}>
          What is the most insightful piece of content you have encountered recently?
        </p>
        <button
          onClick={() => router.push("/submission/create")}
          className={classNames(styles.buttonPrimary, styles.sizeXl)}
        >
          Submit a link
        </button>
      </div>
    </aside>
  );
};
