import classNames from 'classnames';
import React, { useContext, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import useSWR, { mutate } from 'swr';
import { AuthAndApiContext } from '../../contexts';
import { useForm } from '../../hooks';
import ActivityIndicator from '../ActivityIndicator';
import Button from '../Button';
import Errors from '../Errors';
import Progress from '../Progress';
import SectionCard from '../SectionCard';
import { ReactComponent as Tree } from './tree.svg';
import { ReactComponent as Victory } from './victory.svg';
import styles from './RamadanDuelsProgress.module.css';

type Props = React.PropsWithoutRef<JSX.IntrinsicElements['section']>;

const necessaryDuels: number = 10;

type RamadanDuelProgress = {
  beatenOpponentCount: number,
  isChallengeCampaignRewardReceived: boolean,
};

export default function RamadanDuelsProgress({ className, ...props }: Props) {
  const intl = useIntl();
  const { api, user } = useContext(AuthAndApiContext);
  const [, , , errors, setErrors] = useForm({});
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const { data: ramadanDuelsProgress } = useSWR<RamadanDuelProgress>('/duels/challenge_campaign/');

  return (user === null || user.isChallengeCampaignRewardReceived) ? null : (
    <>
      {ramadanDuelsProgress === undefined ? <ActivityIndicator /> : (
        <>
          {ramadanDuelsProgress.beatenOpponentCount === necessaryDuels ? (
            <SectionCard
              {...props}
              className={classNames(styles.ramadanDuelsProgress, className)}
              title={intl.formatMessage({ defaultMessage: 'Challenge Campaign' })}
            >
              <div className={classNames(styles.wrapper, styles.completed)}>
                <div className={classNames(styles.content)}>
                  <p className={styles.info}>
                    <FormattedMessage defaultMessage="Congratulations, you did beat your opponents. You can claim your free 30 GAU Token reward!" />
                  </p>

                  <form
                    className={styles.form}
                    onSubmit={async (e) => {
                      e.preventDefault();

                      setIsDisabled(true);

                      const response = await api.post('/duels/challenge_campaign/', {});

                      const responseJson = await response.json();

                      if (response.ok) {
                        await mutate('/duels/challenge_campaign/');
                        await mutate('/users/me/');
                      } else {
                        setErrors(responseJson);
                      }
                    }}
                  >
                    <fieldset className={styles.fieldset} disabled={isDisabled}>
                      <Errors className={styles.errors} errors={errors.nonFieldErrors} />

                      <Button size="large" type="submit" variant="green">
                        <FormattedMessage defaultMessage="Get Your Reward" />
                      </Button>
                    </fieldset>
                  </form>
                </div>

                <Victory className={styles.icon} />
              </div>
            </SectionCard>
          ) : (
            <SectionCard
              {...props}
              className={classNames(styles.ramadanDuelsProgress, className)}
              title={intl.formatMessage({ defaultMessage: 'Challenge Campaign' })}
            >
              <div className={styles.wrapper}>
                <div className={styles.content}>
                  <div className={styles.progress}>
                    <p className={styles.count}>
                      <FormattedMessage
                        defaultMessage="Beaten opponents: {count}"
                        values={{
                          count:
              <span className={styles.amount}>{`${ramadanDuelsProgress.beatenOpponentCount}/${necessaryDuels}`}</span>,
                        }}
                      />
                    </p>

                    <Progress
                      partitions={necessaryDuels}
                      progress={(ramadanDuelsProgress.beatenOpponentCount / necessaryDuels) * 100}
                    />
                  </div>

                  <p className={styles.info}>
                    <FormattedMessage defaultMessage="Beat 10 different opponents between 26th December - 10th January, get 30 GAU Tokens!" />
                  </p>
                </div>

                <Tree className={styles.icon} />
              </div>
            </SectionCard>
          )}
        </>
      )}
    </>
  );
}
