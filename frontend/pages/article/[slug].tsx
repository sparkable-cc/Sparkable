import type { NextPage } from "next";
import styles from "../../styles/Article.module.scss";
import { ArticlesList } from "../../components/ArticlesList";
import { ArticlePreview } from '../../components/ArticlePreview';
import { BackButton } from "../../components/BackButton";
import { useLazyGetArticleByIDQuery } from "../../store/api";
import { useEffect } from "react";
import { useRouter } from 'next/router';
import { ApiTypes } from "../../types";

const Article: NextPage = () => {
  const [triggerGetArticleByID, { isLoading, data }] = useLazyGetArticleByIDQuery();
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    if (slug) {
      triggerGetArticleByID(slug as string);
    }
  }, [slug]);

  return (
    <>
      <div className={styles.backButtonWrapper}>
        <BackButton directPath="/#explore">Back <span>to Explore</span></BackButton>
      </div>
      <section className={styles.articlesWrapper}>
        <ArticlesList isPreviewPage={true} />
      </section>
      <ArticlePreview isLoading={isLoading} {...data as ApiTypes.Res.Article} />
    </>
  );
};

export default Article;