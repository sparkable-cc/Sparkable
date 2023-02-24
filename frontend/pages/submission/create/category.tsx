import { FormEvent, useMemo, useEffect } from "react";
import { CreateSubmissionLayout } from "../../../layouts/CreateSubmissionLayout";
import styles from '../../../styles/Submission.module.scss';
import { useRouter } from "next/router";
import { FormInput } from "../../../components/FormInput";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { getCategories, useLazyGetCategoriesQuery } from "../../../store/api/articlesApi";
import classNames from "classnames";
import { v4 as uuidv4 } from "uuid";
import { ModalNote } from "../../../components/ModalNote";
import { storageKeys } from "../../../utils/storageKeys";
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
    sessionStorage.setItem(storageKeys.submissionSuggestedCategory, value);
  };

  const onInputClear = () => {
    dispatch(setSuggestedCategory(""));
  }

  const onSetCurrentCategory = (event: any) => {
    const param = event?.target?.getAttribute("data-param");
    if (!param) return;

    let data;
    if (activeCategories?.find(item => item === param)) {
      data = activeCategories.filter(item => item !== param);
    } else {
      data = [...activeCategories, ...[param]];
    }

    dispatch(setCategories(data));
    sessionStorage.setItem(storageKeys.submissionCategories, JSON.stringify(data));
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
        <span>Categories</span>
        <ModalNote title="Categories">
          {Boolean(categoriesNote?.length) && categoriesNote.map(item => (
            <div className={styles.modalCategoryItem} key={uuidv4()}>
              <h3 className={styles.modalCategoryName}>
                {item.name}
              </h3>
              <div className={styles.modalCategoryDescription}>
                {item.description}
              </div>
            </div>
          ))}
        </ModalNote>
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

const categoriesNote = [
  {
    name: "Art & Culture",
    description: "e.g. music, architecture, design, style"
  },
  {
    name: "Business & Economy",
    description: "e.g. work culture, finance, new markets"
  },
  {
    name: "Environment",
    description: "e.g. climate crisis, nature, natural sciences, energy"
  },
  {
    name: "Mind & body",
    description: "e.g. physical health, mental health, psychology, medicine"
  },
  {
    name: "Society",
    description: "e.g. ethics, justice, purpose, politics"
  },
  {
    name: "Technology",
    description: "e.g. digital culture, tech economy"
  },
];