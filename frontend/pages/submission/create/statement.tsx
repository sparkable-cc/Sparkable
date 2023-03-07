import { FormEvent, useCallback, useState, useEffect } from "react";
import { CreateSubmissionLayout } from "../../../layouts/CreateSubmissionLayout";
import styles from "../../../styles/Submission.module.scss";
import { useRouter } from "next/router";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import debounce from "lodash/debounce";
import { storageKeys } from "../../../utils/storageKeys";
import { checkCredentials } from "../../../utils/checkCredentials";
import { useLazyPostLinksQuery } from "../../../store/api/submissionApi";
import { ApiTypes } from "../../../types";
import { toast } from "react-toastify";
import {
  selectYourStatement,
  setYourStatement,
  selectCategories,
  selectSuggestedCategory,
  selectLinkData,
  resetSubmission,
  selectLink
} from "../../../store/submissionSlice";


const CreateSubmissionStatement = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const yourStatement = useAppSelector(selectYourStatement);
  const [ value, setValue ] = useState(yourStatement);
  const [ errorMessage, setErrorMessage ] = useState("");

  const activeCategories = useAppSelector(selectCategories);
  const suggestedCategory = useAppSelector(selectSuggestedCategory);
  const linkData = useAppSelector(selectLinkData);
  const link = useAppSelector(selectLink);

  const [ triggerPostLinks, { isLoading, data }] = useLazyPostLinksQuery();

  const debounceSetLink = (value) => {
    dispatch(setYourStatement(value));
    sessionStorage.setItem(storageKeys.submissionYourStatement, value);
  };

  const debouncedHandler = useCallback(debounce(debounceSetLink, 1000), []);

  const onTextareaChange = (event: FormEvent<HTMLTextAreaElement>) => {
    const { value } = event.currentTarget;
    setValue(value);
    debouncedHandler(value);
  };

  const onValidate = () => {
    if (!activeCategories.length) {
      setErrorMessage("You did not specify categories, please go back and specify them.");
      return false;
    }
    if (!linkData) {
      setErrorMessage("You did not specify a link, please go back and specify one.");
      return false;
    }
    if (!checkCredentials()) {
      setErrorMessage("You are not logged in, please log in to continue..");
      return false;
    }
    else {
      setErrorMessage("");
      return true;
    }
  };

  const onSubmit = () => {
    const userId = sessionStorage.getItem(storageKeys.userId);

    if (onValidate() && linkData && userId) {
      const data: ApiTypes.Req.CreateLink = {
        title: linkData.ogTitle,
        url: link,
        categories: activeCategories,
        userUuid: userId,
        description: linkData?.ogDescription,
        image: linkData?.ogImage[0]?.url || "",
        statement: yourStatement
      };

      try {
        triggerPostLinks(data).then((res: any) => {
          if (res?.error) {
            toast.error(res?.error?.data?.message);
          }
        });
      } catch (error: any) {
        toast.error(error?.message);
      }
    }
  };

  useEffect(()=>{
    if(data){
      dispatch(resetSubmission());
      router.push("/submission/create/success");
    }
  },[data]);

  return (
    <CreateSubmissionLayout
      submitButtonText="Submit"
      onSubmit={onSubmit}
      isSubmitAvailable
      isCancelAvailable
    >
      <div className={styles.statementDescription}>
        <p>
          Why was this insightful for you?
        </p>
        <p>
          Your statement will be visible for others and can help them understand the value of your submission.
        </p>
      </div>
      <div>
        <div className={styles.textareaLabel}>Optional</div>
        <textarea
          value={value}
          className={styles.textarea}
          placeholder="Text"
          onChange={onTextareaChange}
        />
        {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
      </div>
    </CreateSubmissionLayout>
  );
};

export default CreateSubmissionStatement;
