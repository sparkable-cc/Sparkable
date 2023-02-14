import { PropsWithChildren } from 'react';
import styles from './index.module.scss';
import { BackButton } from '../../components/BackButton';

export const AuthLayout = ({ children }: PropsWithChildren) => {

  return (
    <section className={styles.layoutWrapper}>
      <div className={styles.layoutContentWrapper}>
        <BackButton>Back</BackButton>
        {children}
      </div>
    </section>
  )
}