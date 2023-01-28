import { useState, FormEvent } from "react";
import styles from "./index.module.scss";
import Link from "next/link";
import { FormInput } from "../FormInput";
import classNames from "classnames";

export const PasswordRecoveryForm = () => {
  const [inputValues, setInputValues] = useState({
    email: "",
  });

  const onInputChange = (event: FormEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;

    setInputValues(prevState => {
      return { ...prevState, [name]: value };
    });
  };

  const onInputClear = (name: string) => {
    setInputValues(prevState => {
      return { ...prevState, [name]: "" };
    });
  };

  return (
    <form className={styles.authForm}>
      <header className={styles.authHeader}>
        <h2 className={styles.authTitle}>Recover Your Password</h2>
      </header>
      <div className={styles.authFields}>
        <FormInput
          value={inputValues.email}
          id="email"
          name="email"
          label="Email"
          placeholder="Your email address"
          onChange={onInputChange}
          onClear={onInputClear}
        // errorMessage="This email address is not valid. Please check for spelling errors and try again."
        />
      </div>
      <footer className={styles.authFooter}>
        <button
          disabled
          className={classNames(styles.submitButton, styles.sizeXl, styles.disable)}
        >
          Reset password
        </button>
      </footer>
    </form>
  );
};
