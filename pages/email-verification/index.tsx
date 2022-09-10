import Head from 'next/head';
import { useRouter } from 'next/router';
import qs from 'qs';
import React, { useContext, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { mutate } from 'swr';
import { ActivityIndicator, Layout, withAuth } from '../../components';
import { AuthAndApiContext, ToastsContext } from '../../contexts';

function EmailVerification() {
  const router = useRouter();
  const intl = useIntl();
  const { user } = useContext(AuthAndApiContext);
  const { api } = useContext(AuthAndApiContext);
  const { addToast } = useContext(ToastsContext);

  useEffect(() => {
    async function verifyEmail() {
      const { emailVerificationToken } = qs.parse(window.location.search, { ignoreQueryPrefix: true });

      const response = await api.post('/users/verify_email/', { emailVerificationToken });
      const responseJson = await response.json();

      if (response.ok) {
        await mutate('/users/me/', responseJson);

        addToast({
          content: intl.formatMessage({ defaultMessage: 'Your e-mail address is verified now.' }),
          isPersistent: true,
          kind: 'success',
        });
      } else {
        addToast({
          content: intl.formatMessage({ defaultMessage: 'This link is not valid. Please contact support if you need help.' }),
          isPersistent: true,
          kind: 'warning',
        });
      }

      const { emailVerificationToken: _, ...query } = router.query;

      await router.replace({
        pathname: 'arena',
        query: { ...query, username: user?.username, userDetail: 'general' },
      });
    }

    verifyEmail();
  }, []);

  return (
    <>
      <Head>
        <title>{`${intl.formatMessage({ defaultMessage: 'E-mail Address Verification' })} | Gamer Arena`}</title>
      </Head>

      <Layout>
        <ActivityIndicator flex />
      </Layout>
    </>
  );
}

export default withAuth('user', EmailVerification);
