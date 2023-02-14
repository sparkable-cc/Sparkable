import type { NextPage } from "next";
import { AuthButtons } from "../components/AuthButtons";
import { Welcome } from "../components/Welcome";
import { Filters } from "../components/Filters";
import { MobileFilters } from "../components/MobileFilters";
import styles from "../styles/Home.module.scss";
import { ArticlesList } from "../components/ArticlesList";
import { SortsSelect } from "../components/SortsSelect";

const HomePage: NextPage = () => {
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
            <span className="" />
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
