import styles from './index.module.scss';
import { ArticleLink } from '../ArticleLink';

export const ArticlePreview = () => {
  return (
    <section className={styles.articlePreview}>
      <div
        className={styles.articleCover}
        style={{
          backgroundImage: `url(${'https://picsum.photos/seed/picsum/400/300'})`
        }}
      />
      <div className={styles.contentWrapper}>
        <div>
          <ArticleLink link={'asdasd.sd'} />
        </div>
        <h2 className={styles.articleTitle}>Instagram has ruined the art world. What now?</h2>
        <p className={styles.articleDescription}>
          Social media is not a fair space to showcase art but as much as artists want to delete their Instagram accounts, they feel like they have nowhere else to go. So what now?
        </p>
        <nav className={styles.buttonsWrapper}>
          <button className={styles.openButton}>Open</button>
          <button className={styles.bookmarkButton}>Bookmark</button>
          <button className={styles.shareButton}/>
          <button className={styles.dotsButton}/>
        </nav>
        <div className={styles.categoriesWrapper}>
          <header className={styles.categoriesHeader}>
            <span className={styles.date}>Submitted on 09 Dec 2022</span>
            <span className={styles.showMore}>Show more</span>
          </header>
          <div className={styles.categories}>
            <button className={styles.categoryTag}>Technology</button>
            <button className={styles.categoryTag}>Technology</button>
          </div>
        </div>
      </div>
    </section>
  )
}