import classNames from 'classnames';
import React from 'react';
import useSWR from 'swr';
import Avatar from '../Avatar';
import { ReactComponent as Swords } from './swords.svg';
import FormGroup from '../FormGroup';
import RadioInput from '../RadioInput';
import styles from './ResultDeclarationDisplay.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, {
  duel: Duel,
  errors: Record<string, string[]>,
  isDisabled: boolean,
  setUserWon: (x: Props['userWon']) => void,
  userWon: number | null,
}>;

export default function ResultDeclarationDisplay({
  className,
  duel,
  errors,
  isDisabled,
  setUserWon,
  userWon,
  ...props
}: Props) {
  const { data: user1 } = useSWR(`/users/${duel.user1}/`);
  const { data: user2 } = useSWR(`/users/${duel.user2}/`);

  return user1 === undefined || user2 === undefined ? null : (
    <div {...props} className={classNames(styles.resultDeclarationDisplay, className)}>
      <FormGroup error={errors.userWon}>
        <RadioInput
          alignContentCenter
          checked={userWon === user1.id}
          disabled={isDisabled}
          hideRadioButton
          id="result_declaration-user-1"
          label={(
            <div className={styles.content}>
              <Avatar image={user1.avatar} size={40} />

              <p>{user1.username}</p>
            </div>
          )}
          onChange={(e) => setUserWon(Number(e.target.value))}
          value={user1.id}
        />
      </FormGroup>

      <Swords />

      <FormGroup error={errors.userWon}>
        <RadioInput
          alignContentCenter
          checked={userWon === user2.id}
          disabled={isDisabled}
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
          onChange={(e) => setUserWon(Number(e.target.value))}
          value={user2.id}
        />
      </FormGroup>
    </div>
  );
}
