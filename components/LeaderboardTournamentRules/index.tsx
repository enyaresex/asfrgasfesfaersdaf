import classNames from 'classnames';
import React, { useState } from 'react';
import AnimateHeight from 'react-animate-height';
import { FormattedMessage } from 'react-intl';
import Markdown from '../Markdown';
import styles from './LeaderboardTournamentRules.module.css';
import { ReactComponent as Plus } from './plus.svg';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['section']>, {
  contents: string,
}>;

export default function LeaderboardTournamentRules({ className, contents, ...props }: Props) {
  const [isTournamentRulesOpen, setIsTournamentRulesOpen] = useState<boolean>(true);
  return (
    <section {...props} className={classNames(styles.leaderboardTournamentRules, className)}>
      <div className={classNames(styles.rules, isTournamentRulesOpen && styles.active)}>
        <button
          className={styles.header}
          onClick={() => setIsTournamentRulesOpen((prev) => (!prev))}
          type="button"
        >
          <p><FormattedMessage defaultMessage="Tournament Rules" /></p>

          <Plus />
        </button>

        <AnimateHeight
          duration={150}
          height={isTournamentRulesOpen ? 'auto' : 0}
        >
          <div className={styles.content}>
            <Markdown className={styles.markdown}>
              {contents}
            </Markdown>
          </div>
        </AnimateHeight>
      </div>
    </section>
  );
}
