import styles from "./index.module.scss";
import { ApiTypes } from "../../types";

type Props = ApiTypes.Model.Link

export const ArticleItem = ({
  id,
  uuid,
  title,
  link,
  image,
  date,
  username
}: Props) => {
  return (
    <article className={styles.articleItem}>
      {image && <div
        className={styles.articleCover}
        style={{
          backgroundImage: `url(${image})`
        }}
      />}
      <div className={styles.articleInfoWrapper}>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={link}
          className={styles.articleLink}
        >
          {link}
        </a>
        <span className={styles.articleTitle}>
          {title}
        </span>
      </div>
    </article>
  );
};
