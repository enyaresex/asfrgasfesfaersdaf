import dayjs, { Dayjs } from 'dayjs';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import useSWR from 'swr';
import Modal from '../Modal';
import { ReactComponent as Clock } from './clock.svg';
import styles from './DateTimeCheckModal.module.css';

type DateTimeResponse = {
  dateTime: string,
};

export default function DateTimeCheckModal() {
  const router = useRouter();
  const intl = useIntl();
  const { data: dateTimeResponse } = useSWR<DateTimeResponse>('/date_time/');

  const serverDateTime = useMemo<Dayjs | null>(() => {
    if (dateTimeResponse === undefined) return null;

    return dayjs(dateTimeResponse.dateTime);
  }, [dateTimeResponse]);

  const isDateTimeWrong = useMemo<boolean>(() => {
    if (serverDateTime === null) return false;

    return Math.abs(serverDateTime.diff(dayjs(), 'second')) > 60;
  }, [serverDateTime]);

  return (
    <Modal
      dialogClassName={styles.dateTimeCheckModal}
      isOpen={router.pathname !== '/' && isDateTimeWrong}
      title={intl.formatMessage({ defaultMessage: 'Your Computer Clock is Wrong' })}
    >
      <div className={styles.visual}>
        <Clock />
      </div>

      <div className={styles.body}>
        <FormattedMessage
          defaultMessage="For Gamer Arena to function properly, you computer's clock should be correct. Please check the date, time and time zone settings of your computer."
        />

        <div className={styles.values}>
          <p>
            <FormattedMessage
              defaultMessage="Your computers time: {dateTime}"
              values={{ dateTime: dayjs().format('L LT') }}
            />
          </p>

          <p>
            <FormattedMessage
              defaultMessage="Server time: {dateTime}"
              values={{ dateTime: serverDateTime?.format('L LT') }}
            />
          </p>
        </div>
      </div>
    </Modal>
  );
}
