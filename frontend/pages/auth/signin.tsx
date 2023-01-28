import type { NextPage } from "next";
import { AuthLayout } from "../../layouts/AuthLayout";
import { SignInForm } from "../../components/SignInForm";

const SignUp: NextPage = () => {

  return (
    <AuthLayout>
      <SignInForm />
    </AuthLayout>
  );
};

export default SignUp;
