import classNames from "classnames";
import { useState, useEffect } from "react";
import { PropsWithChildren } from "react";
import styles from "./index.module.scss";
import { useAppSelector } from "../../store/hooks";
import { selectAvailableVotingStage } from "../../store/UIslice";

interface Props extends PropsWithChildren {
  value: number
  currentVotingStage: number | undefined
  isMobile?: boolean
  onButtonClick: (value: number) => void
}

export const StageButton = ({
  currentVotingStage,
  value,
  children,
  isMobile,
  onButtonClick,
}: Props) => {
  const [ availableStage, setAvailableStage ] = useState<number | undefined>(undefined);
  const availableVotingStage = useAppSelector(selectAvailableVotingStage);

  useEffect(() => {
    setAvailableStage(availableVotingStage);
  }, []);

  return (
    <button
      className={classNames({
        [styles.filterStageButton]: !isMobile,
        [styles.filterStageButtonMobile]: isMobile,
        [styles.active]: currentVotingStage == value,
        [styles.disabled]: availableStage != value,
      })}
      onClick={() => onButtonClick(1)}
      disabled={availableStage != value}
    >
      {children}
    </button>
  );
};
