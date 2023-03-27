import { PropsWithChildren } from 'react';
import { BackButton } from '../../components/BackButton';
import styles from './index.module.scss';
import classNames from 'classnames';

interface Props extends PropsWithChildren {
  onSubmit?: () => void
  isSubmitAvailable?: boolean
  isBackButtonAvailable?: boolean
  submitButtonText?: string
}

export const VotingLayout = ({
  children,
  submitButtonText,
  isSubmitAvailable,
  isBackButtonAvailable = true,
  onSubmit,
}: Props) => {

  return (
    <div className={classNames(styles.createWrapper)}>
      <div className={styles.votingWrapper}>
        <header className={styles.votingHeader}>
          {isBackButtonAvailable && <BackButton>Back</BackButton>}
        </header>
        {children}
        {submitButtonText &&
          <footer className={styles.votingFooter}>
            <button
              disabled={!isSubmitAvailable}
              onClick={onSubmit}
              className={classNames(
                styles.votingButton,
                styles.sizeXl,
                { [styles.start]: submitButtonText === "Start"},
                { [styles.disable]: !isSubmitAvailable },
              )}
              >
              {submitButtonText}
            </button>
          </footer>
        }
      </div>
    </div>
  )
}
