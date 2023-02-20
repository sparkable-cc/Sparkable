import { useState, FormEvent, useCallback } from "react";
import { CreateSubmissionLayout } from "../../../layouts/CreateSubmissionLayout";
import styles from '../../../styles/Submission.module.scss';
import { useRouter } from "next/router";
import { FormInput } from "../../../components/FormInput";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { setLink, selectLink } from "../../../store/submissionSlice";


const CreateSubmissionCategory = () => {
  // const link = useAppSelector(selectLink)
  // const [value, setValue] = useState(link);
  // const dispatch = useAppDispatch();
  const router = useRouter();

  const onButtonClick = () => {
    router.push("/submission/create/statement")
  }

  const onInputChange = (event: FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    // setValue(value);
  };

  const onInputClear = () => {
    // dispatch(setLink(value))
    // setValue("");
  }

  return (
    <CreateSubmissionLayout
      submitButtonText="Continue"
      onSubmit={onButtonClick}
      isSubmitAvailable={true}
      isCancelAvailable={true}
    >
      <div className={styles.categoryDescription}>
        Please pick at least one category. This helps others find your content.
        None of the categories fit? Choose “Other” and suggest a new category.
      </div>
      <header className={styles.categoryHeader}>
        Categories
      </header>
      <FormInput
        value={""}
        id="suggestion"
        name="suggestion"
        label=""
        placeholder="Suggest a category"
        onChange={onInputChange}
        onClear={onInputClear}
        errorMessage={""}
      />
    </CreateSubmissionLayout>
  )
}

export default CreateSubmissionCategory;


export async function getStaticProps() {
  return {
    props: {
      protected: true,
    },
  }
}