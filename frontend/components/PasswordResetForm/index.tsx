import { useState, FormEvent } from "react";
import styles from "./index.module.scss";
import { FormInput } from "../FormInput";
import classNames from "classnames";
import { useLazyPasswordResetQuery } from "../../store/api/authApi";
import { passwordResetSchema, validationInitialState } from "../../utils/validations";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Link from "next/link";

const inputValuesInitialState = {
  password: "",
};

export const PasswordResetForm = () => {
  const [ inputValues, setInputValues ] = useState({
    password: "",
  });
  const [ validationError, setValidationError ] = useState(validationInitialState);
  const [ triggerPasswordReset, { isLoading }] = useLazyPasswordResetQuery();
  const router = useRouter();
  const { token, userUuid } = router.query;

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

    const data = {
      userUuid,
      token,
      password: inputValues.password
    };

    const validationResult = passwordResetSchema.validate(data);

    if (validationResult.error) {
      const error = validationResult?.error?.details[0];

      setValidationError({
        field: error?.path[0] as string,
        message: error?.message
      });

    } else {
      setValidationError(validationInitialState);
      try {
        triggerPasswordReset(data).then((res: any) => {
          if (res?.error) {
            toast.error(res?.error?.data?.message);
          } else {
            toast.success(res?.data?.message);
            setInputValues(inputValuesInitialState);
            setTimeout(() => {
              router.push("/");
            }, 100);
          }
        });
      } catch (error: any) {
        toast.error(error?.message);
      }
    }
  };

  return (
    <form className={styles.authForm} onSubmit={onSubmit}>
      <header className={styles.authHeader}>
        <h2 className={styles.authTitle}>Reset Password</h2>
        <div className={styles.authNavWrapper}>
          <span>or</span>
          <Link className={styles.authButtonLink} href="/auth/signin">Sign in</Link>
        </div>
      </header>
      <div className={styles.authFields}>
        <FormInput
          value={inputValues.password}
          type="password"
          id="password"
          name="password"
          label="Password"
          placeholder="Your new password"
          onChange={onInputChange}
          onClear={onInputClear}
          errorMessage={validationError.message}
        />
      </div>
      <footer className={styles.authFooter}>
        <button
          disabled={isLoading}
          onClick={onSubmit}
          className={classNames(styles.submitButton, styles.sizeXl)}
        >
          Reset password
        </button>
      </footer>
    </form>
  );
};
