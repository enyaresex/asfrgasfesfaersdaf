import classNames from 'classnames';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { mutate } from 'swr';
import Countdown from '../Countdown';
import styles from './DuelInProgress.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, {
  duel: HydratedDuel,
}>;

export default function DuelInProgress({ className, duel, ...props }: Props) {
  return duel.resultDeclarationStartsAt === null ? null : (
    <div {...props} className={classNames(className, styles.duelInProgress)}>
      <Countdown
        color="orange"
        date={duel.resultDeclarationStartsAt}
        onComplete={async () => {
          await mutate(`/duels/${duel.id}/`);
        }}
      />

      <p className={styles.message}>
        <FormattedMessage defaultMessage="The match has started. Find and add your opponent in-game. If you didn’t come back here to declare the result once the match ends. " />
      </p>
    </div>
  );
}
