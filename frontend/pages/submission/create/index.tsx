import { CreateSubmissionLayout } from "../../../layouts/CreateSubmissionLayout";
import styles from '../../../styles/Submission.module.scss';
import { useRouter } from "next/router";

const CreateSubmissionStart = () => {
  const router = useRouter();

  const onButtonClick = () => {
    router.push("/submission/create/link")
  }

  return (
    <CreateSubmissionLayout 
      isSubmitAvailable={true}
      submitButtonText="Start" 
      onSubmit={onButtonClick}>
      <h2 className={styles.title}>Make a submission</h2>
      <p className={styles.text}>You can submit a link to any type of content: written pieces, videos, podcasts, websites, or anything else.</p>
      <p className={styles.text}>Please make sure you submit content which contributes to Sparkable’s goals:</p>
      <div className={styles.quote}>
        <p className={styles.quoteText}>Sparkable aims to become an environment <strong>that broadens horizons, induces personal growth</strong> and <strong>brings lasting insight.</strong></p>
      </div>
      <p className={styles.text}>Thank you!</p>
      <p className={styles.note}>Submitting something takes 2-5 minutes.</p>
    </CreateSubmissionLayout>
  )
}

export default CreateSubmissionStart;