
import styles from "./index.module.scss";
import { ArticleLink } from "../../components/ArticleLink";

interface Props {
  isLoading?: boolean
  site?: string
  title?: string
  description?: string
  image?: string
}

export const LinkPreview = ({
  isLoading,
  site,
  title,
  description,
  image
}: Props) => {

  if (isLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <span className={styles.spinner} />
        <div className={styles.loadingText}>
          Creating link preview
        </div>
      </div>
    );
  }
  if (!site && !title && !description) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loadingText}>
          Data not found, you can try another link
        </div>
      </div>
    );
  }
  else {
    return (
      <section className={styles.linkPreview}>
        <div className={styles.linkPreviewContent}>
          {
            site &&
            <ArticleLink link={site} />
          }
          <h3 className={styles.linkTitle}>
            {title}
          </h3>
          <div className={styles.linkDescription}>
            {description}
          </div>
        </div>
        <div
          className={styles.linkPreviewCover}
          style={{ backgroundImage: `url(${image ? image : ""})` }}
        />
      </section>
    );
  }
};
