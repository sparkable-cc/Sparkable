import styles from "./index.module.scss";

export const PrivacyPolicy = () => {
  return (
    <div className={styles.privacyPolicyWrapper}>
      <h1>Butterfy Data Privacy Policy</h1>
      <p>
        Butterfy is a not-for-profit organization building a self-sustaining
        business model which does not rely on advertisement or any third-party
        investors or clients. Butterfy's only obligation is to its users.
      </p>
      <p>
        This gives Butterfy the freedom of not having to collect unnecessary
        data. Your data privacy and security are a top concern for us. We treat
        your data with the utmost care and in accordance with the applicable
        laws and this privacy policy. Butterfy does not collect any data that is
        not absolutely needed and necessary for the respective purpose. We use
        servers in the European Union (Germany).
      </p>
      <p>
        However, some third-party services we are using (like Twitter, LinkedIn,
        Slack) have different business models and thus, different privacy
        policies. Please be aware that those services might try to collect data
        without us wanting that. Make sure you protect yourself by reading their
        terms and conditions.
      </p>
      <p>
        You can always <a href="/ ">contact</a> us and request insight into and
        deletion of your data. Or help us improve our policies.
      </p>
      <h2>What data do we collect and why?</h2>
      <p>
        In order for us to provide the best possible experience on our websites,
        we need to collect and process certain information. Depending on your
        use of the services, that may include:
      </p>
      <h3>Create an account</h3>
      <p>
        New Butterfy accounts are created with an email, username and a
        password. When using Butterfy with a user account, your activity (such
        as your submitted content links) is recorded in an anonymized way to
        ensure the integrity of the platform (e.g. preventing bad actors from
        flooding the platform with spam or harmful content). The data collected
        during the sign-up process is stored on our servers. Butterfy is using
        <a href="https://www.digitalocean.com/"> DigitalOcean</a> as a provider.
        For more information, check DigitalOcean's
        <a href="https://www.digitalocean.com/legal"> legal</a> and
        <a href="https://www.digitalocean.com/security"> security </a>
        statements.
      </p>
      <h3>Usage data</h3>
      <p>
        When you visit Butterfy, we will store: the parts of our site you visit,
        the date and duration of your visit, information from the device (device
        type, operating system, screen resolution, language, country you are
        located in, and web browser type) you used during your visit, and more.
        We process this usage data in
        <a href="https://matomo.org/"> Matomo </a> Analytics for statistical
        purposes, to improve your experience, to improve our site, and to
        recognize and stop any misuse. This tool works in compliance with GDPR.
        For details, see
        <a href="https://matomo.org/privacy-policy/">
          {" "}
          Matomo's privacy policy{" "}
        </a>
        .
      </p>
      <h3>Session Storage</h3>
      <p>
        Butterfy uses session storage for record-keeping purposes and to enhance
        functionality on our site. You may deactivate or restrict the
        transmission by changing the settings of your web browser.
      </p>
      <h3>Subscribe to our newsletter</h3>
      <p>
        To keep you updated, we send newsletters at regular intervals. For this,
        Butterfy uses the tool
        <a href="https://www.sendinblue.com/"> Sendinblue </a>. This tool works
        in compliance with GDPR and uses servers in Germany. Upon registration,
        Butterfy collects your e-mail address. This information is exclusively
        for the purpose of sending the newsletter. The Newsletter is only sent
        to those who have signed up for it (double-op-in). You can unsubscribe
        at any time. For details, see{" "}
        <a href="https://www.sendinblue.com/legal/privacypolicy/">
          Sendinblue privacy policy
        </a>
        .
      </p>
      <h2>How long we retain your data and what rights do you have over it?</h2>
      <p>
        We keep your provided data until the purpose no longer applies or you
        request us to delete it. You have a right to access, rectification,
        erasure, restrict processing, object to processing, and portability. To
        do this please write an email to{" "}
        <a href="mailto:">support@butterfy.me </a>.
      </p>
      <h2>Embedded content from other websites.</h2>
      <p>
        Our site includes embedded content (e.g. videos, images, articles,
        etc.). Embedded content from other websites behaves in the same way as
        if the visitor has visited the other website. These other websites may
        collect data about you, use cookies, embed additional third-party
        tracking, and monitor your interaction with that embedded content,
        including tracking your interaction with the embedded content if you
        have an account and are logged in to that website. Please protect
        yourself.
      </p>
      <h2>Contact us!</h2>
      <p>
        E-mail: <a href="mailto:">support@butterfy.me</a>
      </p>
    </div>
  );
};
