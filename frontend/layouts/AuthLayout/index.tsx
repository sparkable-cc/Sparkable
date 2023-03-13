import { PropsWithChildren } from 'react';
import styles from './index.module.scss';
import { BackButton } from '../../components/BackButton';
import { CancelButton } from "../../components/CancelButton";
import { useRouter } from "next/router";

interface Props extends PropsWithChildren {
  isBackButton?: boolean;
  isCancelButton?: boolean
}

export const AuthLayout = ({ children, isBackButton = true, isCancelButton = false }: Props) => {

  const router = useRouter();

  const onCancel = () => {
    router.push("/");
  }

  return (
    <section className={styles.layoutWrapper}>
      <div className={styles.layoutContentWrapper}>
        <header className={styles.buttonsWrapper}>
          {isBackButton ? <BackButton>Back</BackButton> : <span></span>}
          {isCancelButton && <CancelButton onCancel={onCancel}>Cancel</CancelButton>}
        </header>
        {children}
      </div>
    </section>
  )
}