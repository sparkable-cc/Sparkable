import type { NextPage } from "next";
import { Menu } from "../../components/Menu";
import styles from "../../styles/Home.module.scss";
import { ArticlesList } from "../../components/ArticlesList";
import { MobileHeader } from "../../components/MobileHeader";
import { ArticlePreview } from '../../components/ArticlePreview';

const Article: NextPage = () => {

  return (
    <main className={styles.mainWrapper}>
      <ArticlePreview />
    </main>
  );
};

export default Article;