import { useState, FormEvent, useCallback, useEffect } from "react";
import { CreateSubmissionLayout } from "../../../layouts/CreateSubmissionLayout";
import styles from '../../../styles/Submission.module.scss';
import { useRouter } from "next/router";
import { FormInput } from "../../../components/FormInput";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { setLink, selectLink, setLinkData } from "../../../store/submissionSlice";
import { useLazyPostLinkPreviewQuery } from "../../../store/api/submissionApi";
import debounce from 'lodash/debounce';
import { LinkPreview } from '../../../components/LinkPreview';
import { ModalNote } from "../../../components/ModalNote";
import Link from "next/link";
import { storageKeys } from "../../../utils/storageKeys";
import { toast } from "react-toastify";

const CreateSubmissionLink = () => {
  const link = useAppSelector(selectLink)
  const [value, setValue] = useState(link);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [triggerPostLinkPreview, { isLoading, data }] = useLazyPostLinkPreviewQuery();

  const onButtonClick = () => {
    router.push("/submission/create/category")
  }

  const debounceSetLink = (value) => {
    dispatch(setLink(value));
    sessionStorage.setItem(storageKeys.submissionLink, value);

    try {
      triggerPostLinkPreview(value).then((res: any) => {
        if (res?.error) {
          toast.error(res?.error?.data?.message);
        }
      });
    } catch (error: any) {
      toast.error(error?.message);
    }
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
    if (value && data) return true;

    else {
      return false;
    }
  }

  useEffect(() => {
    if (link) {
      debounceSetLink(link)
    }
  }, [])

  useEffect(()=>{
    if(data){
      setLinkData(data);
      sessionStorage.setItem(storageKeys.submissionLinkData, JSON.stringify(data));
    }
  }, [data])

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
            isLoading={isLoading}
            site={data?.ogUrl}
            title={data?.ogTitle}
            description={data?.ogDescription}
            image={data?.ogImage[0]?.url}
          />
        </div>
      </div>
    </CreateSubmissionLayout>
  )
}

export default CreateSubmissionLink;