import classNames from 'classnames';
import React from 'react';
import useSWR from 'swr';
import Avatar from '../Avatar';
import { ReactComponent as Swords } from './swords.svg';
import FormGroup from '../FormGroup';
import TextInput from '../TextInput';
import styles from './ResultDeclarationDisplayWithScore.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, {
  duel: Duel,
  errors: Record<string, string[]>,
  isDisabled: boolean,
  scores: Score,
  setScores: (x: Score) => void,
}>;

type Score = {
  user1Score: number | null,
  user2Score: number | null,
};

export default function ResultDeclarationDisplayWithScore({
  className,
  duel,
  errors,
  isDisabled,
  scores,
  setScores,
  ...props
}: Props) {
  const { data: user1 } = useSWR(`/users/${duel.user1}/`);
  const { data: user2 } = useSWR(`/users/${duel.user2}/`);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setScores({ ...scores, [e.target.name]: e.target.value });
  };

  return user1 === undefined || user2 === undefined ? null : (
    <div {...props} className={classNames(styles.resultDeclarationDisplayWithScore, className)}>
      <div className={classNames(styles.user, styles.user1)}>
        <div className={styles.userDetails}>
          <Avatar
            image={user1.avatar}
            size={44}
          />

          <h4>{user1.username}</h4>
        </div>

        <FormGroup className={styles.scoreInput} error={errors.user1Score}>
          <TextInput
            autoComplete="off"
            disabled={isDisabled}
            id="user1-score"
            maxLength={2}
            name="user1Score"
            onBlur={handleInput}
            onChange={handleInput}
            required
            value={scores.user1Score === null ? '' : scores.user1Score.toString()}
          />
        </FormGroup>
      </div>

      <Swords />

      <div className={classNames(styles.user, styles.user2)}>
        <div className={styles.userDetails}>
          <Avatar
            image={user2.avatar}
            size={44}
          />

          <h4>{user2.username}</h4>
        </div>

        <FormGroup className={styles.scoreInput} error={errors.user2Score}>
          <TextInput
            autoComplete="off"
            disabled={isDisabled}
            id="user2-score"
            maxLength={2}
            name="user2Score"
            onBlur={handleInput}
            onChange={handleInput}
            required
            value={scores.user2Score === null ? '' : scores.user2Score.toString()}
          />
        </FormGroup>
      </div>
    </div>
  );
}
