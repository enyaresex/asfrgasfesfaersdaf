import classNames from 'classnames';
import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import styles from './DuelStatus.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['section']>, {
  status: DuelStatus,
  text?: string,
}>;

export default function DuelStatus({ className, status, text, ...props }: Props) {
  const intl = useIntl();

  const duelStatus = useMemo<Record<DuelStatus, string>>(() => ({
    CANCELED: intl.formatMessage({ defaultMessage: 'Canceled' }),
    CHECKING_IN: intl.formatMessage({ defaultMessage: 'Checking In' }),
    DECLARING_RESULT: intl.formatMessage({ defaultMessage: 'Declaring Result' }),
    DECLINED: intl.formatMessage({ defaultMessage: 'Declined' }),
    ENDED: intl.formatMessage({ defaultMessage: 'Ended' }),
    EXPIRED: intl.formatMessage({ defaultMessage: 'Expired' }),
    INVITED: intl.formatMessage({ defaultMessage: 'Invited' }),
    IN_DISPUTE: intl.formatMessage({ defaultMessage: 'In Dispute' }),
    IN_PROGRESS: intl.formatMessage({ defaultMessage: 'In Progress' }),
    OPEN: intl.formatMessage({ defaultMessage: 'Open' }),
  }), [status]);

  return (
    <div
      {...props}
      className={classNames(styles.duelStatus, styles[status.toLowerCase()], className)}
    >
      {text === undefined ? duelStatus[status] : text}
    </div>
  );
}
