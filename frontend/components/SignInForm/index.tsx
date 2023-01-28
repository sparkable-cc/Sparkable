import { useState, FormEvent } from "react";
import styles from "./index.module.scss";
import Link from "next/link";
import { FormInput } from "../FormInput";
import classNames from "classnames";

export const SignInForm = () => {
  const [inputValues, setInputValues] = useState({
    login: "",
    password: "",
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
        <h2 className={styles.authTitle}>Sign In</h2>
        <div className={styles.authNavWrapper}>
          <span>or</span>
          <Link className={styles.authButtonLink} href="/auth/signup">Create a new account</Link>
        </div>
      </header>
      <div className={styles.authFields}>
        <FormInput
          value={inputValues.login}
          id="login"
          name="login"
          label="Username or email"
          placeholder="Your username or email"
          onChange={onInputChange}
          onClear={onInputClear}
        // errorMessage="This email address is not valid. Please check for spelling errors and try again."
        />
        <FormInput
          type="password"
          value={inputValues.password}
          name="password"
          id="password"
          label="Password"
          placeholder="Choose a secure password"
          onChange={onInputChange}
          onClear={onInputClear}
        />
        <Link href="/auth/password-recovery" className={styles.authLink}>Forgot your password?</Link>
      </div>
      <footer className={styles.authFooter}>
        <button
          disabled
          className={classNames(styles.submitButton, styles.sizeXl, styles.disable)}
        >
          Sign In
        </button>
      </footer>
    </form>
  );
};
