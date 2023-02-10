import { useState } from 'react';
import styles from './index.module.scss';
import classNames from 'classnames';
import { v4 as uuidv4 } from "uuid";
import { UITypes } from '../../types'
import { setSort, selectCurrentSort } from "../../store/UIslice";
import { useAppSelector, useAppDispatch } from "../../store/hooks";

// TO-DO: 
// call to API after sort apply button was clicked

// articles list:
// call to API reshuffle
// load more functionallity

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
  const dispatch = useAppDispatch();
  const currentSort = useAppSelector(selectCurrentSort);

  const onOptionClick = (option: UITypes.Option) => {
    dispatch(setSort(option));
    setOpen(false);
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
      <button className={styles.applyButton}></button>
    </section>
  )
}