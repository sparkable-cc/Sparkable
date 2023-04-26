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

  useEffect(() => {
    if (data?.url) {
      const url = new URL(data.url);
      const domain = url.hostname.replace("www.", "");
      const truncatedUrl = domain.replace(/^(https?)/, "");
      document.title = `${data.title} | ${truncatedUrl}`;
    }
  }, [data]);

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
          textLink={(data?.url)}
        />
      }
    </>
  );
};

export default Article;
