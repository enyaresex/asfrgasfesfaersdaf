import classNames from 'classnames';
import React, { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSWRInfinite } from 'swr';
import ActivityIndicator from '../ActivityIndicator';
import Button from '../Button';
import EmptyStateDisplay from '../EmptyStateDisplay';
import UserDuelRival from '../UserDuelRival';
import styles from './UserDuelRivals.module.css';

type Pagination = {
  next: null | string,
  previous: null | string,
  results: UserDuelRival[],
};

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['section']>, {
  userId: number,
}>;

export default function UserDuelRivals({ className, userId, ...props }: Props) {
  const intl = useIntl();
  const { data, size, setSize } = useSWRInfinite<Pagination>((pageIndex, previousPageData) => {
    if (pageIndex === 0 || previousPageData === null || previousPageData.next === null) return `/duels/user_rivals/${userId}/`;

    return new URL(previousPageData.next).pathname + new URL(previousPageData.next).search;
  });

  const rivals = useMemo<UserDuelRival[] | null>(() => (data === undefined ? null
    : data.map((d) => d.results).flat()), [data]);

  return rivals === null ? <ActivityIndicator /> : (
    <section {...props} className={classNames(styles.userDuelRivals, className)}>
      {rivals.length === 0 ? (
        <EmptyStateDisplay
          kind="noUserRival"
          message={intl.formatMessage({ defaultMessage: 'This user hasn\'t completed any duels yet.' })}
        />
      ) : (
        <div className={styles.body}>
          {rivals.map((r) => <UserDuelRival key={`${r.user}-${r.duelCount}`} rival={r} />)}

          {data !== undefined && data.slice(-1)[0].next !== null && (
            <div className={styles.showMoreButtonWrapper}>
              <Button
                className={styles.submit}
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
      )}
    </section>
  );
}
