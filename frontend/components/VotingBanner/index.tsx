import styles from "./index.module.scss";
import { useState, useRef, useEffect } from "react";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useOutsideClick } from "../../utils/useOutsideClick";
import { useLazyGetVotingStatusQuery } from "../../store/api/votingApi";
import dayjs from "dayjs";
import { setVotingBannerVisible } from "../../store/UIslice";
import { useAppDispatch } from "../../store/hooks";
import Link from "next/link";

interface Props {
  isShort?: boolean
}

export const VotingBanner = ({ isShort }: Props) => {
  const [ isOpen, setOpen ] = useState(false);
  const [ timeArray, setTimeArray ] = useState([]);
  const router = useRouter();
  const nodeRef = useRef(null);
  const [ triggerGetVotingStatus, { isLoading, data }] = useLazyGetVotingStatusQuery();
  const dispatch = useAppDispatch();

  const checkException = () => {
    if (/article|voting/.test(router.route)) {
      return false;
    }
    return true;
  };

  useOutsideClick(nodeRef, () => {
    setOpen(false);
  });

  useEffect(() => {
    const date = dayjs().format("YYYY-MM-DD hh:mm:s");
    triggerGetVotingStatus({ date });
  }, []);

  useEffect(() => {
    if (data?.timeUntilNextVoting) {
      dispatch(setVotingBannerVisible(true));
      setTimeArray(data?.timeUntilNextVoting.split(":") as never[]);
    } else {
      dispatch(setVotingBannerVisible(false));
    }
  }, [data]);

  if (data?.daysUntilNextVoting !== undefined && data?.daysUntilNextVoting <= 10 && checkException()) {
    return (
      <div className={classNames(styles.bannerWrapper, { [styles.short]: isShort })} ref={nodeRef}>
        <div className={styles.banner}>
          <div className={styles.messageWrapper}>
            {
              data?.openVoting ?
                <>
                  <div className={styles.messageText}>
                    Voting is now open!
                  </div>
                  <Link href="/voting/participate" className={styles.voiteButton}>Vote Now</Link>
                </>
                :
                <>
                  <div className={styles.messageText}>
                    {
                      data.daysUntilNextVoting < 1 ?
                        <>
                          Next voting round in <b>{timeArray?.[0]}</b> h <b>{timeArray?.[1]}</b> min</> :
                        <>
                          <b>{data.daysUntilNextVoting}</b> days until next voting round
                        </>
                    }
                  </div>
                  <span className={styles.toggleButton} onClick={() => setOpen(!isOpen)}>
                    {isOpen ? "Hide" : "What is this?"}
                  </span>
                </>
            }
          </div>
          {
            isOpen &&
            <div className={styles.detailsWrapper}>
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
    );
  } else {
    return null;
  }
};
