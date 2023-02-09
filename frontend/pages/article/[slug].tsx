import type { NextPage } from "next";
import { useState, useEffect } from "react";
import styles from "../../styles/Article.module.scss";
import { ArticlesList } from "../../components/ArticlesList";
import { ArticlePreview } from "../../components/ArticlePreview";
import { BackButton } from "../../components/BackButton";
import { useLazyGetArticleByIDQuery } from "../../store/api";
import { useRouter } from "next/router";
import { ApiTypes } from "../../types";
import { ModalShare } from "../../components/ModalShare";


const Article: NextPage = () => {
  const [ isCopyModalVisible, setCopyModalVisible ] = useState(false);
  const [ triggerGetArticleByID, { isLoading, data }] = useLazyGetArticleByIDQuery();
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
        <ArticlesList isPreviewPage />
      </section>
      <ArticlePreview
        isLoading={isLoading}
        onShareClick={() => setCopyModalVisible(true)}
        {...data as ApiTypes.Res.Article}
      />
      {
        data && <ModalShare
          isVisible={isCopyModalVisible}
          onCancel={() => setCopyModalVisible(false)}
          textLink={data?.link}
        />
      }
    </>
  );
};

export default Article;
