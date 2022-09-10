import classNames from 'classnames';
import React from 'react';
import useSWR from 'swr';
import Avatar from '../Avatar';
import { ReactComponent as Swords } from './swords.svg';
import FormGroup from '../FormGroup';
import TextInput from '../TextInput';
import styles from './EndedDuelDisplayWithScore.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, {
  duel: Duel,
}>;

export default function EndedDuelDisplayWithScore({ className, duel, ...props }: Props) {
  const { data: user1 } = useSWR(`/users/${duel.user1}/`);
  const { data: user2 } = useSWR(`/users/${duel.user2}/`);

  return user1 === undefined || user2 === undefined ? null : (
    <div {...props} className={classNames(styles.endedDuelDisplayWithScore, className)}>
      <div className={classNames(styles.user, styles.user1)}>
        <div className={styles.userDetails}>
          <Avatar
            borderColor={duel.userWon === user1.id ? 'green' : 'red'}
            image={user1.avatar}
            size={44}
          />

          <h4>{user1.username}</h4>
        </div>

        <FormGroup className={styles.scoreInput}>
          <TextInput
            className={classNames(duel.userWon === user1.id && styles.won)}
            disabled
            id="user1-score"
            maxLength={2}
            name="user1Score"
            required
            value={duel.user1Score === null ? '' : duel.user1Score.toString()}
          />
        </FormGroup>
      </div>

      <Swords />

      <div className={classNames(styles.user, styles.user2)}>
        <div className={styles.userDetails}>
          <Avatar
            borderColor={duel.userWon === user2.id ? 'green' : 'red'}
            image={user2.avatar}
            size={44}
          />

          <h4>{user2.username}</h4>
        </div>

        <FormGroup className={styles.scoreInput}>
          <TextInput
            className={classNames(duel.userWon === user2.id && styles.won)}
            disabled
            id="user2-score"
            maxLength={2}
            name="user2Score"
            required
            value={duel.user2Score === null ? '' : duel.user2Score.toString()}
          />
        </FormGroup>
      </div>
    </div>
  );
}
