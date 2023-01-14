import styles from './index.module.scss';
import classNames from 'classnames';

export const Filters = () => {

  return (
    <aside className={styles.filtersSidebar}>
      <span>102 Links</span>
      <section className={styles.filtersSection}>
        <h4 className={styles.filtersTitle}>Sort by</h4>
        <button className={styles.filterButton}>Random</button>
      </section>
      <section className={styles.filtersSection}>
        <h4 className={styles.filtersTitle}>Filter by category</h4>
        <button className={styles.filterButton}>Art & Culture</button>
        <button className={styles.filterButton}>Business & Economy</button>
        <button className={styles.filterButton}>Environment</button>
        <button className={styles.filterButton}>Mind & Body</button>
        <button className={classNames(styles.filterButton, styles.active)}>Society</button>
        <button className={styles.filterButton}>Technology</button>
        <button className={styles.filterButton}>Other</button>
      </section>
      <div className={styles.textWrapper}>
        <p className={styles.text}>
          What is the most insightful piece of content you have encountered recently?
        </p>
        <button className={classNames(styles.buttonPrimary, styles.sizeXl)}>Submit a link</button>
      </div>
    </aside>
  )
}