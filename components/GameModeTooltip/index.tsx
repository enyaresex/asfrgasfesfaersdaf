import classNames from 'classnames';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import useSWR from 'swr';
import Markdown from '../Markdown';
import Tippy from '../Tippy';
import styles from './GameModeTooltip.module.css';
import { ReactComponent as Info } from './info.svg';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['button']>, {
  gameModeId: number | null,
}>;

export default function GameModeTooltip({ className, gameModeId, ...props }: Props) {
  const { data: gameMode } = useSWR<GameMode>(gameModeId === null ? null : `/games/game_modes/${gameModeId}/`);

  return gameMode === undefined ? null : (
    <Tippy
      content={(
        <Markdown>
          {gameMode.rules}
        </Markdown>
      )}
    >
      <button {...props} className={classNames(styles.gameModeTooltip, className)} type="button">
        <div className={styles.content}>
          <Info />

          <p>
            <FormattedMessage defaultMessage="{gameMode} Rules" values={{ gameMode: gameMode.name }} />
          </p>
        </div>
      </button>
    </Tippy>
  );
}
