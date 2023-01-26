import { PropsWithChildren } from 'react';
import styles from './index.module.scss';

export const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className={styles.container}>
      <section className={styles.layoutWrapper}>
        <div className={styles.formContainer}>
          <button className={styles.backButton}>
            Back
          </button>
          {children}
        </div>
      </section>
    </div>
  )
}