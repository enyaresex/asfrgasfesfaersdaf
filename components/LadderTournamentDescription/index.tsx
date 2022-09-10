import classNames from 'classnames';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import styles from './LadderTournamentDescription.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['section']>, {
  ladder: Ladder,
}>;

export default function LadderTournamentDescription({ className, ladder, ...props }: Props) {
  return ladder.description === '' ? null : (
    <section {...props} className={classNames(styles.ladderTournamentDescription, className)}>
      <div className={styles.header}>
        <h4><FormattedMessage defaultMessage="Description" /></h4>
      </div>

      <div className={styles.body}>
        {ladder.description}
      </div>
    </section>
  );
}
