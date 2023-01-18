import styles from './index.module.scss';
import classNames from 'classnames';
import { ReactSVG } from 'react-svg';
import Link from "next/link";

export const Welcome = () => {

  return (
    <div className={styles.welcomeWrapper}>
      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>Spark <br />new insight.</h1>
        <p className={styles.subtitle}>Find insightful content. Crowd-curated and powered by a new reward system.</p>
        <div className={styles.buttonsWrapper}>
          <Link scroll={false} href="/#explore" className={classNames(styles.startButton, styles.sizeXl)}>Start Exploring</Link>
          <Link href="/about" className={classNames(styles.buttonTransparent, styles.sizeXl)}>Learn More</Link>
        </div>
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