import classNames from 'classnames';
import React, { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import useSWR from 'swr';
import { RegionContext } from '../../contexts';
import GACoin from '../GACoin';
import styles from './DuelFormat.module.css';
import { ReactComponent as Mode } from './mode.svg';
import { ReactComponent as Platform } from './platform.svg';
import { ReactComponent as Trophy } from './trophy.svg';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['section']>, {
  duel: HydratedDuel
}>;

export default function DuelFormat({ className, duel, ...props }: Props) {
  const { region } = useContext(RegionContext);

  const { data: gameModes } = useSWR<GameMode[]>(`/games/game_modes/?is_active=true&region=${region.id}`);
  const { data: platforms } = useSWR<Platform[]>(`/games/platforms/?is_active=true&region=${region.id}`);

  const gameMode: GameMode | undefined = (gameModes !== undefined)
    ? gameModes.find((gm) => gm.id === duel.gameMode)
    : undefined;
  const platform: Platform | undefined = (platforms !== undefined && gameMode !== undefined)
    ? platforms.find((p) => p.id === gameMode.platform)
    : undefined;

  return (platform === undefined || gameMode === undefined) ? null : (
    <section {...props} className={classNames(className, styles.duelFormat)}>
      <div className={styles.header}>
        <FormattedMessage defaultMessage="Duel Format" />
      </div>

      <div className={styles.content}>
        <div className={styles.box}>
          <div className={styles.boxWrapper}>
            <div className={styles.icon}>
              <Trophy />
            </div>

            <div className={styles.info}>
              <p className={styles.title}>
                <FormattedMessage defaultMessage="Total Reward" />
              </p>

              <p>{`${duel.reward} GAU Token`}</p>
            </div>
          </div>
        </div>

        <div className={styles.box}>
          <div className={styles.boxWrapper}>
            <div className={styles.icon}>
              <GACoin triple />
            </div>

            <div className={styles.info}>
              <p className={styles.title}>
                <FormattedMessage defaultMessage="Entry Fee" />
              </p>

              <p>{`${duel.entryFee} GAU Token`}</p>
            </div>
          </div>
        </div>

        <div className={styles.box}>
          <div className={styles.boxWrapper}>
            <div className={styles.icon}>
              <Platform />
            </div>

            <div className={styles.info}>
              <p className={styles.title}>
                <FormattedMessage defaultMessage="Platform" />
              </p>

              <p>{platform.name}</p>
            </div>
          </div>
        </div>

        <div className={styles.box}>
          <div className={styles.boxWrapper}>
            <div className={styles.icon}>
              <Mode />
            </div>

            <div className={styles.info}>
              <p className={styles.title}>
                <FormattedMessage defaultMessage="Game Mode" />
              </p>

              <p>{gameMode.name}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
