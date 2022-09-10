import classNames from 'classnames';
import dayjs from 'dayjs';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import GACoin from '../GACoin';
import styles from './LeaderboardTournamentInfo.module.css';
import { ReactComponent as Calendar } from './calendar.svg';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['section']>, {
  leaderboard: Leaderboard,
}>;

export default function LeaderboardTournamentInfo({ className, leaderboard, ...props }: Props) {
  return (
    <section {...props} className={classNames(styles.leaderboardTournamentInfo, className)}>
      <div className={styles.header}>
        <h4><FormattedMessage defaultMessage="Tournament Info" /></h4>
      </div>

      <div className={styles.body}>
        <div className={classNames(styles.info, styles.startsAt)}>
          <Calendar />

          <div className={styles.infoWrapper}>
            <p className={styles.muted}><FormattedMessage defaultMessage="Starts at" /></p>

            <p>{dayjs(leaderboard.startsAt).format('DD MMM, HH:mm')}</p>
          </div>
        </div>

        <div className={classNames(styles.info, styles.endsAt)}>
          <Calendar />

          <div className={styles.infoWrapper}>
            <p className={styles.muted}><FormattedMessage defaultMessage="Ends at" /></p>

            <p>{dayjs(leaderboard.endsAt).format('DD MMM, HH:mm')}</p>
          </div>
        </div>

        <div className={classNames(styles.info, styles.reward)}>
          <GACoin />

          <div className={styles.infoWrapper}>
            <p className={styles.muted}><FormattedMessage defaultMessage="Reward" /></p>

            <p>
              <FormattedMessage
                defaultMessage="{totalReward} GAU Tokens"
                values={{
                  totalReward: leaderboard.totalReward,
                }}
              />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
