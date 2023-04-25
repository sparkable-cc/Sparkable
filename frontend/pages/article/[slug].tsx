import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ArticlePreview } from "../../components/ArticlePreview";
import { ArticlesList } from "../../components/ArticlesList";
import { BackButton } from "../../components/BackButton";
import { ModalShare } from "../../components/ModalShare";
import { useLazyGetArticleByIDQuery } from "../../store/api/articlesApi";
import styles from "../../styles/Article.module.scss";
import { ApiTypes } from "../../types";

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
          textLink={data?.url.slice(0, 30) + "..."}
        />
      }
    </>
  );
};

export default Article;
