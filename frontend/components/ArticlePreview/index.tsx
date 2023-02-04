import styles from './index.module.scss';
import { ArticleLink } from '../ArticleLink';
import { ApiTypes } from '../../types';
import { v4 as uuidv4 } from "uuid";
import classNames from 'classnames';
import dayjs from 'dayjs';
import { Spiner } from '../Spiner';

interface Props extends ApiTypes.Res.Article {
  isLoading: boolean
}

export const ArticlePreview = ({
  title,
  link,
  image,
  date,
  description,
  categories,
  isLoading
}: Props) => {
  return (
    <section className={styles.articlePreview}>
      {image && <div
        className={styles.articleCover}
        style={{
          backgroundImage: `url(${image})`
        }}
      />}
      <div className={styles.contentWrapper}>
        <div>
          <ArticleLink link={link} />
        </div>
        <h2 className={styles.articleTitle}>
          {title}
        </h2>
        <p className={styles.articleDescription}>
          {description}
        </p>
        <nav className={styles.buttonsWrapper}>
          <a
            href={link}
            className={styles.openButton}
            rel="noopener noreferrer"
            target="_blank">
            Open
          </a>
          <button className={classNames(styles.bookmarkButton, styles.disable)}>Bookmark</button>
          <button className={styles.shareButton} />
          <button className={classNames(styles.dotsButton, styles.disable)} />
        </nav>
        {isLoading && <Spiner wrapperClassName={styles.spinnerWrapper} />}
        <div className={styles.categoriesWrapper}>
          <header className={styles.categoriesHeader}>
            <span className={styles.date}>
              Submitted on {dayjs(date).format('D MMM YYYY')}
            </span>
            <span className={classNames(styles.showMore, styles.disable)}>Show more</span>
          </header>
          <div className={styles.categories}>
            {Boolean(categories?.length) && categories.map(item => <button
              key={uuidv4()}
              className={styles.categoryTag}>
              {item.name}
            </button>)}
          </div>
        </div>
      </div>
    </section>
  )
}