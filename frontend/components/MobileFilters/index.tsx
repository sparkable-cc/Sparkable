import styles from "./index.module.scss";
import classNames from "classnames";
import {
  useMemo,
  useState,
  useEffect,
  useRef,
} from "react";
import {
  useLazyGetCategoriesQuery,
  getCategories,
} from "../../store/api/articlesApi";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { v4 as uuidv4 } from "uuid";
import { CSSTransition } from "react-transition-group";
import { SortsSelect } from "../SortsSelect";
import { useOutsideClick } from "../../utils/useOutsideClick";
import isEqual from "lodash.isequal";
import { ModalNote } from "../ModalNote";
import { StageButton } from "../StageButton";
import {
  setFilters,
  setVotingStage,
  selectSelectedVotingStage,
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

  const selectedVotingStage = useAppSelector(selectSelectedVotingStage);
  const [ currentVotingStage, setCurrentVotingStage ] = useState<number | undefined>(selectedVotingStage);

  const [ isModalOpen, setModalOpen ] = useState(false);
  const [ currentFilters, setCurrentFilters ] = useState(selectedFilters);

  const categoriesData = categories?.data?.categories;
  const nodeRef = useRef(null);

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

  const onCancel = () => {
    setModalOpen(false);
    setCurrentFilters(selectedFilters);
  };

  const onApply = () => {
    dispatch(setFilters(currentFilters));
    dispatch(setVotingStage(currentVotingStage));
    onCancel();
  };

  const checkApplyButton = () => {
    if (!isEqual(currentFilters, selectedFilters)) {
      return true;
    }
    if (!isEqual(currentVotingStage, selectedVotingStage)) {
      return true;
    }
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
  }, [ isModalOpen, categoriesData ]);

  const checkCounter = () => {
    if(selectedFilters?.length) return true;
    if(currentVotingStage) return true;
    else return false;
  };

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
              checkCounter() &&
              <span className={styles.filterCounter}>
                {(currentVotingStage ? 1 : 0) + selectedFilters?.length}
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
                <StageButton
                  currentVotingStage={currentVotingStage}
                  onButtonClick={onSetCurrentStage}
                  value={1}
                  isMobile
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
                  isMobile
                >
                  Stage 2
                </StageButton>
                <span className={styles.filterButtonNote}>Explore submissions which received votes</span>
              </div>
            </div>
          </section>
          {
            checkApplyButton() &&
            <button
              className={classNames(styles.applyButton, styles.sizeXl)}
              onClick={onApply}
            >
              Apply
            </button>
          }
        </div>
      </CSSTransition>
    </>
  );
};
