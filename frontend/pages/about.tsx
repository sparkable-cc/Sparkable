import classNames from 'classnames';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/About.module.scss';

const About: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sparkable - About</title>
        <meta name="description" content="Sparkable - About Us" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className={styles.about}>
        {/* FIRST SCREEN */}
        <section className={styles.aboutWrapper}>
          <div className={styles.titleTag}>ABOUT</div>
          <h1 className={styles.mainTitle}>
            There is a lot of noise on the internet.
          </h1>
          <img
            className={styles.squaresGradient}
            src="/squares-gradient.png"
            alt="square gradient"
          />
          <div className={styles.description}>
            <div className={styles.descriptionText}>
              <p>Finding what really matters on the internet is difficult.</p>
              <p>
                We set out on a mission to find the most insightful content on
                the internet: the signals within the noise.
              </p>
            </div>
            <img src="/square.png" alt="square" />
          </div>
          <div className={classNames(styles.description, styles.reverse)}>
            <div className={styles.descriptionText}>
              To find this content, Sparkable employs a circular system where
              everyone can contribute links and select what is most insightful.
            </div>
            <img src="/tini-squares.png" alt="tini squares" />
          </div>
          <div className={styles.description}>
            <div className={styles.descriptionText}>
              With this model, we want to create a crowdsourced and democratic
              informative environment to highlight some of the most insightful
              content on the internet.
            </div>
            <img src="/triangle.png" alt="triangle" />
          </div>
        </section>
        {/* CTA EXPLORE */}
        <section className={styles.ctaExplore}>
          <h2 className={styles.ctaExploreTitle}>Let's spark change.</h2>
          <div className={styles.buttonWrapper}>
            <Link href="/" className={styles.ctaButton}>
              Start exploring
            </Link>
          </div>
        </section>
        {/* HOW IT WORKS */}
        <section className={styles.howItWorksWrapper}>
          <div className={styles.howItWorksContainer}>
            <header className={styles.howItWorksHeader}>
              <h2 className={styles.howItWorksTitle}>HOW IT WORKS</h2>
              <img
                className={styles.howItWorksStars}
                src="svg/how-it-works-stars.svg"
                alt="how it works"
              />
            </header>
            <div className={styles.howItWorksContent}>
              <div className={styles.howItWorksItem}>
                <span className={styles.howItWorksCounter}>1</span>
                <p className={styles.howItWorksDescription}>
                  <strong>Discover and share</strong> links that were insightful
                </p>
              </div>
              <div className={styles.howItWorksItem}>
                <span className={styles.howItWorksCounter}>2</span>
                <p className={styles.howItWorksDescription}>
                  <strong>Vote</strong> to select the most insightful and
                  constructive links shared by the community
                </p>
              </div>
              <div className={styles.howItWorksItem}>
                <span className={styles.howItWorksCounter}>3</span>
                <p className={styles.howItWorksDescription}>
                  <strong>Get access to the top links</strong> by contributing
                  your perspective
                </p>
              </div>
              <div
                className={classNames(
                  styles.howItWorksItem,
                  styles.notAvailable,
                )}
              >
                <span className={styles.howItWorksCounter}>COMING SOON</span>
                <p className={styles.howItWorksDescription}>
                  <strong>Support everyone involved</strong> with a small
                  contribution and access only the most constructive content
                  instantly
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* VALUES */}
        <section className={styles.valuesWrapper}>
          <div className={styles.valuesTag}>WHAT WE VALUE</div>
          <div className={styles.valuesContainer}>
            <div className={styles.valuesItem}>
              <h3 className={styles.valuesTitle}>Randomness & Diversity</h3>
              <div className={styles.valuesDescription}>
                Sparkable selectively induces randomness in order to reinforce
                diversity and to create a constructive environment.
              </div>
            </div>
            <div className={styles.valuesItem}>
              <h3 className={styles.valuesTitle}>Participation</h3>
              <div className={styles.valuesDescription}>
                When you share insightful content or participate, you will get
                heard and your actions will make a difference. No matter who or
                where you are.
              </div>
            </div>
            <div className={styles.valuesItem}>
              <h3 className={styles.valuesTitle}>Decentralization</h3>
              <div className={styles.valuesDescription}>
                Sparkable's participation system transparently decentralizes the
                power of information curation and thereby hands back autonomy.
              </div>
            </div>
            <div className={styles.valuesItem}>
              <h3 className={styles.valuesTitle}>Free & Open Source </h3>
              <div className={styles.valuesDescription}>
                Sparkable’s redistributive system ensures independence from ads,
                paywalls and third party interests. It allows the project to be
                free for everyone to use, modify, and improve.
              </div>
            </div>
          </div>
        </section>
        {/* CTA SUBMIT */}
        <section className={styles.ctaSubmit}>
          <h2 className={styles.ctaSubmitTitle}>Submit your first spark.</h2>
          <div className={styles.buttonWrapper}>
            <Link href="/submission/create" className={styles.ctaButton}>
              Submit a link
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
