import styles from "./index.module.scss";
import { useState } from "react";

export const VotingBanner = () => {
  const [isOpen, setOpen] = useState(false);

  return (
    <div className={styles.bannerWrapper}>
      <b>3</b> days until next voting round
      <span
        className={styles.toggleButton}
        onClick={() => setOpen(!isOpen)}>
        {isOpen ? "Hide" : "What is this?"}
      </span>
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
  )
}