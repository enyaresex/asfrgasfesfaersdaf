import classNames from 'classnames';
import React, { useContext, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import useSWR, { mutate } from 'swr';
import { AuthAndApiContext, BreakpointContext } from '../../contexts';
import ActivityIndicator from '../ActivityIndicator';
import Avatar from '../Avatar';
import Button from '../Button';
import Modal from '../Modal';
import styles from './SettingsUserGame.module.css';
import { ReactComponent as Trash } from './trash.svg';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, {
  userGame: UserGame,
}>;

export default function SettingsUserGame({ className, userGame, ...props }: Props) {
  const { api, user } = useContext(AuthAndApiContext);
  const { device } = useContext(BreakpointContext);

  const { data: game } = useSWR<Game>(`/games/${userGame.game}/`);
  const { data: platform } = useSWR<Platform>(`/games/platforms/${userGame.platform}/`);
  const { data: gameModes } = useSWR<GameMode[]>(`/games/game_modes/?game=${userGame.game}&platform=${userGame.platform}`);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const deleteButton = (
    <>
      <Modal
        actions={(
          <>
            <Button onClick={() => setIsModalOpen(false)} type="button" variant="secondary">
              <FormattedMessage defaultMessage="Close" />
            </Button>

            <Button
              onClick={async () => {
                if (user === null) return;

                const response = await api.patch(`/games/user_games/${userGame.id}/`, {
                  isActive: false,
                });

                if (response.ok) {
                  await mutate(`/games/user_games/?user=${user.id}`);
                } else {
                  /* TODO: Handle error */
                }

                setIsModalOpen(false);
              }}
              type="button"
            >
              <FormattedMessage defaultMessage="Delete Account" />
            </Button>
          </>
        )}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <FormattedMessage defaultMessage="Are you sure you want to delete your account?" />
      </Modal>

      <button
        className={styles.button}
        onClick={async () => {
          if (user === null) return;

          setIsModalOpen(true);
        }}
        type="button"
      >
        <Trash />
      </button>
    </>
  );

  return (game === undefined || platform === undefined || user === null || gameModes === undefined)
    ? <ActivityIndicator /> : (
      <>

        {device === 'desktop' ? (
          <div {...props} className={classNames(styles.settingsUserGame, className)}>
            <div className={styles.topInfo}>
              <p className={styles.muted}>{platform.name}</p>

              {deleteButton}
            </div>

            <div className={styles.avatar}>
              <Avatar image={game.image} size={64} />
            </div>

            <p className={styles.game}>{game.name}</p>

            <p className={styles.username}>{`@${user[gameModes[0].requiredAccountField]}`}</p>
          </div>
        ) : (
          <div {...props} className={classNames(styles.settingsUserGame, className)}>
            <Avatar image={game.image} size={64} />

            <div className={styles.content}>

              <div className={styles.info}>
                <p>{game.name}</p>

                <p className={styles.muted}>{platform.name}</p>
              </div>

              <div className={styles.action}>
                {deleteButton}

                <p className={styles.username}>{`@${user[gameModes[0].requiredAccountField]}`}</p>
              </div>
            </div>
          </div>
        )}
      </>
    );
}
