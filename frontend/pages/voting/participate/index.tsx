import { VotingLayout } from "../../../layouts/VotingLayout";
import styles from "../../../styles/Voting.module.scss";
import { useRouter } from "next/router";
import Link from "next/link";

const VotingStart = () => {
  const router = useRouter();

  const onButtonClick = () => {
    router.push("/voting/participate/list");
  };

  return (
    <VotingLayout
      isSubmitAvailable
      submitButtonText="Start"
      onSubmit={onButtonClick}
    >
      <h2 className={styles.title}>Welcome to your first vote</h2>
      <p className={styles.text}>Sparkable aims to become an environment that broadens horizons, induces personal growth, and brings lasting insight. <Link className={styles.link} href="/about">Learn more</Link></p>
      <p className={styles.text}>Every 2 weeks everyone selects the submissions that were most insightful to them. With this, we find the signal in the noise and co-create a better information environment.</p>
      <p className={styles.text}>If you vote, you will be able to explore the submissions that made it to the next stage.</p>
      <p className={styles.text}>Let’s spark insight!</p>
      <p className={styles.note}>Estimated completion time: 2-5 minutes.</p>
    </VotingLayout>
  );
};

export default VotingStart;
