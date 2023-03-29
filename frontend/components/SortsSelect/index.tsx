import { useState } from "react";
import styles from "./index.module.scss";
import { UITypes } from "../../types";
import { setSort, selectSort } from "../../store/UIslice";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import isEqual from "lodash.isequal";
import { Select } from "../Select";

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

interface Props {
  isForcedMobile?: boolean
}

export const SortsSelect = ({ isForcedMobile }: Props) => {
  const sort = useAppSelector(selectSort);
  const [currentSort, setCurrentSort] = useState(sort);
  const dispatch = useAppDispatch();

  const onApply = () => {
    dispatch(setSort(currentSort));
  };

  return (
    <div className={styles.selectWrapper}>
      <Select
        options={options}
        isForcedMobile={isForcedMobile}
        selectedOption={currentSort}
        isApplyButtonVisible={!isEqual(sort, currentSort)}
        onSelect={setCurrentSort}
        onApply={onApply}
      />
    </div>
  );
};
