import classNames from "classnames";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import { useLazyPostViewedLinkByUserDataQuery } from "../../store/api/trackingApi";
import { ApiTypes } from "../../types";
import { storageKeys } from "../../utils/storageKeys";
import { ArticleLink } from "../ArticleLink";
import { Spiner } from "../Spiner";
import styles from "./index.module.scss";

interface Props extends ApiTypes.Res.Article {
  isLoading: boolean;
  onShareClick: () => void;
}

export const ArticlePreview = ({
  title,
  uuid,
  url,
  image,
  date,
  description,
  statement,
  categories,
  username,
  isLoading,
  onShareClick,
}: Props) => {
  const [triggerPostViewedLinkByUserData] =
    useLazyPostViewedLinkByUserDataQuery();

  const onLinkTrack = () => {
    const userUuid = sessionStorage.getItem(storageKeys.userId);
    if (!userUuid || !uuid) return;

    const data = {
      userUuid,
      linkUuid: uuid,
      linkDescription: description,
    };

    triggerPostViewedLinkByUserData(data);
  };

  return (
    <section className={styles.articlePreview}>
      <div
        className={styles.articleCover}
        style={{
          backgroundImage: `url(${image})`,
        }}
      />
      <div className={styles.contentWrapper}>
        <div>
          <ArticleLink link={url} uuid={uuid} />
        </div>
        <h2 className={styles.articleTitle}>{title}</h2>
        <p className={styles.articleDescription}>{description}</p>
        <nav className={styles.buttonsWrapper}>
          <a
            href={url}
            onClick={onLinkTrack}
            className={styles.openButton}
            rel="noopener noreferrer"
            target="_blank"
          >
            Open
          </a>
          <button className={classNames(styles.bookmarkButton, styles.disable)}>
            Bookmark
          </button>
          <button className={styles.shareButton} onClick={onShareClick} />
          <button className={classNames(styles.dotsButton, styles.disable)} />
        </nav>
        {isLoading && <Spiner wrapperClassName={styles.spinnerWrapper} />}
        <div className={styles.categoriesWrapper}>
          <header className={styles.categoriesHeader}>
            <span className={styles.date}>
              Submitted on {dayjs(date).format("D MMM YYYY")}
            </span>
          </header>
          <div>
            <p className={styles.articleStatement}>@{username}: {statement}</p>
          </div>
          <div className={styles.categories}>
            {Boolean(categories?.length) &&
              categories.map((item) => (
                <button key={uuidv4()} className={styles.categoryTag}>
                  {item.name}
                </button>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};
