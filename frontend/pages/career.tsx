import { NextPage } from "next";
import styles from "../styles/career.module.scss";

const Career: NextPage = () => {
  const jobOpenings = [
    // {
    //   id: 0,
    //   title: '',
    //   location: '',
    //   link: '',
    //   jobAd: '',
    // },
  ];

  const handleClick = (link: string) => {
    window.open(link, "_blank");
  };

  return (
    <div className={styles.careerContainer}>
      <section>
        <h1>Join us at Sparkable</h1>
        {jobOpenings.length > 0 ? (
          <ul>
            {jobOpenings.map((job) => (
              <li key={job.id} className={styles.jobCard}>
                <h2>{job.title}</h2>
                <p>{job.location}</p>
                <h3 onClick={() => handleClick(job.link)}>{job.jobAd}</h3>
              </li>
            ))}
          </ul>
        ) : (
          <p>No jobs available at this time.</p>
        )}
      </section>
    </div>
  );
};

export default Career;
