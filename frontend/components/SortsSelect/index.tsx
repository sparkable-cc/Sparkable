import { useState } from 'react';
import styles from './index.module.scss';
import classNames from 'classnames';
import { v4 as uuidv4 } from "uuid";
import { UITypes } from '../../types'
import { setSort, selectSort } from "../../store/UIslice";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import isEqual from "lodash.isequal";

// TO-DO: 
// articles list:
// load more functionallity

// sorts mobile view

const options: UITypes.Option[] = [
  {
    label: "Random",
    value: "random",
  },
  {
    label: "Newest First",
    value: "newest-first",
  },
];

export const SortsSelect = () => {
  const [isOpen, setOpen] = useState(false);
  const sort = useAppSelector(selectSort);
  const [currentSort, setCurrentSort] = useState(sort);
  const dispatch = useAppDispatch();

  const onOptionClick = (option: UITypes.Option) => {
    setCurrentSort(option)
    setOpen(false);
  }

  const onApply = () => {
    dispatch(setSort(currentSort));
  }

  return (
    <section className={styles.sortWrapper}>
      <div className={classNames(styles.selectWrapper, { [styles.open]: isOpen })} >
        <div className={styles.currentOption} onClick={() => setOpen(!isOpen)}>
          {currentSort.label}
        </div>
        {isOpen &&
          <ul className={styles.optionsList}>
            {
              options?.filter(item => item.value !== currentSort.value).map(item =>
                <li key={uuidv4()} className={styles.option} onClick={() => onOptionClick(item)}>
                  {item.label}
                </li>
              )
            }
          </ul>
        }
      </div>
      {
        !isEqual(sort, currentSort) &&
        <button className={styles.applyButton} onClick={onApply} />
      }
    </section>
  )
}