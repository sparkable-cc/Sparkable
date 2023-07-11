import { NextPage } from "next";
import styles from "../styles/career.module.scss";

const Career: NextPage = () => {
  const jobOpenings = [
    {
      id: 1,
      title: "Product Lead",
      location: "Remote",
      link: "mailto:support@sparkable.cc",
    },
    {
      id: 2,
      title: "Product Designer",
      location: "Remote",
      link: "mailto:support@sparkable.cc",
    },
    {
      id: 3,
      title: "Frontend Developer",
      location: "Remote",
      link: "mailto:support@sparkable.cc",
    },
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
              <li
                key={job.id}
                className={styles.jobCard}
                onClick={() => handleClick(job.link)}
              >
                <h2>{job.title}</h2>
                <p>{job.location}</p>
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
