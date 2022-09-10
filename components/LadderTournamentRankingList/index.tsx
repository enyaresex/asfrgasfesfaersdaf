import classNames from 'classnames';
import React, { useContext } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { BreakpointContext } from '../../contexts';
import LadderTournamentRank from '../LadderTournamentRank';
import styles from './LadderTournamentRankingList.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, {
  entries: LadderEntry[],
  ladder: Ladder,
}>;

export default function LadderTournamentRankingList({ className, entries, ladder, ...props }: Props) {
  const intl = useIntl();
  const { breakpoint, device } = useContext(BreakpointContext);

  return (
    <div
      {...props}
      className={classNames(styles.ladderTournamentRankingList, className)}
    >
      <table className={styles.table}>
        <thead>
          <tr>
            {device === 'desktop' && (
              <th aria-label={intl.formatMessage({ defaultMessage: 'Trophy' })} />
            )}

            <th aria-label={intl.formatMessage({ defaultMessage: 'Rank' })}>
              <FormattedMessage defaultMessage="Rank" />
            </th>

            <th
              aria-label={intl.formatMessage({ defaultMessage: 'Username' })}
              colSpan={breakpoint === 'xs' ? 1 : 4}
            >
              <FormattedMessage defaultMessage="Team Name" />
            </th>

            <th aria-label={intl.formatMessage({ defaultMessage: 'Lose' })}>
              <FormattedMessage defaultMessage="Points" />
            </th>

            <th
              aria-label={intl.formatMessage({ defaultMessage: 'Reward' })}
              colSpan={breakpoint === 'xs' ? 1 : 2}
            >
              <FormattedMessage defaultMessage="Reward" />
            </th>
          </tr>
        </thead>

        <tbody>
          {entries.map((e, i) => (
            <LadderTournamentRank
              entry={e}
              key={e.id}
              ladder={ladder}
              rank={i}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
