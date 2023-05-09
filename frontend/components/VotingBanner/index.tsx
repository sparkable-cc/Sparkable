import classNames from "classnames";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useLazyGetVotingStatusQuery } from "../../store/api/votingApi";
import { useAppDispatch } from "../../store/hooks";
import { setVotingBannerVisible } from "../../store/UIslice";
import { useOutsideClick } from "../../utils/useOutsideClick";
import styles from "./index.module.scss";

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

  const handleChildElementClick = (e) => {
    e.stopPropagation();
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
        <div className={styles.banner} onClick={() => setOpen(!isOpen)}>
          <div className={styles.messageWrapper}>
            {
              data?.openVoting ?
                <>
                  <div className={styles.messageText}>
                    Voting is now open!
                  </div>
                  <Link href="/voting/participate" onClick={handleChildElementClick} className={styles.voiteButton}>Vote Now</Link>
                </>
                :
                <>
                  <div className={styles.messageText}>
                    {
                      data?.daysUntilNextVoting < 1 ?
                        <>
                          Next voting round in <b>{timeArray?.[0]}</b> h <b>{timeArray?.[1]}</b> min
                        </> :
                        <>
                          <b>{data?.daysUntilNextVoting}</b> days until next voting round
                        </>
                    }
                  </div>
                  <span className={classNames(styles.toggleButton, { [styles.open]: isOpen })} >
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
                <b>How it works:</b> In regular time frames, everyone selects the submissions that were most insightful to them.
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
