import styles from './index.module.scss';
import classNames from 'classnames';

export const MobileFilters = () => {

  return (
    <aside className={styles.mobileFiltersWrapper}>
      <div className={styles.buttonsWrapper}>
        <button className={styles.buttonWhite}>Newest First</button>
        <button className={styles.buttonWhite}>Filter</button>
      </div>
      <div className={styles.selectedFiltersList}>
        <button className={styles.selectedFilterItem}>Environment</button>
      </div>
      <span className={styles.counter}>102 Results</span>
    </aside>
  )
}