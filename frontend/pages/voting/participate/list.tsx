import { useState, useEffect } from "react";
import { VotingLayout } from "../../../layouts/VotingLayout";
import styles from "../../../styles/Voting.module.scss";
import { useRouter } from "next/router";
import Link from "next/link";
import { VoteItem } from "../../../components/VoteItem";
import { v4 as uuidv4 } from "uuid";
import { checkCredentials } from "../../../utils/checkCredentials";
import { UnloggedMessage } from "../../../components/UnloggedMessage";
// import { Select } from "../../../components/Select";
import { UITypes } from "../../../types";
// import isEqual from "lodash.isequal";
import { usePrevious } from "../../../utils/usePrevious";
import { useLazyGetLinksInCurrentCycleQuery } from "../../../store/api/votingApi";
import { storageKeys } from "../../../utils/storageKeys";
import { Spiner } from "../../../components/Spiner";

const options: UITypes.SortOption[] = [
  {
    label: "Random",
    value: "random",
  },
  {
    label: "Newest First",
    value: "newest-first",
  },
];

const VotingList = () => {
  const [ selectedIds, selectId ] = useState([]);
  const router = useRouter();
  const [ isLogged, setLogged ] = useState(false);
  const [ currentSort, setCurrentSort ] = useState<UITypes.SortOption>({
    label: "Newest First",
    value: "newest-first",
  });

  const [ triggerGetLinksInCurrentCycle, { isLoading, data }] = useLazyGetLinksInCurrentCycleQuery();

  const previousSort: UITypes.SortOption | undefined = usePrevious(currentSort);

  const onSelectItem = (id: string) => {
    if (selectedIds?.some(item => item === id)) {
      selectId(selectedIds.filter(item => item !== id));
    } else {
      selectId([ ...selectedIds, ...[id as never] ]);
    }
  };

  const checkIsSelected = (id: string): boolean => {
    return selectedIds?.some(item => item === id) ? true : false;
  };

  const onApplySort = () => {
    // sending request here
  };

  const onSubmit = () => {
    // sending request here
    router.push("/voting/participate/result");
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
      onSubmit={onSubmit}
      buttonCounter={selectedIds.length}
    >
      {
        isLogged ?
          <>
            <h2 className={styles.title}>Time to vote!</h2>
            <p className={styles.text}>Which of these submissions did you find insightful?</p>
            <p className={styles.text}>You have 7 votes, but you don’t have to use all of them.</p>
            <div className={styles.listHeader}>
              <span className={styles.viewedCounter}>{data?.length || 0} viewed submissions</span>
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
    </VotingLayout>
  );
};

export default VotingList;
