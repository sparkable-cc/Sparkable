import { useState, useEffect } from "react";
import { VotingLayout } from "../../../layouts/VotingLayout";
import styles from "../../../styles/Voting.module.scss";
import { useRouter } from "next/router";
import Link from "next/link";
import { VoteItem } from "../../../components/VoteItem";
import { v4 as uuidv4 } from "uuid";
import { checkCredentials } from "../../../utils/checkCredentials";
import { UnloggedMessage } from "../../../components/UnloggedMessage";
import { Select } from "../../../components/Select";
import { UITypes } from "../../../types";
import isEqual from "lodash.isequal";
import { usePrevious } from "../../../utils/usePrevious";


// TO-DO:
// 3. Wire up to the endpoints
// 4. The dummyDuta delete

const dummyData = [
  {
    title: "Instagram has ruined the art world. What now?",
    uuid: "3106e200-3c99-427f-9af0-eea48cfc9c7f",
    link: "artsoftheworkingclass.org",
    image: "https://picsum.photos/id/1/200/300",
  },
  {
    title: "Decentralized Social Networks vs the Trolls",
    uuid: "6f813f1e-44b3-412e-9b16-f6ee137179dc",
    link: "artsoftheworkingclass.org",
    image: "https://picsum.photos/id/2/200/300",
  },
  {
    title: "Anarchism Is A Blanket Fortress",
    uuid: "67b9b0f9-5414-40cf-aa8b-b76eece9bd8f",
    link: "artsoftheworkingclass.org",
    image: "https://picsum.photos/id/3/200/300",
  },
  {
    title: "Learning Styles Don’t Exist",
    uuid: "1e5ac559-70ee-4d24-8dfa-ed71359d748c",
    link: "artsoftheworkingclass.org",
    image: "https://picsum.photos/id/4/200/300",
  },
  {
    title: "Lorem ipsum dolor sit amet.",
    uuid: "1c7e18f0-a6ca-47ee-86a5-67b558d65fcb",
    link: "artsoftheworkingclass.org",
    image: "https://picsum.photos/id/5/200/300",
  },
];

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
              <span className={styles.viewedCounter}>6 viewed submissions</span>
              <Select
                options={options}
                selectedOption={currentSort}
                isBordered
                isApplyButtonVisible={previousSort && !isEqual(previousSort, currentSort)}
                onApply={onApplySort}
                onSelect={setCurrentSort}
              />
            </div>
            <section className="">
              {
                dummyData?.map(item => (
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
