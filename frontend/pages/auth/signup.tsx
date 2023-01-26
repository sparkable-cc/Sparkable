import type { NextPage } from "next";
import { AuthLayout } from "../../layouts/AuthLayout";
import { SignUpForm } from '../../components/SignUpForm';

const SignUp: NextPage = () => {

  return (
    <AuthLayout>
      <SignUpForm />
    </AuthLayout>
  )
}

export default SignUp;