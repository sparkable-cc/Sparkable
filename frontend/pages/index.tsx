import type { NextPage } from "next";
import { AuthButtons } from "../components/AuthButtons";
import { Welcome } from "../components/Welcome";
import { Filters } from "../components/Filters";
import styles from "../styles/Home.module.scss";
import { ArticlesList } from "../components/ArticlesList";

const HomePage: NextPage = () => {
  return (
    <section className={styles.container}>
      <AuthButtons />
      <Welcome />
      <div className={styles.contentWrapper}>
        <ArticlesList />
        <Filters />
      </div>
    </section>
  );
};

export default HomePage;
