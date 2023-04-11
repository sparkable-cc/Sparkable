import { useState } from "react";
import styles from "./index.module.scss";
import classNames from "classnames";
import { v4 as uuidv4 } from "uuid";
import { UITypes } from "../../types";

interface Props {
  isForcedMobile?: boolean,
  options: UITypes.SortOption[],
  isApplyButtonVisible?: boolean
  selectedOption: UITypes.SortOption,
  isBordered?: boolean,
  onSelect: (option: UITypes.SortOption) => void,
  onApply: () => void,
}

export const Select = ({
  isForcedMobile,
  options,
  selectedOption,
  isApplyButtonVisible,
  isBordered,
  onSelect,
  onApply
}: Props) => {
  const [ isOpen, setOpen ] = useState(false);

  const onOptionClick = (option: UITypes.SortOption) => {
    onSelect(option);
    setOpen(false);
  };

  return (
    <div className={styles.selectContainer}>
      <section className={classNames(styles.selectWrapper, { [styles.forcedMobile]: isForcedMobile })}>
        <div className={classNames(styles.select, {
          [styles.open]: isOpen,
          [styles.rounded]: isBordered,
        })}
        >
          <div className={styles.currentOption} onClick={() => setOpen(!isOpen)}>
            {selectedOption.label}
          </div>
          {isOpen &&
            <ul className={styles.optionsList}>
              {
                options?.filter(item => item.value !== selectedOption.value).map(item =>
                  <li key={uuidv4()} className={styles.option} onClick={() => onOptionClick(item)}>
                    {item.label}
                  </li>
                )
              }
            </ul>
          }
        </div>
        {
          isApplyButtonVisible && <button className={styles.applyButton} onClick={onApply} />
        }
      </section>
    </div>
  );
};
