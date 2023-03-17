import styles from "./index.module.scss";
import { useState, useRef } from "react";
import { selectIsVotingBannerVisible } from "../../store/UIslice";
import { useAppSelector } from "../../store/hooks";
import classNames from "classnames";
import { useRouter } from 'next/router';
import { useOutsideClick } from "../../utils/useOutsideClick";

interface Props {
  isShort?: boolean
}

export const VotingBanner = ({ isShort }: Props) => {
  const [isOpen, setOpen] = useState(false);
  const isVotingBannerVisible = useAppSelector(selectIsVotingBannerVisible);
  const router = useRouter();
  const nodeRef = useRef(null);

  const checkException = () => {
    if (/article/.test(router.route)) {
      return false;
    }
    return true;
  }

  useOutsideClick(nodeRef, () => {
    setOpen(false);
  });

  if (isVotingBannerVisible && checkException()) {
    return (
      <div className={classNames(styles.bannerWrapper, { [styles.short]: isShort })} ref={nodeRef}>
        <div className={styles.banner}>
          <div className={styles.messageWrapper}>
            <div className={styles.messageText}>
              <b>3</b> days until next voting round
              {/* Voting is now open! */}
            </div>
            <span className={styles.toggleButton} onClick={() => setOpen(!isOpen)}>
              {isOpen ? "Hide" : "What is this?"}
            </span>
            {/* <span className={styles.voiteButton}>Vote Now</span> */}
          </div>
          {
            isOpen && <div className={styles.detailsWrapper}>
              <img className={styles.detailsImage} src="/svg/voting-details.svg" alt="voting-details" />
              <div className={styles.detailsColumn}>
                <b>How it works:</b> Every 2 weeks everyone selects the submissions that were most insightful to them.
              </div>
              <div className={styles.detailsColumn}>
                If you vote you will be able to explore the submissions that made it to the next stage.
              </div>
            </div>
          }
        </div>
      </div>
    )
  } else {
    return null;
  }
}