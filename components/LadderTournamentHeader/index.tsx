import classNames from 'classnames';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import useSWR from 'swr';
import Button from '../Button';
import Container from '../Container';
import Countdown from '../Countdown';
import LadderTournamentStatusDisplay from '../LadderTournamentStatusDisplay';
import ShareButton from '../ShareButton';
import styles from './LadderTournamentHeader.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, {
  ladder: Ladder,
}>;

export default function LadderTournamentHeader({ className, ladder, ...props }: Props) {
  const intl = useIntl();
  const { data: game } = useSWR<Game>(`/games/${ladder.game}/`);
  const [isCountdownVisible, setIsCountdownVisible] = useState<boolean>(true);

  const countdown = useMemo(() => (!isCountdownVisible ? null : (
    <>
      {(ladder.status === 'FINISHED' || ladder.status === 'PAUSED') ? null : (
        <div className={styles.action}>
          <div className={styles.countdownWrapper}>
            <Countdown
              className={styles.countdown}
              date={(ladder.status === 'REGISTRATION' || ladder.status === 'FUTURE')
                ? ladder.startsAt
                : ladder.endsAt}
              onComplete={() => setIsCountdownVisible(false)}
            />
          </div>

          {(ladder.status === 'REGISTRATION' || ladder.status === 'FUTURE') && (
            <Link href={ladder.buttonUrl} passHref>
              <Button className={styles.button} size="large">
                {ladder.buttonText}
              </Button>
            </Link>
          )}

          {ladder.status === 'IN_PROGRESS' && (
            <p className={styles.disclaimer}>
              <FormattedMessage defaultMessage="Time left for the final" />
            </p>
          )}
        </div>
      )}
    </>
  )), [isCountdownVisible, ladder.status]);

  return game === undefined ? null : (
    <section {...props} className={classNames(styles.ladderTournamentHeader, className)}>
      <>
        <div className={styles.header} style={{ backgroundImage: `url(${game.image})` }}>
          <div className={styles.headerBody}>
            <div className={styles.share}>
              <ShareButton
                text={intl.formatMessage({
                  defaultMessage:
                      '{ladderName} Discord Tournament | Registration: FREE | Total Reward: {ladderTotalReward} GAU Token | Gamer Arena Competitive Esports Platform',
                },
                {
                  ladderName: ladder.name,
                  ladderTotalReward: ladder.totalReward,
                })}
              />
            </div>

            <Container className={styles.container}>
              <div className={styles.game}>
                <img alt={game.name} loading="lazy" src={game.image} />

                <div className={styles.info}>
                  <LadderTournamentStatusDisplay ladderStatus={ladder.status} size="large" />

                  <h3 className={styles.name}>{ladder.name}</h3>
                </div>
              </div>

              {countdown}
            </Container>
          </div>
        </div>
      </>
    </section>
  );
}
