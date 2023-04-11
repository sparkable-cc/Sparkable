import styles from "./index.module.scss";
import { MobileHeader } from "../MobileHeader";
import { AuthButtons } from "../AuthButtons";
import { VotingBanner } from "../VotingBanner";
import { selectIsVotingBannerVisible } from "../../store/UIslice";
import { useAppSelector } from "../../store/hooks";
import classNames from "classnames";
import { useRouter } from "next/router";

interface Props {
  isForcedMobile?: boolean;
  isAuthButtonsVisible?: boolean;
  isShortVoitingBanner?: boolean;
}

export const TopBar = ({ isForcedMobile, isAuthButtonsVisible, isShortVoitingBanner }: Props) => {
  const isVotingBannerVisible = useAppSelector(selectIsVotingBannerVisible);
  const router = useRouter();

  const checkException = () => {
    if (!/voting/.test(router.route) && isVotingBannerVisible) {
      return true;
    }
    return false;
  };

  return (
    <header className={styles.topBarWrapper}>
      <VotingBanner isShort={isShortVoitingBanner} />
      <MobileHeader isForcedMobile={isForcedMobile}>
        {isAuthButtonsVisible && <AuthButtons />}
      </MobileHeader>
      {!isForcedMobile && isAuthButtonsVisible &&
        <div className={classNames(styles.authWrapper, { [styles.withVoitingBanner]: checkException() })}>
          <AuthButtons />
        </div>
      }
    </header>
  );
};
