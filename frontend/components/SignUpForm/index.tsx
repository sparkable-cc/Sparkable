import { useState, FormEvent, useEffect } from "react";
import styles from "./index.module.scss";
import Link from "next/link";
import { FormInput } from "../FormInput";
import classNames from "classnames";
import { useLazySignUpQuery } from "../../store/api";
import { ApiTypes } from "../../types";
import { Spiner } from "../Spiner";
import { signUpSchema, validationInitialState } from "../../utils/validations";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const inputValuesInitialState = {
  username: "",
  email: "",
  password: "",
};

export const SignUpForm = () => {
  const [ triggerSignUp, { isLoading, data }] = useLazySignUpQuery();
  const [ inputValues, setInputValues ] = useState<ApiTypes.Req.SignUp>(inputValuesInitialState);
  const [ validationError, setValidationError ] = useState(validationInitialState);
  const router = useRouter();

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
    const validationResult = signUpSchema.validate(inputValues);

    if (validationResult.error) {
      const error = validationResult?.error?.details[0];

      setValidationError({
        field: error?.path[0] as string,
        message: error?.message
      });

    } else {
      setValidationError(validationInitialState);

      try {
        triggerSignUp(inputValues).then((res: any) => {
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
    if (data?.message) {
      setInputValues(inputValuesInitialState);
      toast.success(data?.message);
      setTimeout(() => {
        router.push("/auth/signin");
      }, 2500);
    }
  }, [data?.message]);

  return (
    <form className={styles.authForm} onSubmit={onSubmit}>
      <header className={styles.authHeader}>
        <h2 className={styles.authTitle}>Create Account</h2>
        <div className={styles.authNavWrapper}>
          <span className="">or</span>
          <Link className={styles.authButtonLink} href="/auth/signin">Signin</Link>
        </div>
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
          errorMessage={validationError.field === "email" ? validationError.message : ""}
        />
        <FormInput
          value={inputValues.username}
          id="username"
          name="username"
          label="Username"
          placeholder="Choose a username"
          onChange={onInputChange}
          onClear={onInputClear}
          errorMessage={validationError.field === "username" ? validationError.message : ""}
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
      </div>
      <footer className={styles.authFooter}>
        <button
          disabled={isLoading}
          onClick={onSubmit}
          className={classNames(styles.submitButton, styles.sizeXl)}
        >
          {isLoading ? <Spiner color="#fff" sizeWidth="25" /> : "Create account"}
        </button>
        <div className={styles.footerText}>
          Click “Create account” to agree to the <Link href="/" className={styles.authLink}>Terms of Use</Link> of
          Sparkable and acknowledge that the <Link href="/" className={styles.authLink}>Privacy Policy</Link> of
          Sparkable applies to you.
        </div>
      </footer>
    </form>
  );
};
