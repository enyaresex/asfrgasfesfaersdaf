import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { AuthAndApiContext } from '../../contexts';
import Button from '../Button';
import GACoin from '../GACoin';
import SignIn from '../SignIn';
import SignUp from '../SignUp';
import styles from './SignUpOrSignIn.module.css';

type Props = React.PropsWithoutRef<JSX.IntrinsicElements['section']>;

type State = 'signIn' | 'signUp' | 'user';

export default function SignUpOrSignIn({ className, ...props }: Props) {
  const router = useRouter();
  const { user } = useContext(AuthAndApiContext);
  const currentState = useMemo<State>(() => {
    if (user !== null) return 'user';

    if (router.query.action === 'sign-in') return 'signIn';

    return 'signUp';
  }, [user, router.query.action]);

  const stateTitles = useMemo<Record<State, React.ReactNode>>(() => ({
    signIn: (
      <FormattedMessage defaultMessage="Sign In to Continue" />
    ),
    signUp: (
      <FormattedMessage
        defaultMessage="Signup and Get Free 13 {gaCoin} GAU Token"
        values={{
          gaCoin: <GACoin className={styles.gaCoin} triple />,
        }}
      />
    ),
    user: (
      <FormattedMessage defaultMessage="Welcome {username}!" values={{ username: user?.username }} />
    ),
  }), []);

  const stateDescriptions = useMemo<Record<State, React.ReactNode>>(() => ({
    signIn: (
      <>
        <FormattedMessage defaultMessage="Don't have an account?" />
        {' '}
        <Link
          href={{
            pathname: router.pathname,
            query: { ...router.query, action: 'sign-up' },
          }}
        >
          <a className={styles.stateButton} type="button">
            <FormattedMessage defaultMessage="Sign Up" />
          </a>
        </Link>
      </>
    ),
    signUp: (
      <>
        <FormattedMessage defaultMessage="Already have an account?" />
        {' '}
        <Link
          href={{
            pathname: router.pathname,
            query: { ...router.query, action: 'sign-in' },
          }}
        >
          <a className={styles.stateButton} type="button">
            <FormattedMessage defaultMessage="Sign In" />
          </a>
        </Link>

      </>
    ),
    user: (
      <FormattedMessage defaultMessage="You can see games, duels and tournaments on the Arena." />
    ),
  }), []);

  const stateContents: Record<State, React.ReactNode> = {
    signIn: <SignIn />,
    signUp: <SignUp />,
    user: (
      <div className={styles.buttonWrapper}>
        <Link href="/arena" passHref>
          <Button size="large" variant="green">
            <FormattedMessage defaultMessage="Go to Arena" />
          </Button>
        </Link>
      </div>
    ),
  };

  return (
    <section {...props} className={classNames(styles.signUpOrSignIn, className)}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          {stateTitles[currentState]}
        </h3>

        <div className={styles.description}>
          {stateDescriptions[currentState]}
        </div>
      </div>

      {stateContents[currentState]}
    </section>
  );
}
