import classNames from 'classnames';
import dayjs from 'dayjs';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import useSWR from 'swr';
import Avatar from '../Avatar';
import Countdown from '../Countdown';
import GACoin from '../GACoin';
import LeaderboardTournamentStatusDisplay from '../LeaderboardTournamentStatusDisplay';
import { ReactComponent as Calendar } from './calendar.svg';
import styles from './LeaderboardTournamentCard.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, {
  leaderboard: Leaderboard,
}>;

export default function LeaderboardTournamentCard({ className, leaderboard, ...props }: Props) {
  const { data: game } = useSWR<Game>(`/games/${leaderboard.game}/`);
  const [isCountdownVisible, setIsCountdownVisible] = useState<boolean>(true);
  const avatarBorder = useMemo<Record<LeaderboardTournamentStatus, DuelStatus>>(() => ({
    FINISHED: 'ENDED',
    FUTURE: 'OPEN',
    IN_PROGRESS: 'IN_PROGRESS',
    IN_REVIEW: 'CHECKING_IN',
    PAUSED: 'CANCELED',
  }), [leaderboard.status]);

  return game === undefined ? null : (
    <div
      {...props}
      className={classNames(
        styles.leaderboardTournamentCard,
        className,
      )}
    >
      <Link href={`/tournaments/leaderboard/?id=${leaderboard.id}`}>
        <a className={styles.link}>
          <div className={styles.header}>
            <Avatar
              borderType={avatarBorder[leaderboard.status]}
              image={game.image}
              size={36}
            />

            <p className={styles.game}>{game.name}</p>

            <LeaderboardTournamentStatusDisplay leaderboardStatus={leaderboard.status} />
          </div>

          <div className={styles.body}>
            <div className={styles.image} style={{ backgroundImage: `url(${game.image})` }}>
              <div className={styles.shadow}>
                {(leaderboard.status !== 'FINISHED' && leaderboard.status !== 'IN_REVIEW' && isCountdownVisible) && (
                  <div className={styles.countdown}>
                    <Countdown
                      className={styles.time}
                      color="white"
                      date={leaderboard.status === 'FUTURE' ? leaderboard.startsAt : leaderboard.endsAt}
                      onComplete={() => setIsCountdownVisible(false)}
                    />

                    <p className={styles.remaining}>
                      <FormattedMessage defaultMessage="Remaining Time" />
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.detailHeader}>
              <p className={styles.title}>{leaderboard.name}</p>

              <div className={styles.separator} />
            </div>

            <div className={styles.details}>

              <div className={styles.date}>
                <div className={styles.info}>
                  <Calendar className={classNames(styles.calendar, styles[leaderboard.status])} />
                </div>

                <div className={styles.info}>
                  {dayjs(leaderboard.startsAt).format('DD MMM, HH:mm')}

                  <p className={styles.muted}>
                    <FormattedMessage defaultMessage="Starting Date" />
                  </p>
                </div>

                <div className={styles.info}>
                  -
                </div>

                <div className={styles.info}>
                  {dayjs(leaderboard.endsAt).format('DD MMM, HH:mm')}

                  <p className={styles.muted}>
                    <FormattedMessage defaultMessage="Ending Date" />
                  </p>
                </div>
              </div>

              <div className={styles.reward}>
                <GACoin />
                <div>
                  <p>
                    <FormattedMessage
                      defaultMessage="{totalReward} GAU Tokens"
                      values={{
                        totalReward: leaderboard.totalReward,
                      }}
                    />
                  </p>

                  <p className={styles.muted}>
                    <FormattedMessage defaultMessage="Total Reward" />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
}
