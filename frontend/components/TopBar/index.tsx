import styles from './index.module.scss';
import { MobileHeader } from "../MobileHeader";
import { AuthButtons } from '../AuthButtons';
import { VotingBanner } from '../VotingBanner';

interface Props {
  isForcedMobile?: boolean;
  isAuthButtonsVisible?: boolean;
}

export const TopBar = ({ isForcedMobile, isAuthButtonsVisible }: Props) => {
  return (
    <header className={styles.topBarWrapper}>
      <VotingBanner />
      <MobileHeader isForcedMobile={isForcedMobile}>
        {isAuthButtonsVisible && <AuthButtons />}
      </MobileHeader>
      {!isForcedMobile && isAuthButtonsVisible &&
        <div className={styles.authWrapper}>
          <AuthButtons />
        </div>
      }
    </header>
  )
}