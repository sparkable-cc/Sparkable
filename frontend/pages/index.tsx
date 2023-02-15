import type { NextPage } from "next";
import { AuthButtons } from "../components/AuthButtons";
import { Welcome } from "../components/Welcome";
import { Filters } from "../components/Filters";
import { MobileFilters } from "../components/MobileFilters";
import styles from "../styles/Home.module.scss";
import { ArticlesList } from "../components/ArticlesList";
import { SortsSelect } from "../components/SortsSelect";
import { selectArticles, selectTotal } from "../store/UIslice";
import { useAppSelector } from "../store/hooks";

const HomePage: NextPage = () => {
  const total = useAppSelector(selectTotal);
  const articles = useAppSelector(selectArticles);

  return (
    <section className={styles.container}>
      <AuthButtons />
      <Welcome />
      <div className={styles.contentWrapper}>
        <section className={styles.articlesWrapper} id="explore">
          <div className={styles.exploreTitleWrapper}>
            <div className={styles.exploreButton} />
            <h2 className={styles.exploreTitle}>
              <span>Explore</span> what others have submitted
            </h2>
          </div>
          <div className={styles.sortsWrapper}>
            <span className={styles.totalCounter}>{articles.length} / {total} submissions</span>
            <SortsSelect />
          </div>
          <MobileFilters />
          <ArticlesList />
        </section>
        <Filters />
      </div>
    </section>
  );
};

export default HomePage;
