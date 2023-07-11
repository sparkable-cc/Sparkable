import { NextPage } from "next";
import styles from "../styles/career.module.scss";

const Career: NextPage = () => {
  const jobOpenings = [
    {
      id: 1,
      title: "Product Manager",
      location: "Remote",
      link: "https://www.google.com",
    },
    {
      id: 2,
      title: "Product designer",
      location: "Remote",
      link: "https://www.google.com",
    },
    {
      id: 3,
      title: "Frontend Developer",
      location: "Remote",
      link: "https://www.google.com",
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
