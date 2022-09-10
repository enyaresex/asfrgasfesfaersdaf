import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useMemo } from 'react';
import { AuthAndApiContext } from '../../contexts';
import ActivityIndicator from '../ActivityIndicator';
import Layout from '../Layout';

type AuthRequirement = 'anonymous' | 'user';
type WrappedProps = {
  pageProps: any,
};

export default function withAuth(authRequirement: AuthRequirement, Page: NextPage) {
  function Wrapped({ pageProps }: WrappedProps) {
    const router = useRouter();
    const { inProgress, user } = useContext(AuthAndApiContext);

    const isPermitted = useMemo<boolean>(() => {
      if (inProgress) return false;

      return (authRequirement === 'user' && user !== null) || (authRequirement === 'anonymous' && user === null);
    }, [authRequirement, inProgress, user]);

    useEffect(() => {
      if (!inProgress && !isPermitted) {
        router.replace(authRequirement === 'anonymous' ? '/arena' : `/?action=sign-in&next=${router.asPath}`);
      }
    }, [inProgress, isPermitted]);

    return !isPermitted ? (
      <Layout>
        <ActivityIndicator flex />
      </Layout>
    ) : (
      <Page {...pageProps} />
    );
  }

  return Wrapped;
}
