import { useState, useEffect } from "react";
import { VotingLayout } from "../../../layouts/VotingLayout";
import styles from "../../../styles/Voting.module.scss";
import { useRouter } from "next/router";
import Link from "next/link";
import { VoteItem } from "../../../components/VoteItem";
import { v4 as uuidv4 } from "uuid";
import { checkCredentials } from "../../../utils/checkCredentials";
import { UnloggedMessage } from "../../../components/UnloggedMessage";
import { useLazyGetLinksInCurrentCycleQuery, useLazyCreateVotesQuery } from "../../../store/api/votingApi";
import { storageKeys } from "../../../utils/storageKeys";
import { Spiner } from "../../../components/Spiner";
import { toast } from "react-toastify";
import { ModalNote } from "../../../components/ModalNote";
import { ModalLayout } from "../../../layouts/ModalLayout";
import classNames from "classnames";

// import { UITypes } from "../../../types";
// import { Select } from "../../../components/Select";
// import isEqual from "lodash.isequal";
// import { usePrevious } from "../../../utils/usePrevious";

// const options: UITypes.SortOption[] = [
//   {
//     label: "Random",
//     value: "random",
//   },
//   {
//     label: "Newest First",
//     value: "newest-first",
//   },
// ];

const VotingList = () => {
  const [ selectedIds, selectId ] = useState([]);
  const router = useRouter();
  const [ isLogged, setLogged ] = useState(false);
  const [ isSubmitAlertVisible, setSubmitAlert ] = useState(false);
  const [ triggerGetLinksInCurrentCycle, { isLoading, data }] = useLazyGetLinksInCurrentCycleQuery();
  const [ triggerCreateVotes, createVotesResult ] = useLazyCreateVotesQuery();

  // const [currentSort, setCurrentSort] = useState<UITypes.SortOption>({
  //   label: "Newest First",
  //   value: "newest-first",
  // });

  // const previousSort: UITypes.SortOption | undefined = usePrevious(currentSort);

  // const onApplySort = () => {
  //   // sending request here
  // };

  const onSelectItem = (id: string) => {
    if (selectedIds?.some(item => item === id)) {
      selectId(selectedIds.filter(item => item !== id));
    } else {
      selectId([ ...selectedIds, ...[id as never] ]);
    }
  };

  const onCancel = () => {
    setSubmitAlert(false);
  };

  const checkIsSelected = (id: string): boolean => {
    return selectedIds?.some(item => item === id) ? true : false;
  };

  const onSubmit = () => {
    const userId = sessionStorage.getItem(storageKeys.userId);
    setSubmitAlert(false);

    if (!userId) return;

    const data = {
      userUuid: userId,
      votes: selectedIds?.map(item => {
        return {
          linkUuid: item
        };
      })
    };

    triggerCreateVotes(data).then((res: any) => {
      if (res?.isSuccess) {
        res?.data?.message && toast.success(res?.data?.message);
        router.push("/voting/participate/result");
      }
      if (res?.error) {
        toast.error(res?.error?.data?.message);
      }
    });
  };

  useEffect(() => {
    if (checkCredentials()) {
      setLogged(true);
      const userId = sessionStorage.getItem(storageKeys.userId);
      userId && triggerGetLinksInCurrentCycle(userId);
    }
  }, []);

  return (
    <VotingLayout
      isSubmitAvailable={Boolean(selectedIds.length)}
      submitButtonText="Submit"
      onSubmit={() => setSubmitAlert(true)}
      buttonCounter={selectedIds.length}
    >
      {
        isLogged ?
          <>
            <h2 className={styles.title}>Time to vote!</h2>
            <p className={styles.text}>Which of these submissions did you find insightful?</p>
            <p className={styles.text}>You have 7 votes, but you don’t have to use all of them.</p>
            <div className={styles.listHeader}>
              <div className={styles.viewedCounterWrapper}>
                <span className={styles.viewedCounter}>{data?.length || 0} viewed submissions</span>
                <ModalNote title="Viewed submissions">
                  <div className={styles.modalText}>You can only vote on submissions which you have viewed before.</div>
                  <div className={styles.modalText}>When you open the link of a submission it is counted as a view.</div>
                </ModalNote>
              </div>
              {/* <Select
                options={options}
                selectedOption={currentSort}
                isBordered
                isApplyButtonVisible={previousSort && !isEqual(previousSort, currentSort)}
                onApply={onApplySort}
                onSelect={setCurrentSort}
              /> */}
            </div>
            <section className="">
              {
                isLoading ?
                  <Spiner sizeWidth="30" /> :
                  Boolean(data?.length) && data?.map(item => (
                    <VoteItem
                      {...item}
                      key={uuidv4()}
                      isSelected={checkIsSelected(item.uuid)}
                      onSelect={() => onSelectItem(item.uuid)}
                    />
                  ))
              }
            </section>
            <div className={styles.listTextWrapper}>
              <div className={styles.listText}>
                Your list seems a bit empty?
              </div>
              <div className={styles.listText}>
                These are all the submissions which you’ve viewed so far. To increase your selection, explore more submissions.
              </div>
              <Link
                href="/#explore"
                className={styles.listBackButton}
              >
                Back to Explore
              </Link>
            </div>
          </> :
          <UnloggedMessage />
      }
      <ModalLayout
        title="Submit vote?"
        withTitleIcon
        cancelButtonLabel="Close"
        onCancel={() => setSubmitAlert(false)}
        isVisible={isSubmitAlertVisible}
      >
        <div className={styles.modalText}>You selected {selectedIds?.length} submissions:</div>
        <ul className={styles.modalList}>
          {
            Boolean(data?.length) && data?.filter(item => selectedIds.some(id => id === item.uuid)).map(item => (
              <li className={styles.modalListItem} key={uuidv4()}>
                {item.title}
              </li>
            ))
          }
        </ul>
        <div className={styles.modalText}>You will not be able to change your selection.</div>
        <div className={styles.modalButtonsWrapper}>
          <button
            className={styles.buttonOutlined}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            disabled={createVotesResult.isLoading}
            className={classNames(styles.buttonPrimary)}
            onClick={onSubmit}
          >
              Yes, submit
          </button>
        </div>
      </ModalLayout>
    </VotingLayout>
  );
};

export default VotingList;
