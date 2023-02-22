import { PropsWithChildren } from 'react';
import { BackButton } from '../../components/BackButton';
import { CancelButton } from '../../components/CancelButton';
import styles from './index.module.scss';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { resetSubmission } from '../../store/submissionSlice';
import { useAppDispatch } from "../../store/hooks";
import { storageKeys } from '../../utils/storageKeys';

interface Props extends PropsWithChildren {
  onSubmit?: () => void
  isCancelAvailable?: boolean
  isSubmitAvailable?: boolean
  isBackButtonAvailable?: boolean
  submitButtonText?: string
}

export const CreateSubmissionLayout = ({
  children,
  submitButtonText,
  isSubmitAvailable,
  isCancelAvailable,
  isBackButtonAvailable = true,
  onSubmit,
}: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const onCancel = () => {
    router.push("/");
    dispatch(resetSubmission());
    
    sessionStorage.removeItem(storageKeys.submissionLink)
    sessionStorage.removeItem(storageKeys.submissionCategories)
    sessionStorage.removeItem(storageKeys.submissionSuggestedCategory)
    sessionStorage.removeItem(storageKeys.submissionYourStatement)
  }

  return (
    <div className={styles.createWrapper}>
      <div className={styles.submissionWrapper}>
        <header className={styles.submissionHeader}>
          {isBackButtonAvailable && <BackButton>Back</BackButton>}
          {isCancelAvailable && <CancelButton onCancel={onCancel}>Cancel</CancelButton>}
        </header>
        {
          /link|category|statement/.test(router.route) &&
          <div className={styles.submissionSteps}>
            <div className={classNames(styles.submissionStepItem, { [styles.active]: /link/.test(router.route) })}>
              LINK
            </div>
            <div className={classNames(styles.submissionStepItem, { [styles.active]: /category/.test(router.route) })}>
              CATEGORY
            </div>
            <div className={classNames(styles.submissionStepItem, { [styles.active]: /statement/.test(router.route) })}>
              STATEMENT
            </div>
          </div>
        }
        {children}
        {submitButtonText &&
          <footer className={styles.submissionFooter}>
            <button
              disabled={!isSubmitAvailable}
              onClick={onSubmit}
              className={classNames(
                styles.submissionButton,
                styles.sizeXl,
                { [styles.start]: submitButtonText === "Start" },
                { [styles.disable]: !isSubmitAvailable },
              )}>
              {submitButtonText}
            </button>
          </footer>
        }
      </div>
    </div>
  )
}
