import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useLazySignInQuery } from '../../store/api';
import { signInSchema, validationInitialState } from '../../utils/validations';
import { FormInput } from '../FormInput';
import { Spiner } from '../Spiner';
import styles from './index.module.scss';

const inputValuesInitialState = {
  login: '',
  password: '',
};

export const SignInForm = () => {
  const [triggerSignIn, { isLoading, data }] = useLazySignInQuery();
  const [validationError, setValidationError] = useState(
    validationInitialState,
  );
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();

  const [inputValues, setInputValues] = useState({
    login: '',
    password: '',
  });

  const onInputChange = (event: FormEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;

    setInputValues((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const onInputClear = (name: string) => {
    setInputValues((prevState) => {
      return { ...prevState, [name]: '' };
    });
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const validationResult = signInSchema.validate(inputValues);

    if (validationResult.error) {
      const error = validationResult?.error?.details[0];

      setValidationError({
        field: error?.path[0] as string,
        message: error?.message,
      });
    } else {
      setValidationError(validationInitialState);

      try {
        triggerSignIn({
          password: inputValues.password,
          [inputValues.login.includes('@') ? 'email' : 'username']:
            inputValues.login,
        }).then((res: any) => {
          if (res?.error) {
            toast.error(res?.error?.data?.message);
          }
        });
      } catch (error: any) {
        toast.error(error?.message);
      }
    }
  };

  useEffect(() => {
    if (data) {
      setInputValues(inputValuesInitialState);
      toast.success('Authorized successfully!');
      sessionStorage.setItem('token', JSON.stringify(data.access_token));
      sessionStorage.setItem('token-expires', JSON.stringify(data.expires_in));
      setTimeout(() => {
        router.push('/');
      }, 2500);
    }
  }, [data]);

  return (
    <form className={styles.authForm} onSubmit={onSubmit}>
      <header className={styles.authHeader}>
        <h2 className={styles.authTitle}>Sign In</h2>
        <div className={styles.authNavWrapper}>
          <span>or</span>
          <Link className={styles.authButtonLink} href="/auth/signup">
            Create a new account
          </Link>
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
          errorMessage={
            validationError.field === 'login' ? validationError.message : ''
          }
        />
        <FormInput
          // type="password"
          type={isPasswordVisible ? 'text' : 'password'}
          value={inputValues.password}
          name="password"
          id="password"
          label="Password"
          placeholder="Choose a secure password"
          onChange={onInputChange}
          onClear={onInputClear}
          onClick={togglePasswordVisibility}
          errorMessage={
            validationError.field === 'password' ? validationError.message : ''
          }
        />
        <Link href="/auth/password-recovery" className={styles.authLink}>
          Forgot your password?
        </Link>
      </div>
      <footer className={styles.authFooter}>
        <button
          disabled={isLoading}
          onClick={onSubmit}
          className={classNames(styles.submitButton, styles.sizeXl)}
        >
          {isLoading ? <Spiner color="#fff" sizeWidth="25" /> : 'Sign In'}
        </button>
      </footer>
    </form>
  );
};
