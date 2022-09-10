import classNames from 'classnames';
import React from 'react';
import useSWR from 'swr';
import Avatar from '../Avatar';
import { ReactComponent as Swords } from './swords.svg';
import FormGroup from '../FormGroup';
import RadioInput from '../RadioInput';
import styles from './EndedDuelDisplay.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, {
  duel: Duel,
}>;

export default function EndedDuelDisplay({ className, duel, ...props }: Props) {
  const { data: user1 } = useSWR(`/users/${duel.user1}/`);
  const { data: user2 } = useSWR(`/users/${duel.user2}/`);

  return user1 === undefined || user2 === undefined ? null : (
    <div {...props} className={classNames(styles.endedDuelDisplay, className)}>
      <FormGroup>
        <RadioInput
          alignContentCenter
          checked={duel.userWon === user1.id}
          className={classNames(duel.userWon !== user1.id && styles.lost)}
          disabled
          hideRadioButton
          id="result_declaration-user-1"
          label={(
            <div className={styles.content}>
              <Avatar image={user1.avatar} size={40} />

              <p>{user1.username}</p>
            </div>
          )}
          value={user1.id}
        />
      </FormGroup>

      <Swords />

      <FormGroup>
        <RadioInput
          alignContentCenter
          checked={duel.userWon === user2.id}
          className={classNames(duel.userWon !== user2.id && styles.lost)}
          disabled
          hideRadioButton
          id="result_declaration-user-2"
          label={(
            <div className={styles.content}>
              <Avatar image={user2.avatar} size={40} />

              <div className={styles.info}>
                <p>{user2.username}</p>
              </div>
            </div>
          )}
          value={user2.id}
        />
      </FormGroup>
    </div>
  );
}
