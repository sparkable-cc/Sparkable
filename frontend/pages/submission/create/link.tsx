import { useState, FormEvent, useCallback } from "react";
import { CreateSubmissionLayout } from "../../../layouts/CreateSubmissionLayout";
import styles from '../../../styles/Submission.module.scss';
import { useRouter } from "next/router";
import { FormInput } from "../../../components/FormInput";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { setLink, selectLink } from "../../../store/submissionSlice";
import debounce from 'lodash/debounce';
import { LinkPreview } from '../../../components/LinkPreview';
import { ModalNote } from "../../../components/ModalNote";
import Link from "next/link";
import { storageKeys } from "../../../utils/storageKeys";

const CreateSubmissionLink = () => {
  const link = useAppSelector(selectLink)
  const [value, setValue] = useState(link);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onButtonClick = () => {
    router.push("/submission/create/category")
  }

  const debounceSetLink = (value) => {
    dispatch(setLink(value));
    sessionStorage.setItem(storageKeys.submissionLink, value);
    // TO-DO
    // call to API 
  }

  const debouncedHandler = useCallback(debounce(debounceSetLink, 1000), []);

  const onInputChange = (event: FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setValue(value);
    debouncedHandler(value);
  };

  const onInputClear = () => {
    dispatch(setLink(value))
    setValue("");
  }

  const isPreviewAvailable = (): boolean => {
    if (value) return true;

    // TO-DO
    // check is link preview available 

    else {
      return false;
    }
  }

  return (
    <CreateSubmissionLayout
      submitButtonText="Continue"
      onSubmit={onButtonClick}
      isSubmitAvailable={isPreviewAvailable()}
      isCancelAvailable={true}
    >
      <FormInput
        value={value}
        id="link"
        name="link"
        label="Paste your link here:"
        placeholder="https://www.site.com"
        onChange={onInputChange}
        onClear={onInputClear}
        errorMessage={""}
      />
      <div>
        <header className={styles.linkPreviewHeader}>
          <span>Link preview</span>
          <ModalNote title="Link preview">
            <div className={styles.modalText}>We generate the link preview based on each link’s public metadata.</div>
            <div className={styles.modalText}>Something is wrong or not working as expected?</div>
            <div className={styles.modalText}>
              <Link href="/" className={styles.modalLink}>Contact us</Link>
            </div>
          </ModalNote>
        </header>
        <div className={styles.linkPreviewWrapper}>
          <LinkPreview
            isLoading={false}
            site="site.com"
            title="Man simulates time travel thanks to Stable Diffusion image synthesis"
            description="Fictional travelogue shows man taking selfies in ancient Greece, Egypt, and more."
            image="https://picsum.photos/id/103/200/200"
          />
        </div>
      </div>
    </CreateSubmissionLayout>
  )
}

export default CreateSubmissionLink;


export async function getStaticProps() {
  return {
    props: {
      protected: true,
    },
  }
}