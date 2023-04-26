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

  const getTruncatedLink = (url?: string) => {
    if (!url) return "";

    const urlObj = new URL(url);
    const subDomain = urlObj.hostname.split(".")[0];
    const domain = urlObj.hostname.replace(`${subDomain}.`, "");
    const tld = domain.split(".").slice(-1)[0];

    return `${subDomain}.${domain.slice(0, 3)}...${tld}`;
  };


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
          textLink={getTruncatedLink(data?.url)}
        />
      }
    </>
  );
};

export default Article;
