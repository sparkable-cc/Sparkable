import { PropsWithChildren } from 'react';
import styles from './index.module.scss';
import { BackButton } from '../../components/BackButton';
import { CancelButton } from "../../components/CancelButton";
import { useRouter } from "next/router";
import { selectIsVotingBannerVisible } from "../../store/UIslice";
import { useAppSelector } from "../../store/hooks";
import classNames from 'classnames';

interface Props extends PropsWithChildren {
  isBackButton?: boolean;
  isCancelButton?: boolean
}

export const AuthLayout = ({ children, isBackButton = true, isCancelButton = false }: Props) => {
  const isVotingBannerVisible = useAppSelector(selectIsVotingBannerVisible);
  const router = useRouter();

  const onCancel = () => {
    router.push("/");
  }

  return (
    <section className={classNames(styles.layoutWrapper, {[styles.withVoitingBanner]: isVotingBannerVisible})}>
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