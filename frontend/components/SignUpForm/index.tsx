import styles from './index.module.scss';
import Link from 'next/link';
import { FormInput } from '../FormInput';
import classNames from 'classnames';

export const SignUpForm = () => {
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
          value=""
          id="email"
          label="Email"
          placeholder="Enter your email"
          onChange={() => { }}
        />
        <FormInput
          value=""
          id="username"
          label="Username"
          placeholder="Enter your username"
          onChange={() => { }}
        />
        <FormInput
          type="password"
          value=""
          id="password"
          label="Password"
          placeholder="Enter your password"
          onChange={() => { }}
        />
      </div>
      <footer className={styles.formFooter}>
        <button className={classNames(styles.submitButton, styles.sizeXl)}>Create account</button>
        <div className={styles.footerText}>
          Click “Create account” to agree to the <Link href="/" className={styles.footerLink}>Terms of Use</Link> of
          Sparkable and acknowledge that the <Link href="/" className={styles.footerLink}>Privacy Policy</Link> of
          Sparkable applies to you.
        </div>
      </footer>
    </form>
  )
}