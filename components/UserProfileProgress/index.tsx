import classNames from 'classnames';
import Link from 'next/link';
import React, { useContext, useMemo, useState } from 'react';
import AnimateHeight from 'react-animate-height';
import { FormattedMessage, useIntl } from 'react-intl';
import { AnalyticsContext, AuthAndApiContext, BreakpointContext } from '../../contexts';
import { createGtag } from '../../helpers';
import ActivityIndicator from '../ActivityIndicator';
import Button from '../Button';
import GACoin from '../GACoin';
import Progress from '../Progress';
import SectionCard from '../SectionCard';
import { ReactComponent as Check } from './check.svg';
import { ReactComponent as Current } from './current.svg';
import styles from './UserProfileProgress.module.css';
import { ReactComponent as Waiting } from './waiting.svg';

type Props = React.PropsWithoutRef<JSX.IntrinsicElements['section']>;

type Step =
  'addGameAccount'
  | 'addProfilePhoto'
  | 'connectDiscord'
  | 'verifyEmail'
  | 'verifyPhone';

type StepDetail = {
  action: React.ReactNode,
  icon: React.ReactNode,
  text: React.ReactNode,
};

export default function UserProfileProgress({ className, ...props }: Props) {
  const intl = useIntl();
  const { category } = useContext(AnalyticsContext);
  const { user } = useContext(AuthAndApiContext);
  const { device } = useContext(BreakpointContext);

  const [collapsed, setCollapsed] = useState<boolean>(device !== 'desktop');

  const todo = useMemo<Record<Step, boolean>>(() => ({
    addGameAccount: user?.isGameAccountBonusReceived || false,
    addProfilePhoto: user?.isSettingAvatarBonusReceived || false,
    connectDiscord: user?.isDiscordVerificationBonusReceived || false,
    verifyEmail: user?.isEmailVerificationBonusReceived || false,
    verifyPhone: user?.isPhoneNumberVerificationBonusReceived || false,
  }), [user]);

  const coins = useMemo<Record<Step, number>>(() => ({
    addGameAccount: 1,
    addProfilePhoto: 1,
    connectDiscord: 1,
    verifyEmail: 4,
    verifyPhone: 6,
  }), []);

  const steps = useMemo<Record<Step, StepDetail>>(() => ({
    verifyEmail: todo.verifyEmail ? {
      action: intl.formatMessage({ defaultMessage: 'Gained +{coin} Tokens' }, { coin: coins.verifyEmail }),
      icon: <Check />,
      text: intl.formatMessage({ defaultMessage: 'Verified e-mail address' }),
    } : {
      action: (
        <Link href="/settings?section=profileSettings" passHref>
          <Button
            data-gtag={createGtag({ category, event: 'Click Verify Email Address', label: 'General' })}
            icon="go"
            variant="secondary"
          />
        </Link>
      ),
      icon: <Waiting />,
      text: intl.formatMessage({ defaultMessage: 'Verify e-mail address{br}(Gain +{coin} Tokens)' },
        { coin: coins.verifyEmail, br: <br /> }),
    },
    verifyPhone: todo.verifyPhone ? {
      action: intl.formatMessage({ defaultMessage: 'Gained +{coin} Tokens' }, { coin: coins.verifyPhone }),
      icon: <Check />,
      text: intl.formatMessage({ defaultMessage: 'Verified phone number' }),
    } : {
      action: (
        <Link href="/settings?section=profileSettings" passHref>
          <Button
            data-gtag={createGtag({ category, event: 'Click Verify Phone Number', label: 'General' })}
            icon="go"
            variant="secondary"
          />
        </Link>
      ),
      icon: <Waiting />,
      text: intl.formatMessage({ defaultMessage: 'Verify phone number{br}(Gain +{coin} Tokens)' },
        { coin: coins.verifyPhone, br: <br /> }),
    },
    addProfilePhoto: todo.addProfilePhoto ? {
      action: intl.formatMessage({ defaultMessage: 'Gained +{coin} Tokens' }, { coin: coins.addProfilePhoto }),
      icon: <Check />,
      text: intl.formatMessage({ defaultMessage: 'Added profile photo' }),
    } : {
      action: (
        <Link href="/settings" passHref>
          <Button
            data-gtag={createGtag({ category, event: 'Click Add Profile Photo', label: 'General' })}
            icon="go"
            variant="secondary"
          />
        </Link>
      ),
      icon: <Waiting />,
      text: intl.formatMessage({ defaultMessage: 'Add a profile photo{br}(Gain +{coin} Tokens)' },
        { coin: coins.addProfilePhoto, br: <br /> }),
    },
    connectDiscord: todo.connectDiscord ? {
      action: intl.formatMessage({ defaultMessage: 'Gained +{coin} Tokens' }, { coin: coins.connectDiscord }),
      icon: <Check />,
      text: intl.formatMessage({ defaultMessage: 'Connected Discord Account' }),
    } : {
      action: (
        <Link href="/settings?section=socialAccounts" passHref>
          <Button
            data-gtag={createGtag({ category, event: 'Click Connect Discord', label: 'General' })}
            icon="go"
            variant="secondary"
          />
        </Link>
      ),
      icon: <Waiting />,
      text: intl.formatMessage({ defaultMessage: 'Connect Discord account{br}(Gain +{coin} Tokens)' },
        { coin: coins.connectDiscord, br: <br /> }),
    },
    addGameAccount: todo.addGameAccount ? {
      action: intl.formatMessage({ defaultMessage: 'Gained +{coin} Tokens' }, { coin: coins.addGameAccount }),
      icon: <Check />,
      text: intl.formatMessage({ defaultMessage: 'Added game accounts' }),
    } : {
      action: (
        <Link href="/settings?section=addDropGames" passHref>
          <Button
            data-gtag={createGtag({ category, event: 'Click Add Game Account', label: 'General' })}
            icon="go"
            variant="secondary"
          />
        </Link>
      ),
      icon: <Waiting />,
      text: intl.formatMessage({ defaultMessage: 'Add game accounts{br}(Gain +{coin} Tokens)' },
        { coin: coins.addGameAccount, br: <br /> }),
    },
  }), [todo]);

  const completionRatio = useMemo<number>(() => {
    const values = Object.values(todo);

    return (values.filter((s) => s).length / values.length) * 100;
  }, [todo]);

  const totalGain = useMemo<number>(() => (Object.keys(todo) as Step[]).filter((s) => todo[s])
    .map((s) => coins[s]).reduce((curr, acc) => curr + acc, 0), [todo]);

  const progressBar = useMemo<React.ReactNode>(() => (
    <div className={styles.progressBar}>
      <div className={styles.summary}>
        <p>
          <FormattedMessage
            defaultMessage="Profile Completion: {ratio}"
            values={{
              ratio: <span className={styles.coin}>{`${completionRatio}%`}</span>,
            }}
          />
        </p>

        <p className={styles.gained}>
          <FormattedMessage
            defaultMessage="Gained {coin} {gaCoin}"
            values={{
              coin: (totalGain > 0 ? `+${totalGain}` : totalGain),
              gaCoin: <GACoin />,
            }}
          />
        </p>
      </div>

      <Progress partitions={Object.values(todo).length} progress={completionRatio} />

      <p className={styles.subText}>
        <FormattedMessage defaultMessage="Complete profile to earn free coins" />
      </p>
    </div>
  ), [completionRatio, totalGain]);

  return user === null ? <ActivityIndicator /> : (
    <>
      {Object.values(todo).filter((td) => !td).length === 0 ? null : (
        <>
          {device === 'desktop' ? (
            <SectionCard
              className={classNames(styles.userProfileProgress, className)}
              collapsible
              title={intl.formatMessage({ defaultMessage: 'Profile Tasks' })}
            >
              <div className={styles.progress}>
                {progressBar}
              </div>

              <div className={styles.wrapper}>
                {(Object.keys(steps) as Step[]).map((key) => (
                  <div className={styles.step} key={key}>
                    <div className={styles.detail}>
                      {steps[key].icon}

                      <p>{steps[key].text}</p>
                    </div>

                    <div className={styles.action}>
                      <p>{steps[key].action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          ) : (
            <section {...props} className={classNames(styles.userProfileProgress, className)}>
              <button
                className={classNames(styles.header, !collapsed && styles.opened)}
                onClick={() => setCollapsed((prev) => (!prev))}
                type="button"
              >
                {progressBar}
              </button>

              <AnimateHeight duration={150} height={collapsed ? 0 : 'auto'}>
                <div className={styles.content}>
                  <div className={styles.wrapper}>
                    {(Object.keys(steps) as Step[]).map((key) => (
                      <div className={styles.step} key={key}>
                        <div className={styles.detail}>
                          {steps[key].icon}

                          <p>{steps[key].text}</p>
                        </div>

                        <div className={styles.action}>
                          <p>{steps[key].action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimateHeight>

              <button
                className={classNames(styles.toggle, collapsed && styles.collapsed)}
                onClick={() => setCollapsed((prev) => !prev)}
                type="button"
              >
                <Current />
              </button>
            </section>
          )}
        </>
      )}
    </>
  );
}
