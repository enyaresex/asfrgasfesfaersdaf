import React from 'react';
import { FormattedMessage } from 'react-intl';
import LanguageSelector from '../LanguageSelector';
import Logo from '../Logo';
import styles from './MaintenancePage.module.css';

export default function MaintenancePage() {
  return (
    <div className={styles.maintenancePage}>
      <div className={styles.shade} />

      <section className={styles.content}>
        <Logo className={styles.logo} />

        <div className={styles.body}>
          <h1 className={styles.title}>
            <FormattedMessage defaultMessage="Gamer Arena is in maintenance!" />
          </h1>

          <div className={styles.description}>
            <p>
              <FormattedMessage defaultMessage="An update is on the way. Thank you for your patience." />
            </p>

            <p>
              <FormattedMessage
                defaultMessage="If you need to, you can always <contact>reach out to us</contact>, otherwise we'll be back shortly."
                values={{
                  contact: (...chunks: string[]) => (
                    <a href="https://help.gamerarena.com/">{chunks}</a>
                  ),
                }}
              />
            </p>
          </div>
        </div>

        <div className={styles.language}>
          <LanguageSelector />
        </div>
      </section>
    </div>
  );
}
