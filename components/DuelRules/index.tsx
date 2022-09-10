import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import AnimateHeight from 'react-animate-height';
import { FormattedMessage } from 'react-intl';
import useSWR from 'swr';
import Markdown from '../Markdown';
import styles from './DuelRules.module.css';
import { ReactComponent as Plus } from './plus.svg';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['section']>, {
  content: string,
  duel: HydratedDuel,
}>;

export default function DuelRules({ className, content, duel, ...props }: Props) {
  const [isDuelRulesOpen, setIsDuelRulesOpen] = useState<boolean>(false);
  const [isGameModeRulesOpen, setIsGameModeRulesOpen] = useState<boolean>(true);
  const { data: gameMode } = useSWR<GameMode>(`/games/game_modes/${duel.gameMode}/`);

  useEffect(() => {
    function onHashChange(): void {
      if (window.location.hash === '#duelRules' && !isDuelRulesOpen) {
        setIsDuelRulesOpen(true);
      }
    }

    window.addEventListener('hashchange', onHashChange);

    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return (
    <section {...props} className={classNames(className, styles.duelRules)}>
      {gameMode === undefined ? null : (
        <div className={classNames(styles.rules, isGameModeRulesOpen && styles.active)}>
          <button
            className={styles.header}
            onClick={() => setIsGameModeRulesOpen((prev) => (!prev))}
            type="button"
          >
            <p>
              <FormattedMessage defaultMessage="Game Mode Rules" />
            </p>

            <Plus />
          </button>

          <AnimateHeight
            duration={150}
            height={isGameModeRulesOpen ? 'auto' : 0}
          >
            <div className={styles.content}>
              <Markdown className={styles.markdown}>
                {gameMode.rules}
              </Markdown>
            </div>
          </AnimateHeight>
        </div>
      )}

      <div className={classNames(styles.rules, isDuelRulesOpen && styles.active)} id="duelRules">
        <button
          className={styles.header}
          onClick={() => setIsDuelRulesOpen((prev) => (!prev))}
          type="button"
        >
          <p>
            <FormattedMessage defaultMessage="Duel Rules" />
          </p>

          <Plus />
        </button>

        <AnimateHeight
          duration={150}
          height={isDuelRulesOpen ? 'auto' : 0}
        >
          <div className={styles.content}>
            <Markdown className={styles.markdown}>
              {content}
            </Markdown>
          </div>
        </AnimateHeight>
      </div>
    </section>
  );
}
