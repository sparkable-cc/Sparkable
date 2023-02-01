import styles from "./index.module.scss";
import { ApiTypes } from "../../types";
import { ArticleLink } from '../ArticleLink';
import Link from "next/link";

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
      <Link href={`/article/${id}`}>
        {image && <div
          className={styles.articleCover}
          style={{
            backgroundImage: `url(${image})`
          }}
        />}
      </Link>
      <div className={styles.articleInfoWrapper}>
        <ArticleLink link={link} />
        <Link className={styles.articleTitle} href={`/article/${id}`}>
          {title}
        </Link>
      </div>
    </article>
  );
};
