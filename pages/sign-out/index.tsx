import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { mutate } from 'swr';
import { ActivityIndicator, HeadTagsHandler, Layout } from '../../components';
import { AuthAndApiContext, ToastsContext } from '../../contexts';

export default function SignOut() {
  const router = useRouter();
  const intl = useIntl();
  const { setUserAccessToken } = useContext(AuthAndApiContext);
  const { addToast } = useContext(ToastsContext);

  useEffect(() => {
    async function signOut() {
      setUserAccessToken(null);
      await mutate('/users/me/', null);

      addToast({
        content: intl.formatMessage({ defaultMessage: 'You have been successfully signed out. GGWP!' }),
        kind: 'success',
      });

      await router.replace('/');
    }

    signOut();
  }, []);

  return (
    <>
      <HeadTagsHandler title={`${intl.formatMessage({ defaultMessage: 'Sign Out' })} | Gamer Arena`} />

      <Layout>
        <ActivityIndicator flex />
      </Layout>
    </>
  );
}
