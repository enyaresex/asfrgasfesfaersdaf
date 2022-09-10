import classNames from 'classnames';
import React, { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Container from '../Container';
import SignUpOrSignIn from '../SignUpOrSignIn';
import { ReactComponent as Competition } from './competition.svg';
import { ReactComponent as Opponent } from './opponent.svg';
import { ReactComponent as Reward } from './reward.svg';
import styles from './SignUpContainer.module.css';

type Props = React.PropsWithoutRef<JSX.IntrinsicElements['div']>;

type Detail = {
  content: React.ReactNode
  icon: React.ReactNode,
  title: string,
};

type Content = {
  details: Detail[],
  subTitle: string,
  title: string,
};

export default function SignUpContainer({ className, ...props }: Props) {
  const intl = useIntl();
  const content = useMemo<Content>(() => ({
    details: [
      {
        content: (
          <p className={styles.content}>
            <FormattedMessage defaultMessage="Find similarly skilled players to compete with on the games you love." />
          </p>
        ),
        icon: <Competition />,
        title: intl.formatMessage({ defaultMessage: 'Find an Opponent' }),
      }, {
        content: (
          <p className={styles.content}>
            <FormattedMessage defaultMessage="Participate in duels and tournaments to show what you are made of." />
          </p>
        ),
        icon: <Opponent />,
        title: intl.formatMessage({ defaultMessage: 'Show Yourself' }),
      }, {
        content: (
          <p className={styles.content}>
            <FormattedMessage defaultMessage="Win GAU Tokens which you can actually exchange to real money." />
          </p>
        ),
        icon: <Reward />,
        title: intl.formatMessage({ defaultMessage: 'Win Rewards' }),
      }],
    subTitle: intl.formatMessage({ defaultMessage: 'In Gamer Arena, you can participate in online duels and tournaments for the games you like to start winning GAU Tokens! PC, PlayStation, Xbox and mobile gamers are all welcome.' }),
    title: intl.formatMessage({ defaultMessage: 'Competitive Gaming Platform' }),
  }), []);

  return (
    <div {...props} className={classNames(className, styles.signUpContainer)}>
      <div className={styles.background} />

      <div className={classNames(styles.overlay, styles.background)} />

      <Container className={styles.container}>
        <div className={styles.col}>
          <div className={styles.main}>
            <h4 className={styles.title}>{content.title}</h4>

            <p className={styles.subTitle}>{content.subTitle}</p>
          </div>

          <div className={styles.info}>
            {content.details.map((d) => (
              <div className={styles.details} key={d.title}>
                <div className={styles.icon}>
                  {d.icon}
                </div>

                <div className={styles.detail}>
                  <p className={styles.title}>{d.title}</p>

                  <div className={styles.content}>{d.content}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.col}>
          <SignUpOrSignIn />
        </div>
      </Container>
    </div>
  );
}
