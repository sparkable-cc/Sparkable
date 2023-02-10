import { useState } from 'react';
import styles from './index.module.scss';
import classNames from 'classnames';
import { v4 as uuidv4 } from "uuid";

const options = [
  "Random",
  "Newest First"
];

export const SortsSelect = () => {
  const [isOpen, setOpen] = useState(false);
  const [currentOption, setCurrentOption] = useState("Random")

  const onOptionClick = (value: string) => {
    setCurrentOption(value);
    setOpen(false);
  }

  return (
    <section className={styles.sortWrapper}>
      <div className={classNames(styles.selectWrapper, { [styles.open]: isOpen })} >
        <div className={styles.currentOption} onClick={() => setOpen(!isOpen)}>
          {currentOption}
        </div>
        {isOpen &&
          <ul className={styles.optionsList}>
            {
              options?.filter(item => item !== currentOption).map(item =>
                <li key={uuidv4()} className={styles.option} onClick={() => onOptionClick(item)}>
                  {item}
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