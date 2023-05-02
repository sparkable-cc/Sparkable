
import styles from "./index.module.scss";
import { FormEvent } from "react";
import classNames from "classnames";
import { useState } from "react";

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
  const [ isPasswordVisible, setPaswordVisible ] = useState(false);

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
          type={type === "password" ? isPasswordVisible ? "text" : "password" : "text"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {
          type !== "password" ?
            <span
              className={classNames(styles.clearInput, { [styles.hidden]: !value })}
              onClick={() => onClear(name)}
            /> :
            <span
              className={classNames(
                styles.eye,
                {
                  [styles.eyeOpen]: !isPasswordVisible,
                  [styles.eyeClose]: isPasswordVisible,
                })} onClick={() => setPaswordVisible(!isPasswordVisible)}
            />
        }
      </div>
      {errorMessage &&
        <div className={styles.errorMessage}>
          {errorMessage}
        </div>}
    </div>
  );
};
