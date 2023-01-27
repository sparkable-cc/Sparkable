import { PropsWithChildren } from 'react';
import styles from './index.module.scss';
import { useRouter } from 'next/router'

export const AuthLayout = ({ children }: PropsWithChildren) => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <section className={styles.layoutWrapper}>
        <div className={styles.formContainer}>
          <button className={styles.backButton} onClick={()=>router.back()}>
            Back
          </button>
          {children}
        </div>
      </section>
    </div>
  )
}