import classNames from 'classnames';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import GACoin from '../GACoin';
import { ReactComponent as First } from './first.svg';
import { ReactComponent as Fourth } from './fourth.svg';
import styles from './LadderTournamentPrizes.module.css';
import { ReactComponent as Second } from './second.svg';
import { ReactComponent as Third } from './third.svg';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['section']>, {
  ladder: Ladder,
}>;

export default function LadderTournamentPrizes({ className, ladder, ...props }: Props) {
  const ranks = [
    <First key="ladder-first" />,
    <Second key="ladder-second" />,
    <Third key="ladder-third" />,
    <Fourth key="ladder-fourth" />,
  ];

  return ladder.rewards.length === 0 ? null : (
    <section {...props} className={classNames(styles.ladderTournamentPrizes, className)}>
      <div className={styles.header}>
        <h4><FormattedMessage defaultMessage="Prizes Table" /></h4>
      </div>

      <div className={styles.body}>
        {ladder.rewards.sort((a, b) => b - a).map((reward, index) => (
          <div className={styles.info} key={`${reward}-${index + 1}`}>
            <div className={styles.detail}>
              {ranks[index]}

              <p>{`#${index + 1}`}</p>
            </div>

            <div className={classNames(styles.detail, styles.reward)}>
              <GACoin />

              <p>
                {reward}
                {' GAU Token'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
