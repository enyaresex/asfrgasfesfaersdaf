import React, { useEffect, useState } from 'react';
import * as Sentry from '@sentry/nextjs';
import { FormattedMessage } from 'react-intl';
import { Shield } from 'shield-js-fp';
import { ShieldContext } from '../../contexts';
import styles from './ShieldHandler.module.css';
import { ReactComponent as Bodyguard } from './bodyguard.svg';

type Props = {
  children: React.ReactNode,
};

export default function ShieldHandler({ children }: Props) {
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const shield = new Shield();

    shield
      .init(process.env.NEXT_PUBLIC_GAMERARENA_SHIELD_SITE_ID as string)
      .then(() => {
        setSessionId(shield.getSessionId());

        return shield.sendFP();
      })
      .then((res: any) => {
        const deviceIntelligence = res?.result?.device_intelligence;

        if (
          deviceIntelligence?.is_anti_fingerprinting
          || deviceIntelligence?.is_incognito
          || deviceIntelligence?.is_proxy
          || deviceIntelligence?.is_tor
        ) {
          setIsBlocked(true);
        }
      })
      .catch((err) => {
        Sentry.captureException(err);
      });
  }, []);

  return (
    <ShieldContext.Provider value={{ sessionId }}>
      {isBlocked ? (
        <div className={styles.shieldHandler}>
          <div className={styles.visual}>
            <Bodyguard />
          </div>

          <div className={styles.description}>
            <p>
              <FormattedMessage defaultMessage="To continue to use Gamer Arena please disable the proxy, VPN or incognito feature of your browser." />
            </p>

            <p>
              <FormattedMessage defaultMessage="We don't allow these in order to prevent abusive or fraudulent activity. Thank you for your understanding." />
            </p>
          </div>
        </div>
      ) : children}
    </ShieldContext.Provider>
  );
}
