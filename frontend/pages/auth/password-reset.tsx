import type { NextPage } from "next";
import { AuthLayout } from "../../layouts/AuthLayout";
import { PasswordResetForm } from "../../components/PasswordResetForm/";

const SignUp: NextPage = () => {

  return (
    <AuthLayout isCancelButton isBackButton={false}>
      <PasswordResetForm />
    </AuthLayout>
  );
};

export default SignUp;
