import styles from "./index.module.scss";
import { ApiTypes } from "../../types";
import { ArticleLink } from "../ArticleLink";
import Link from "next/link";
import { useRouter } from "next/router";

type Props = ApiTypes.Model.Link

export const ArticleItem = ({
  id,
  uuid,
  title,
  url,
  image,
  description,
  date,
  username
}: Props) => {
  const router = useRouter();

  return (
    <article className={styles.articleItem}>
      {image && <div
        className={styles.articleCover}
        onClick={() => { router.push(`/article/${id}`); }}
        style={{
          backgroundImage: `url(${image})`
        }}
      />}
      <div className={styles.articleInfoWrapper}>
        <ArticleLink link={url} />
        <Link className={styles.articleTitle} href={`/article/${id}`}>
          {title}
        </Link>
      </div>
    </article>
  );
};
