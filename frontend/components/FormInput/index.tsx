
import styles from "./index.module.scss";
import { FormEvent } from "react";
import classNames from "classnames";

interface Props {
  type?: string;
  value: string
  id: string;
  name: string
  label: string;
  placeholder: string;
  errorMessage?: string;
  onChange: (event: FormEvent<HTMLInputElement>) => void;
  onClear: (name: string) => void;
}

export const FormInput = ({
  type = "text",
  value,
  id,
  name,
  label,
  placeholder,
  errorMessage,
  onChange,
  onClear,
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
        <span className={classNames(styles.clearInput, {[styles.hidden]: !value})} onClick={() => onClear(name)} />
      </div>
      {errorMessage &&
        <div className={styles.errorMessage}>
          {errorMessage}
        </div>}
    </div>
  );
};
