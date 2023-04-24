import { useRouter } from "next/router";
import { CreateSubmissionLayout } from "../../../layouts/CreateSubmissionLayout";
import styles from "../../../styles/Submission.module.scss";

const CreateSubmissionStart = () => {
  const router = useRouter();

  const onButtonClick = () => {
    router.push("/submission/create/link");
  };

  return (
    <CreateSubmissionLayout
      isSubmitAvailable
      submitButtonText="Start"
      onSubmit={onButtonClick}
    >
      <h2 className={styles.title}>
        What is the most insightful <br />
        piece of content you have <br /> encountered recently?
      </h2>
      <p className={styles.text}>Sparkable is looking for:</p>
      <div className={styles.quote}>
        <p className={styles.quoteText}>
          <strong>
            Links that broaden horizons, bring lasting insight, <br />
            and create more mutual understanding.{" "}
          </strong>
        </p>
      </div>
      <p className={styles.text}>
        <a href="/legal/acceptable-use-policy">See Content Guidelines {">"}</a>
      </p>
      <p className={styles.text}>
        You can submit a link to any type of content: websites, podcasts,
        videos, or anything else.
      </p>
      <p className={styles.note}>This process will take 2-5 minutes.</p>
    </CreateSubmissionLayout>
  );
};

export default CreateSubmissionStart;
