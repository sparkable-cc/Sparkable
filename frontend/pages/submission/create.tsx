import { CreateSubmissionLayout } from "../../layouts/CreateSubmissionLayout"


const SubmissionCreate = () => {
  return (
    <CreateSubmissionLayout>
      
    </CreateSubmissionLayout>
  )
}

export default SubmissionCreate;


export async function getStaticProps() {
  return {
    props: {
      protected: true,
    },
  }
}