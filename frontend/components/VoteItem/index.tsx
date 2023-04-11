import styles from "./index.module.scss";
import classNames from "classnames";
import { ArticleLink } from "../ArticleLink";
import { ApiTypes } from "../../types";

interface Props extends ApiTypes.Res.Article {
  isSelected?: boolean
  onSelect: () => void;
}

export const VoteItem = ({
  title,
  uuid,
  url,
  image,
  isSelected,
  onSelect,
}: Props) => {

  const onItemSelect = () => {
    onSelect();
  };

  return (
    <section className={classNames(styles.voteItemWrapper, { [styles.selected]: isSelected })}>
      <span className={styles.checkMark} onClick={onItemSelect} />
      <div className={styles.voteItem}>
        <div className={styles.voteTitleWrapper}>
          <ArticleLink link={url} uuid={uuid} />
          <h3 className={styles.voteTitle} onClick={onItemSelect}>
            {title}
          </h3>
        </div>
        {
          image &&
          <div
            onClick={onItemSelect} className={styles.voteCover} style={{
              backgroundImage: `url(${image})`
            }}
          />
        }
      </div>
    </section>
  );
};
