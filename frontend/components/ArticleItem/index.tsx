import styles from "./index.module.scss";
import { ApiTypes } from "../../types";
import { ArticleLink } from "../ArticleLink";
import { useRouter } from "next/router";
import classNames from "classnames";

interface Props extends ApiTypes.Model.Link {
  className?: string
}

export const ArticleItem = ({
  id,
  uuid,
  title,
  url,
  image,
  description,
  date,
  username,
  className,
}: Props) => {
  const router = useRouter();

  const onItemClick = () => {
    router.push(`/article/${id}`, undefined, { shallow: true });
  };

  return (
    <article className={classNames(styles.articleItem, className)}>
      {image && <div
        className={styles.articleCover}
        onClick={onItemClick}
        style={{
          backgroundImage: `url(${image})`
        }}
      />}
      <div className={styles.articleInfoWrapper}>
        <ArticleLink link={url} uuid={uuid} />
        <h3 className={styles.articleTitle} onClick={onItemClick}>
          {title}
        </h3>
      </div>
    </article>
  );
};
