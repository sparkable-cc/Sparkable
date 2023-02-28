import { useState, FormEvent, useCallback, useEffect } from "react";
import { CreateSubmissionLayout } from "../../../layouts/CreateSubmissionLayout";
import styles from "../../../styles/Submission.module.scss";
import { useRouter } from "next/router";
import { FormInput } from "../../../components/FormInput";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { setLink, selectLink, setLinkData, selectLinkData } from "../../../store/submissionSlice";
import { useLazyPostLinkPreviewQuery } from "../../../store/api/submissionApi";
import debounce from "lodash/debounce";
import { LinkPreview } from "../../../components/LinkPreview";
import { ModalNote } from "../../../components/ModalNote";
import Link from "next/link";
import { storageKeys } from "../../../utils/storageKeys";
import { toast } from "react-toastify";
import { checkCredentials } from "../../../utils/checkCredentials";
import { UnloggedMessage } from "../../../components/UnloggedMessage";

const CreateSubmissionLink = () => {
  const link = useAppSelector(selectLink);
  const linkData = useAppSelector(selectLinkData);
  const [ value, setValue ] = useState(link);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [ isLogged, setLogged ] = useState(false);
  const [ triggerPostLinkPreview, { isFetching }] = useLazyPostLinkPreviewQuery();

  const onButtonClick = () => {
    router.push("/submission/create/category");
  };

  const debounceSetLink = (value) => {
    dispatch(setLink(value));
    sessionStorage.setItem(storageKeys.submissionLink, value);

    const request = triggerPostLinkPreview(value);

    request.then((res: any) => {
      if(res.data){
        dispatch(setLinkData(res.data));
        sessionStorage.setItem(storageKeys.submissionLinkData, JSON.stringify(res.data));
      }
      if (res?.error) {
        toast.error(res?.error?.data?.message);
      }
    });

    setTimeout(() => request?.abort(), 3000);
  };

  const debouncedHandler = useCallback(debounce(debounceSetLink, 1000), []);

  const onInputChange = (event: FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setValue(value);
    debouncedHandler(value);
  };

  const onInputClear = () => {
    dispatch(setLinkData(null));
    dispatch(setLink(value));
    setValue("");
  };

  const isPreviewAvailable = (): boolean => {
    if (value && linkData) return true;

    else {
      return false;
    }
  };

  useEffect(() => {
    if (link) {
      debounceSetLink(link);
    }
  }, []);

  useEffect(() => {
    if (checkCredentials()) {
      setLogged(true);
    }
  }, [linkData]);


  return (
    <CreateSubmissionLayout
      submitButtonText="Continue"
      onSubmit={onButtonClick}
      isSubmitAvailable={isPreviewAvailable()}
      isCancelAvailable
    >
      {
        isLogged ?
          <>
            <FormInput
              value={value}
              id="link"
              name="link"
              label="Paste your link here:"
              placeholder="https://www.site.com"
              onChange={onInputChange}
              onClear={onInputClear}
              errorMessage=""
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
                  isLoading={isFetching}
                  site={linkData?.ogUrl}
                  title={linkData?.ogTitle}
                  description={linkData?.ogDescription}
                  image={linkData?.ogImage[0]?.url}
                />
              </div>
            </div>
          </> :
          <UnloggedMessage />
      }

    </CreateSubmissionLayout>
  );
};

export default CreateSubmissionLink;
