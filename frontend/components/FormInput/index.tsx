
import styles from './index.module.scss';
import { FormEvent } from 'react';

interface Props {
  type?: string;
  value: string
  id: string;
  label: string;
  placeholder: string;
  errorMessage?: string;
  onChange: (event: FormEvent<HTMLInputElement>) => void;
}

export const FormInput = ({
  type = "text",
  value,
  id,
  label,
  placeholder,
  errorMessage,
  onChange,
}: Props) => {

  return (
    <div className={styles.formInputWrapper}>
      <label className={styles.inputLabel} htmlFor={id}>
        {label}
      </label>
      <div className={styles.imputWrapper}>
        <input
          id={id}
          className={styles.input}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      {/* <span className={styles.clearInput} /> */}
      </div>
      {errorMessage && errorMessage}
    </div>
  )
}