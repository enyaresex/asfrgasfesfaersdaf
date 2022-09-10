import classNames from 'classnames';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import useSWR, { useSWRInfinite } from 'swr';
import { RegionContext } from '../../contexts';
import Button from '../Button';
import UserCard from '../UserCard';
import styles from './UserCardList.module.css';

type Pagination = {
  next: null | string,
  previous: null | string,
  results: NewGameUser[],
};

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['section']>, {
  gameId: number,
  hideIfEmpty?: boolean,
  isPaginationEnabled?: boolean,
  platformId: number | null,
  viewAll?: boolean,
}>;

export default function UserCardList({
  className,
  gameId,
  hideIfEmpty = false,
  isPaginationEnabled = true,
  platformId,
  viewAll = false,
  ...props
}: Props) {
  const { region } = useContext(RegionContext);
  const [newUsers, setNewUsers] = useState<NewGameUser[] | null>(null);

  const { data, size, setSize } = useSWRInfinite<Pagination>((pageIndex, previousPageData) => {
    if (pageIndex === 0 || previousPageData === null || previousPageData.next === null) {
      return platformId === null
        ? `/games/user_game_new_players/?game=${gameId}&region=${region.id}`
        : `/games/user_game_new_players/?game=${gameId}&platform=${platformId}&region=${region.id}`;
    }

    return new URL(previousPageData.next).pathname + new URL(previousPageData.next).search;
  });

  useEffect(() => {
    setNewUsers(() => (data === undefined
      ? null
      : data.map((d) => d.results).flat()));
  }, [data]);

  const { data: game } = useSWR<Game>(gameId === null ? null : `/games/${gameId}/`);

  return (newUsers === null || newUsers.length === 0) ? null : (
    <section {...props} className={classNames(className, styles.userCardList)} data-cy="userCardList">
      <div className={classNames(hideIfEmpty && styles.hideList)}>
        <div className={styles.header}>
          {game !== undefined && (
            <h3>
              <FormattedMessage
                defaultMessage="New {game} Players"
                values={{
                  game: game.name,
                }}
              />

              <span className={styles.duelCount}>
                {` (${newUsers?.length})`}
              </span>
            </h3>
          )}

          {viewAll && (
            <Link href="/">
              <a className={styles.viewAll}>
                <FormattedMessage defaultMessage="View All" />
              </a>
            </Link>
          )}
        </div>

        <div className={styles.cards}>
          {newUsers.map((u) => (
            <UserCard
              gameId={gameId}
              key={`${u.rank}-${u.id}`}
              rank={u.rank}
              userId={u.user}
            />
          ))}
        </div>

        {isPaginationEnabled && ((data === undefined) || (data.slice(-1)[0].next !== null)) && (
          <div className={styles.showMoreButtonWrapper}>
            <Button
              className={styles.showMore}
              onClick={() => setSize(size + 1)}
              size="large"
              type="button"
              variant="secondary"
            >
              <FormattedMessage defaultMessage="Show More" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
