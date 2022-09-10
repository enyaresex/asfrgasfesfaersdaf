import classNames from 'classnames';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import useSWR from 'swr';
import Container from '../Container';
import Countdown from '../Countdown';
import LeaderboardTournamentStatusDisplay from '../LeaderboardTournamentStatusDisplay';
import ShareButton from '../ShareButton';
import styles from './LeaderboardTournamentHeader.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, {
  leaderboard: Leaderboard,
}>;

export default function LeaderboardTournamentHeader({ className, leaderboard, ...props }: Props) {
  const intl = useIntl();
  const { data: game } = useSWR<Game>(`/games/${leaderboard.game}/`);

  const [isCountdownVisible, setIsCountdownVisible] = useState<boolean>(true);

  return game === undefined ? null : (
    <section {...props} className={classNames(styles.leaderboardTournamentHeader, className)}>
      <>
        <div className={styles.header} style={{ backgroundImage: `url(${game.image})` }}>
          <div className={styles.headerBody}>
            <div className={styles.share}>
              <ShareButton
                text={intl.formatMessage({
                  defaultMessage:
                    '{leaderboardName} Leaderboard Tournament | Total Reward: {leaderboardTotalReward} GAU Token | Gamer Arena Competitive Esports Platform',
                }, {
                  leaderboardName: leaderboard.name,
                  leaderboardTotalReward: leaderboard.totalReward,
                })}
              />
            </div>

            <Container className={styles.container}>
              <div className={styles.game}>
                <img alt={game.name} loading="lazy" src={game.image} />

                <div className={styles.info}>
                  <LeaderboardTournamentStatusDisplay leaderboardStatus={leaderboard.status} size="large" />

                  <h3 className={styles.name}>{leaderboard.name}</h3>
                </div>
              </div>

              {(!isCountdownVisible || leaderboard.status === 'FINISHED' || leaderboard.status === 'IN_REVIEW' || leaderboard.status === 'PAUSED') ? null : (
                <div className={styles.countdownWrapper}>
                  <Countdown
                    className={styles.countdown}
                    date={leaderboard.status === 'FUTURE' ? leaderboard.startsAt : leaderboard.endsAt}
                    onComplete={() => setIsCountdownVisible(false)}
                  />
                </div>
              )}
            </Container>
          </div>
        </div>
      </>
    </section>
  );
}
