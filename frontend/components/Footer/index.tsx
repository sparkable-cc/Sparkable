import styles from "./index.module.scss";
import classNames from "classnames";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className={styles.footerWrapper}>
      <div className={styles.footerTopPart}>
        <img className={styles.footerLogo} src="/svg/sparkable-logo.svg" alt="sparkable-logo" />
        <span className={styles.footerVersion}>v0.0.1</span>
      </div>
      <div className={styles.footerColumnsWrapper}>
        <div className={styles.footerColumn}>
          <h3 className={styles.footerColumnTitle}>CONTACT</h3>
          <a href="mailto:support@butterfy.me" className={styles.footerLink}>support@butterfy.me</a><br />
          Butterfy (Association) <br />
          CH-8000 Zurich, Switzerland
        </div>
        <div className={styles.footerColumn}>
          <h3 className={styles.footerColumnTitle}>ABOUT</h3>
          <Link href="/about" className={styles.footerLink}>About Sparkable</Link>
        </div>
        <div className={styles.footerColumn}>
          <h3 className={styles.footerColumnTitle}>LEGAL</h3>
          <Link href="/legal/privacy-policy" className={styles.footerLink}>Privacy policy</Link><br />
          <Link href="/legal/terms-of-use" className={styles.footerLink}>Terms of use</Link>
        </div>
        <div className={styles.footerColumn}>
          <h3 className={styles.footerColumnTitle}>KEEP IN TOUCH</h3>
          <div className={styles.footerSocialWrapper}>
            <a
              href="https://join.slack.com/t/butterfy/shared_invite/zt-1fsubrlw2-4xzobfnGKxmiI~R~xXwYsw"
              className={classNames(styles.footerSocial, styles.slack)}
              target="_blank"
              rel="noopener noreferrer"
            />
            <br />
            <a
              href="https://www.linkedin.com/company/butterfy/"
              className={classNames(styles.footerSocial, styles.linkedin)}
              target="_blank"
              rel="noopener noreferrer"
            />
            <br />
            <a
              href="https://github.com/butterfyme"
              className={classNames(styles.footerSocial, styles.github)}
              target="_blank"
              rel="noopener noreferrer"
            />
            <br />
            <a
              href="https://twitter.com/ButterfyMe"
              className={classNames(styles.footerSocial, styles.twitter)}
              target="_blank"
              rel="noopener noreferrer"
            />
          </div>
        </div>
      </div>
      <div className={styles.footerBottomPart}>
        <div className={styles.footerBottomColumn}>
          <iframe className={styles.footerIframe} sandbox="allow-scripts allow-popups allow-forms" src="https://f38488d3.sibforms.com/serve/MUIEACNqRKIRQkXfHinp_hTATxLTlYMnRXAZ_KOnLteXMgW6kO2PcyR67Puo_qlJnP-xQR3uuttWUHGoIMfZ4-3hGteAwWhFg0QQdN0p-9J4nuv0L3HLpE0lEwlsvNieW06jbq3vJ5h85lq-1Y3oQYijb_tYsLY7DIWsY-0M8BA-pJayFhNXFae9aIEiCxiXgwMSxGHPgqdiY6eh" scrolling="auto" />
        </div>
        <div className={styles.footerBottomColumn}>
          <div>
            <img src="/svg/open-source.svg" alt="open source" className={styles.footerOpenSource} />
          </div>
          <div className={styles.footerBottomTextWrapper}>
            <img src="/svg/surface.svg" alt="open source" className={styles.footerLogos} />
            <p className={styles.footerText}>
              <span>With the exception of the trademark (c) Sparkable, this work is licensed under a </span>
              <a
                href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerTextLink}
              >Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
