import type { NextPage } from "next";
import { AuthLayout } from "../../layouts/AuthLayout";
import { PasswordRecoveryForm } from '../../components/PasswordRecoveryForm';

const SignUp: NextPage = () => {

  return (
    <AuthLayout>
      <PasswordRecoveryForm />
    </AuthLayout>
  );
};

export default SignUp;
