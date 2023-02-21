import classNames from 'classnames';
import { FormEvent } from 'react';
import styles from './index.module.scss';

interface Props {
  type?: string;
  value: string;
  id: string;
  name: string;
  label: string;
  placeholder: string;
  errorMessage?: string;
  onChange: (event: FormEvent<HTMLInputElement>) => void;
  // onClear: (name: string) => void;
  onIconClick: () => void;
}

export const FormInput = ({
  type = 'text',
  value,
  id,
  name,
  label,
  placeholder,
  errorMessage,
  onChange,
  // onClear,
  onIconClick,
}: Props) => {
  return (
    <div className={styles.formInputWrapper}>
      <label className={styles.inputLabel} htmlFor={id}>
        {label}
      </label>
      <div className={styles.imputWrapper}>
        <input
          id={id}
          name={name}
          className={classNames(styles.input, { [styles.error]: errorMessage })}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {value && <span className={styles.eyeIcon} onClick={onIconClick} />}
      </div>
      {errorMessage && (
        <div className={styles.errorMessage}>{errorMessage}</div>
      )}
    </div>
  );
};
