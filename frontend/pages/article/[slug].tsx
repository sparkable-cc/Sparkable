import type { NextPage } from "next";
import styles from "../../styles/Article.module.scss";
import { ArticlesList } from "../../components/ArticlesList";
import { ArticlePreview } from '../../components/ArticlePreview';
import { BackButton } from "../../components/BackButton";

const Article: NextPage = () => {

  return (
    <>
      <div className={styles.backButtonWrapper}>
        <BackButton directPath="/#explore">Back <span>to Explore</span></BackButton>
      </div>
      <section className={styles.articlesWrapper}>
        <ArticlesList isPreviewPage={true} />
      </section>
      <ArticlePreview />
    </>
  );
};

export default Article;