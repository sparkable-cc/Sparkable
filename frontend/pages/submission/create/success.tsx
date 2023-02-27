import { CreateSubmissionLayout } from "../../../layouts/CreateSubmissionLayout";
import styles from "../../../styles/Submission.module.scss";
import { useRouter } from "next/router";
import Link from "next/link";
import classNames from "classnames";

const SuccessSubmission = () => {
  const router = useRouter();

  const onButtonClick = () => {
    router.push("/");
  };

  return (
    <CreateSubmissionLayout
      isBackButtonAvailable={false}
    >
      <div className={styles.successWrapper}>
        <h2 className={styles.successTitle}>Thank you for <br />your submission!</h2>
        <div className={styles.successMessageWrapper}>
          <p className={styles.successMessage}>Together we spark new insight. </p>
          <p className={styles.successMessage}>Your submission will be visible for others shortly. You can always find all your submissions at <Link className={styles.successLink} href="/submission/list">My Submissions</Link>.</p>
        </div>
        <button className={classNames(styles.buttonPrimary, styles.sizeXl)} onClick={onButtonClick}>Back to Explore</button>
      </div>
    </CreateSubmissionLayout>
  );
};

export default SuccessSubmission;
