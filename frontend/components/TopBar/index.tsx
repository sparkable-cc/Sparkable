import styles from './index.module.scss';
import { MobileHeader } from "../MobileHeader";
import { AuthButtons } from '../AuthButtons';
import { VotingBanner } from '../VotingBanner';
import { selectIsVotingBannerVisible } from "../../store/UIslice";
import { useAppSelector } from "../../store/hooks";
import classNames from 'classnames';

interface Props {
  isForcedMobile?: boolean;
  isAuthButtonsVisible?: boolean;
  isShortVoitingBanner?: boolean;
}

export const TopBar = ({ isForcedMobile, isAuthButtonsVisible, isShortVoitingBanner }: Props) => {
  const isVotingBannerVisible = useAppSelector(selectIsVotingBannerVisible);

  return (
    <header className={styles.topBarWrapper}>
      <VotingBanner isShort={isShortVoitingBanner} />
      <MobileHeader isForcedMobile={isForcedMobile}>
        {isAuthButtonsVisible && <AuthButtons />}
      </MobileHeader>
      {!isForcedMobile && isAuthButtonsVisible &&
        <div className={classNames(styles.authWrapper, {[styles.withVoitingBanner]: isVotingBannerVisible})}>
          <AuthButtons />
        </div>
      }
    </header>
  )
}