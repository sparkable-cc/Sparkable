import { useState, FormEvent } from "react";
import styles from "./index.module.scss";
import { FormInput } from "../FormInput";
import classNames from "classnames";
import { useLazyPasswordRecoveryQuery } from "../../store/api/authApi";
import { passwordRecoverySchema, validationInitialState } from "../../utils/validations";
import { toast } from "react-toastify";

const inputValuesInitialState = {
  email: "",
};

export const PasswordRecoveryForm = () => {
  const [inputValues, setInputValues] = useState({
    email: "",
  });
  const [validationError, setValidationError] = useState(validationInitialState);
  const [triggerPasswordRecovery, { isLoading, data }] = useLazyPasswordRecoveryQuery();

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
    const validationResult = passwordRecoverySchema.validate(inputValues);

    if (validationResult.error) {
      const error = validationResult?.error?.details[0];

      setValidationError({
        field: error?.path[0] as string,
        message: error?.message
      });

    } else {
      setValidationError(validationInitialState);
      try {
        triggerPasswordRecovery(inputValues).then((res: any) => {
          if (res?.error) {
            toast.error(res?.error?.data?.message);
          } else {
            toast.success(res?.data?.message);
            setInputValues(inputValuesInitialState);
          }
        });
      } catch (error: any) {
        toast.error(error?.message);
      }
    }
  }

  return (
    <form className={styles.authForm} onSubmit={onSubmit}>
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
