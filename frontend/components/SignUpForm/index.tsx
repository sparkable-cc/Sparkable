import { useState, FormEvent } from "react";
import styles from "./index.module.scss";
import Link from "next/link";
import { FormInput } from "../FormInput";
import classNames from "classnames";

export const SignUpForm = () => {
  const [ inputValues, setInputValues ] = useState({
    username: "",
    email: "",
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
    <form>
      <header className={styles.formHeader}>
        <h2 className={styles.formTitle}>Create Account</h2>
        <div className={styles.headerButtonWrapper}>
          <span className="">or</span>
          <Link className={styles.buttonLink} href="/auth/signin">Signin</Link>
        </div>
      </header>
      <div className={styles.formFields}>
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
        <FormInput
          value={inputValues.username}
          id="username"
          name="username"
          label="Username"
          placeholder="Choose a username"
          onChange={onInputChange}
          onClear={onInputClear}
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
      </div>
      <footer className={styles.formFooter}>
        <button
          disabled
          className={classNames(styles.submitButton, styles.sizeXl, styles.disable)}
        >
          Create account
        </button>
        <div className={styles.footerText}>
          Click “Create account” to agree to the <Link href="/" className={styles.footerLink}>Terms of Use</Link> of
          Sparkable and acknowledge that the <Link href="/" className={styles.footerLink}>Privacy Policy</Link> of
          Sparkable applies to you.
        </div>
      </footer>
    </form>
  );
};
