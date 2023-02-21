import { FormEvent, useMemo, useEffect } from "react";
import { CreateSubmissionLayout } from "../../../layouts/CreateSubmissionLayout";
import styles from '../../../styles/Submission.module.scss';
import { useRouter } from "next/router";
import { FormInput } from "../../../components/FormInput";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { getCategories, useLazyGetCategoriesQuery } from "../../../store/api";
import classNames from "classnames";
import { v4 as uuidv4 } from "uuid";
import { 
  setCategories, 
  selectCategories, 
  setSuggestedCategory, 
  selectSuggestedCategory,
} from "../../../store/submissionSlice";


const CreateSubmissionCategory = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [triggerGetCategories] = useLazyGetCategoriesQuery();

  const categoriesMemo = useMemo(() => getCategories.select(), []);
  const categories = useAppSelector(categoriesMemo);
  const categoriesData = categories?.data?.categories;
  const activeCategories = useAppSelector(selectCategories);
  const suggestedCategory = useAppSelector(selectSuggestedCategory);

  const onButtonClick = () => {
    router.push("/submission/create/statement")
  }

  const onInputChange = (event: FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    dispatch(setSuggestedCategory(value));
  };

  const onInputClear = () => {
    dispatch(setSuggestedCategory(""));
  }

  const onSetCurrentCategory = (event: any) => {
    const param = event?.target?.getAttribute("data-param");
    if (!param) return;

    if (activeCategories?.find(item => item === param)) {
      dispatch(setCategories(activeCategories.filter(item => item !== param)));
    } else {
      dispatch(setCategories([...activeCategories, ...[param]]));
    }
  };

  useEffect(() => {
    if (!categoriesData) {
      triggerGetCategories();
    }
  });

  return (
    <CreateSubmissionLayout
      submitButtonText="Continue"
      onSubmit={onButtonClick}
      isSubmitAvailable={Boolean(activeCategories?.length)}
      isCancelAvailable={true}
    >
      <div className={styles.categoryDescription}>
        Please pick at least one category. This helps others find your content.
        None of the categories fit? Choose “Other” and suggest a new category.
      </div>
      <header className={styles.categoryHeader}>
        Categories
      </header>
      <div className={styles.categorysWrapper}>
        {
          categoriesData && categoriesData?.map(item => (
            <button
              className={classNames(styles.categoryButton, {
                [styles.active]: activeCategories.find(sortItem => sortItem === item.slug)
              })}
              onClick={onSetCurrentCategory}
              key={uuidv4()}
              data-param={item.slug}
            >
              {item.name}
            </button>
          ))
        }
      </div>
      <FormInput
        value={suggestedCategory}
        id="suggestion"
        name="suggestion"
        label=""
        placeholder="Suggest a category"
        onChange={onInputChange}
        onClear={onInputClear}
        errorMessage={""}
      />
      <div className={styles.inputNote}>
        Your suggestion helps Sparkable introduce new categories and will not be visible to others.
      </div>
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