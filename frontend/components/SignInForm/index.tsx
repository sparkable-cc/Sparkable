import { useState, FormEvent, useEffect } from "react";
import styles from "./index.module.scss";
import Link from "next/link";
import { FormInput } from "../FormInput";
import classNames from "classnames";
import { useLazySignInQuery } from "../../store/api/authApi";
import { setUserName } from "../../store/UIslice";
import { useAppDispatch } from "../../store/hooks";
import { Spiner } from "../Spiner";
import { signInSchema, validationInitialState } from "../../utils/validations";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { storageKeys } from "../../utils/storageKeys";

const inputValuesInitialState = {
  login: "",
  password: "",
};

export const SignInForm = () => {
  const [ triggerSignIn, { isLoading, data }] = useLazySignInQuery();
  const [ validationError, setValidationError ] = useState(validationInitialState);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [ inputValues, setInputValues ] = useState({
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

  const onSubmit = (event) => {
    event.preventDefault();
    const validationResult = signInSchema.validate(inputValues);

    if (validationResult.error) {
      const error = validationResult?.error?.details[0];

      setValidationError({
        field: error?.path[0] as string,
        message: error?.message
      });

    } else {
      setValidationError(validationInitialState);

      try {
        triggerSignIn({
          password: inputValues.password,
          [inputValues.login.includes("@") ? "email" : "username"]: inputValues.login
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
      toast.success("Authorized successfully!");
      sessionStorage.setItem(storageKeys.token, data.access_token);
      sessionStorage.setItem(storageKeys.tokenExpires, data.expires_in);
      sessionStorage.setItem(storageKeys.userId, data.uuid);
      sessionStorage.setItem(storageKeys.userName, data.username);
      dispatch(setUserName(data.username));
      setTimeout(() => {
        router.push("/");
      }, 100);
    }

  }, [data]);

  return (
    <form className={styles.authForm} onSubmit={onSubmit}>
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
          errorMessage={validationError.field === "login" ? validationError.message : ""}
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
          errorMessage={validationError.field === "password" ? validationError.message : ""}
        />
        <Link href="/auth/password-recovery" className={styles.authLink}>Forgot your password?</Link>
      </div>
      <footer className={styles.authFooter}>
        <button
          disabled={isLoading}
          onClick={onSubmit}
          className={classNames(styles.submitButton, styles.sizeXl)}
        >
          {isLoading ? <Spiner color="#fff" sizeWidth="25" /> : "Sign In"}
        </button>
      </footer>
    </form>
  );
};
