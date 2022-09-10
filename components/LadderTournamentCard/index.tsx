import classNames from 'classnames';
import dayjs from 'dayjs';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import useSWR from 'swr';
import Avatar from '../Avatar';
import Countdown from '../Countdown';
import GACoin from '../GACoin';
import LadderTournamentStatusDisplay from '../LadderTournamentStatusDisplay';
import { ReactComponent as Calendar } from './calendar.svg';
import styles from './LadderTournamentCard.module.css';
import { ReactComponent as Swords } from './swords.svg';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, {
  ladder: Ladder,
}>;

export default function LadderTournamentCard({ className, ladder, ...props }: Props) {
  const { data: game } = useSWR<Game>(`/games/${ladder.game}/`);
  const [isCountdownVisible, setIsCountdownVisible] = useState<boolean>(true);

  const avatarBorder = useMemo<Record<LadderTournamentStatus, DuelStatus>>(() => ({
    FINISHED: 'ENDED',
    FUTURE: 'OPEN',
    REGISTRATION: 'OPEN',
    IN_PROGRESS: 'IN_PROGRESS',
    PAUSED: 'CANCELED',
  }), [ladder.status]);

  return game === undefined ? null : (
    <div
      {...props}
      className={classNames(
        styles.ladderTournamentCard,
        className,
      )}
    >
      <Link href={`/tournaments/ladder/?id=${ladder.id}`}>
        <a className={styles.link}>
          <div className={styles.header}>
            <Avatar
              borderType={avatarBorder[ladder.status]}
              image={game.image}
              size={36}
            />

            <p className={styles.game}>{game.name}</p>

            <LadderTournamentStatusDisplay ladderStatus={ladder.status} />
          </div>

          <div className={styles.body}>
            <div className={styles.image} style={{ backgroundImage: `url(${game.image})` }}>
              <div className={styles.shadow}>
                {(ladder.status !== 'FINISHED' && isCountdownVisible) && (
                  <div className={styles.countdown}>
                    <Countdown
                      className={styles.time}
                      date={(ladder.status === 'REGISTRATION' || ladder.status === 'FUTURE') ? ladder.startsAt : ladder.endsAt}
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
              <p className={styles.title}>{ladder.name}</p>

              <div className={styles.separator} />
            </div>

            <div className={styles.details}>

              <div className={styles.detail}>
                <Calendar className={classNames(styles.calendar, styles[ladder.status])} />

                <div>
                  <p>{dayjs(ladder.startsAt).format('DD MMM, HH:mm')}</p>

                  <p className={styles.muted}>
                    <FormattedMessage defaultMessage="Starting Date" />
                  </p>
                </div>
              </div>

              <div className={styles.detail}>
                <Swords />

                <div>
                  <p>{ladder.rosterSize}</p>

                  <p className={styles.muted}>
                    <FormattedMessage defaultMessage="Team Size" />
                  </p>
                </div>
              </div>

              <div className={styles.detail}>
                <GACoin />

                <div>
                  <p>
                    <FormattedMessage
                      defaultMessage="{totalReward} GAU Tokens"
                      values={{
                        totalReward: ladder.totalReward,
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
