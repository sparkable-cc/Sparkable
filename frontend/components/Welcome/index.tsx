import styles from './index.module.scss';
import classNames from 'classnames';
import { ReactSVG } from 'react-svg';

export const Welcome = () => {

  return (
    <div className={styles.welcomeWrapper}>
      <h1 className={styles.title}>Spark new insight.</h1>
      <p className={styles.subtitle}>Find insightful content. Crowd-curated and powered by a new reward system.</p>
      <div className={styles.buttonsWrapper}>
        <button className={classNames(styles.startButton, styles.sizeXl)}>Start Exploring</button>
        <button className={classNames(styles.buttonTransparent, styles.sizeXl)}>Learn More</button>
      </div>
      <div className={styles.benefitsWrapper}>
        <div className={styles.benefit}>
          <ReactSVG className={styles.benefitIcon} src="/svg/lens.svg" />
          <h3 className={styles.benefitTitle}>Discover and submit</h3>
          <p className={styles.benefitDescription}>View and send in links that had a lasting impact.</p>
        </div>
        <div className={styles.benefit}>
          <ReactSVG className={styles.benefitIcon} src="/svg/page.svg" />
          <h3 className={styles.benefitTitle}>Vote monthly</h3>
          <p className={styles.benefitDescription}>Select the most insightful and constructive content.</p>
        </div>
        <div className={styles.benefit}>
          <ReactSVG className={styles.benefitIcon} src="/svg/stars.svg" />
          <h3 className={styles.benefitTitle}>Reward and get rewarded</h3>
          <p className={styles.benefitDescription}>Earn rewards for providing new insight.</p>
        </div>
      </div>
    </div>
  )
}