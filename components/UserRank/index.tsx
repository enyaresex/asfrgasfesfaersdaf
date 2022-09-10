import classNames from 'classnames';
import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { ReactComponent as BronzeMedal } from './bronzeMedal.svg';
import { ReactComponent as GoldMedal } from './goldMedal.svg';
import { ReactComponent as SilverMedal } from './silverMedal.svg';
import styles from './UserRank.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, {
  rank: Rank;
}>;

export default function UserRank({ className, rank, ...props }: Props) {
  const intl = useIntl();
  const ranks = useMemo<Record<Rank, React.ReactNode>>(() => ({
    bronze: (
      <>
        <BronzeMedal />

        {intl.formatMessage({ defaultMessage: 'Bronze' })}
      </>
    ),
    gold: (
      <>
        <GoldMedal />

        {intl.formatMessage({ defaultMessage: 'Gold' })}
      </>
    ),
    platinum: (
      <>
        <SilverMedal />

        {intl.formatMessage({ defaultMessage: 'Platinum' })}
      </>
    ),
    silver: (
      <>
        <SilverMedal />

        {intl.formatMessage({ defaultMessage: 'Silver' })}
      </>
    ),
  }), []);

  return (
    <div {...props} className={classNames(className, styles.userRank, styles[rank])} data-cy="userRank">
      {ranks[rank]}
    </div>
  );
}
