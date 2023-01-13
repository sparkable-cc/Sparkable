import styles from './index.module.scss';

export const ArticleItem = () => {

  return (
    <article className={styles.articleItem}>
      <div
        className={styles.articleCover}
        style={{
          backgroundImage: `url("https://picsum.photos/id/82/600/500")`
        }} />
      <div className={styles.articleInfoWrapper}>
        <a href="" className={styles.articleLink}>site.com</a>
        <span className={styles.articleTitle}>Opinion | Why Women Had Better Sex Under Socialism (Published 2017)</span>
      </div>
    </article>
  )
}