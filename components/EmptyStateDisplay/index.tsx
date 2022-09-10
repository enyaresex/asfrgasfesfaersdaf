import classNames from 'classnames';
import React from 'react';
import styles from './EmptyStateDisplay.module.css';
import { ReactComponent as NoDuel } from './noDuel.svg';
import { ReactComponent as NoTournament } from './noTournament.svg';
import { ReactComponent as NoTournamentRank } from './noTournamentRank.svg';
import { ReactComponent as NoUserGame } from './noUserGame.svg';
import { ReactComponent as NoUserRival } from './noUserRival.svg';
import { ReactComponent as NoUserStat } from './noUserStat.svg';
import { ReactComponent as NoUserTrophy } from './noUserTrophy.svg';

type Kind =
  'noDuel'
  | 'noTournament'
  | 'noTournamentRank'
  | 'noTransaction'
  | 'noUserGame'
  | 'noUserRival'
  | 'noUserStat'
  | 'noUserTrophy';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, RequireAtLeastOne<{
  kind: Kind,
  message: string,
}>>;

const medias: Partial<Record<Kind, React.ReactNode>> = {
  noDuel: <NoDuel />,
  noTournament: <NoTournament />,
  noTournamentRank: <NoTournamentRank />,
  noUserGame: <NoUserGame />,
  noUserRival: <NoUserRival />,
  noUserStat: <NoUserStat />,
  noUserTrophy: <NoUserTrophy />,
};

export default function EmptyStateDisplay({ className, kind, message, ...props }: Props) {
  return (
    <div {...props} className={classNames(styles.emptyStateDisplay, className)}>
      {kind !== undefined && (
        <div className={classNames(styles.icon, kind === 'noUserGame' && styles.iconBackground)}>
          {medias[kind]}
        </div>
      )}

      {message !== undefined && <p className={styles.message}>{message}</p>}
    </div>
  );
}
