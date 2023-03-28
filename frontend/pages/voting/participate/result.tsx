import { useEffect, useState } from "react";
import { VotingLayout } from "../../../layouts/VotingLayout";
import styles from "../../../styles/Voting.module.scss";
import { useLazyGetVotingStatusQuery } from "../../../store/api/votingApi";
import Link from "next/link";
import dayjs from "dayjs";
import { Spiner } from "../../../components/Spiner";

const VotingResult = () => {
  const date = dayjs().format("YYYY-MM-DD hh:mm:s");
  const [currentTime, setCurrentTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0
  });
  const [triggerGetVotingStatus, { isLoading, data }] = useLazyGetVotingStatusQuery();

  useEffect(() => {
    triggerGetVotingStatus({ date });
  }, []);

  useEffect(() => {
    if (data?.timeUntilNextVoting) {
      const timeArray = data?.timeUntilNextVoting.split(":");
      setCurrentTime({
        days: data?.daysUntilNextVoting || 0,
        hours: timeArray?.[0] && Number(timeArray?.[0]) % 24 || 0,
        minutes: Number(timeArray?.[1]) || 0
      })
    }
  }, [data]);

  return (
    <VotingLayout>
      <div className={styles.resultContentWrapper}>
        <img
          className={styles.voteResultImage}
          src="/svg/vote-result.svg"
          alt="vote"
        />
        <h2 className={styles.title}>Thank you for voting!</h2>
        <p className={styles.text}>The voting round closes in</p>
        <p className={styles.text}>
          {
            isLoading ?
              <Spiner sizeWidth="20" /> :
              <>
                <b>{currentTime.days}</b> day {" "}
                <b>{currentTime.hours}</b> hours {" "}
                <b>{currentTime.minutes}</b> min
              </>
          }
        </p>
        <p className={styles.text}>When everyone has voted, you will be able to explore the submissions that made it to the next stage.</p>
        <Link className={styles.resultBackButton} href="/#explore">Back to Explore</Link>
      </div>
    </VotingLayout>
  );
};

export default VotingResult;
