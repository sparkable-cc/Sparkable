import classNames from "classnames";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/About.module.scss";

const About: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sparkable - About</title>
        <meta name="description" content="Sparkable - About Us" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* <!-- Facebook Meta Tags --> */}
        <meta property="og:url" content="https://www.sparkable.cc" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Sparkable" />
        <meta property="og:description" content="Discover links that spark new understanding." />
        <meta property="og:image" content="https://www.sparkable.cc/og-image.png" />
        {/* <!-- Twitter Meta Tags --> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="sparkable.cc" />
        <meta property="twitter:url" content="https://www.sparkable.cc" />
        <meta name="twitter:title" content="Sparkable" />
        <meta name="twitter:description" content="Discover links that spark new understanding." />
        <meta name="twitter:image" content="https://www.sparkable.cc/og-image.png" />
      </Head>
      <div className={styles.about}>

        {/* FIRST SCREEN */}
        <section className={styles.aboutWrapper}>
          <div className={styles.titleTag}>ABOUT</div>
          <h1 className={styles.mainTitle}>There is a lot of noise on the internet.</h1>
          <img
            className={styles.squaresGradient}
            src="/squares-gradient.png"
            alt="square gradient"
          />
          <div className={styles.description}>
            <div className={styles.descriptionText}>
              <p>Finding what really matters on the internet is difficult.</p>
              <p>We set out on a mission to find the most insightful content on the internet: the signals in the noise.</p>
            </div>
            <img
              src="/square.png"
              alt="square"
            />
          </div>
          <div className={classNames(styles.description, styles.reverse)}>
            <div className={styles.descriptionText}>
              To find this content, Sparkable employs a circular system where everyone can contribute links, and select what is most insightful.
            </div>
            <img
              src="/tini-squares.png"
              alt="tini squares"
            />
          </div>
          <div className={styles.description}>
            <div className={styles.descriptionText}>
              With this, we are creating a fully crowdsourced and democratic information environment, aimed to bring out the most insightful content of the internet.
            </div>
            <img
              src="/triangle.png"
              alt="triangle"
            />
          </div>
        </section>
        {/* HOW IT WORKS */}
        <section className={styles.howItWorksWrapper}>
          <div className={styles.howItWorksContainer}>
            <header className={styles.howItWorksHeader}>
              <h2 className={styles.howItWorksTitle}>HOW IT WORKS</h2>
              <img className={styles.howItWorksStars} src="svg/how-it-works-stars.svg" alt="how it works" />
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
                  <strong>Vote</strong> to select the most insightful and constructive links shared by the community
                </p>
              </div>
              <div className={styles.howItWorksItem}>
                <span className={styles.howItWorksCounter}>3</span>
                <p className={styles.howItWorksDescription}>
                  <strong>Get access to the top links</strong> by contributing your perspective
                </p>
              </div>
              <div className={classNames(styles.howItWorksItem, styles.notAvailable)}>
                <span className={styles.howItWorksCounter}>COMING SOON</span>
                <p className={styles.howItWorksDescription}>
                  <strong>Support everyone involved</strong> with a small contribution and access only the most constructive content instantly
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* TEAM */}
        <section className={styles.teamWrapper}>
          <span className={styles.titleTag}>OUR TEAM</span>
          <h2 className={classNames(styles.mainTitle, styles.teamTitle)}>A collective of curious minds.</h2>
          <div className={styles.teamSubtitle}>Sparkable brings together a diverse range of people from different backgrounds and walks of life. All united by the goal of creating a better information environment.</div>
          <div className={styles.teamMembersWrapper}>
            <div className={styles.teamMemberItem}>
              <img className={styles.teamMemberPhoto} src="team-felix.jpg" alt="Felix Gugler" />
              <div className={styles.teamMemberNameWrapper}>
                <h3 className={styles.teamMemberName}>Felix Gugler</h3>
                <div className={styles.teamMemberRole}>Business Design</div>
              </div>
            </div>
            <div className={styles.teamMemberItem}>
              <img className={styles.teamMemberPhoto} src="team-ninja.jpg" alt="Felix Gugler" />
              <div className={styles.teamMemberNameWrapper}>
                <h3 className={styles.teamMemberName}>Ninja Hoffmann</h3>
                <div className={styles.teamMemberRole}>Co-Lead</div>
              </div>
            </div>
            <div className={styles.teamMemberItem}>
              <img className={styles.teamMemberPhoto} src="team-oma.jpg" alt="Felix Gugler" />
              <div className={styles.teamMemberNameWrapper}>
                <h3 className={styles.teamMemberName}>Oma Ikwueme</h3>
                <div className={styles.teamMemberRole}>Technology</div>
              </div>
            </div>
            <div className={styles.teamMemberItem}>
              <img className={styles.teamMemberPhoto} src="team-paula.jpg" alt="Felix Gugler" />
              <div className={styles.teamMemberNameWrapper}>
                <h3 className={styles.teamMemberName}>Paula Härtel </h3>
                <div className={styles.teamMemberRole}>Design</div>
              </div>
            </div>
            <div className={styles.teamMemberItem}>
              <img className={styles.teamMemberPhoto} src="team-tony.jpg" alt="Felix Gugler" />
              <div className={styles.teamMemberNameWrapper}>
                <h3 className={styles.teamMemberName}>Tony Morellá Llácer</h3>
                <div className={styles.teamMemberRole}>Technology</div>
              </div>
            </div>
            <div className={styles.teamMemberItem}>
              <img className={styles.teamMemberPhoto} src="team-vardon.jpg" alt="Felix Gugler" />
              <div className={styles.teamMemberNameWrapper}>
                <h3 className={styles.teamMemberName}>Vardon Hamdiu</h3>
                <div className={styles.teamMemberRole}>Co-Lead</div>
              </div>
            </div>
          </div>
        </section>
        {/* CTA COMMUNITY */}
        <section className={styles.ctaCommunity}>
          <span className={styles.titleTag}>OUR COMMUNITY</span>
          <h2 className={styles.ctaCommunityTitle}>Help shape this project</h2>
          <div className={styles.ctaDescription}>Only together, we can truly co-create an information environment that fosters mutual understanding. </div>
          <div className={styles.buttonWrapper}>
            <a href="https://sparkable-cc.slack.com/signup#/domain-signup" target="_blank" rel="noopener noreferrer" className={classNames(styles.ctaButton, styles.slack)}>Join our Slack</a>
          </div>
          <div className={styles.socialWrapper}>
            <span className={classNames(styles.titleTag, styles.social)}>KEEP IN TOUCH</span>
            <div className={styles.socialList}>
              <a
                href="https://join.slack.com/t/butterfy/shared_invite/zt-1fsubrlw2-4xzobfnGKxmiI~R~xXwYsw"
                className={classNames(styles.socialItem, styles.slack)}
                target="_blank"
                rel="noopener noreferrer"
              />
              <br />
              <a
                href="https://www.linkedin.com/company/sparkable-cc/"
                className={classNames(styles.socialItem, styles.linkedin)}
                target="_blank"
                rel="noopener noreferrer"
              />
              <br />
              <a
                href="https://github.com/butterfyme"
                className={classNames(styles.socialItem, styles.github)}
                target="_blank"
                rel="noopener noreferrer"
              />
              <br />
              <a
                href="https://twitter.com/sparkable_cc"
                className={classNames(styles.socialItem, styles.twitter)}
                target="_blank"
                rel="noopener noreferrer"
              />
            </div>
          </div>
        </section>
        {/* VALUES */}
        <section className={styles.valuesWrapper}>
          <span className={styles.valuesTag}>OUR VALUES</span>
          <div className={styles.valuesContainer}>
            <div className={styles.valuesItem}>
              <h3 className={styles.valuesTitle}>Randomness & Diversity</h3>
              <div className={styles.valuesDescription}>
                Sparkable selectively induces randomness in order to reinforce diversity and to create a constructive environment.
              </div>
            </div>
            <div className={styles.valuesItem}>
              <h3 className={styles.valuesTitle}>Participation</h3>
              <div className={styles.valuesDescription}>
                When you share insightful content or participate, you will get heard and your actions will make a difference. No matter who or where you are.
              </div>
            </div>
            <div className={styles.valuesItem}>
              <h3 className={styles.valuesTitle}>Decentralization</h3>
              <div className={styles.valuesDescription}>
                Sparkable’s participation system transparently decentralizes the power of information curation and thereby hands back autonomy.
              </div>
            </div>
            <div className={styles.valuesItem}>
              <h3 className={styles.valuesTitle}>Free & Open Source </h3>
              <div className={styles.valuesDescription}>
                Sparkable’s redistributive system ensures independence from ads, paywalls and third party interests. It allows the project to be free for everyone to use, modify, and improve.
              </div>
            </div>
          </div>
        </section>
        {/* CTA MISSION */}
        <section className={styles.ctaMission}>
          <span className={styles.titleTag}>OUR MISSION</span>
          <h2 className={styles.ctaMissionTitle}>Sparkable aims to create an environment that sparks lasting new insight and understanding.</h2>
          <div className={styles.buttonWrapper}>
            <Link href="/submission/create" className={styles.ctaButton}>Submit a link</Link>
          </div>
        </section>

      </div>
    </>
  );
};

export default About;
