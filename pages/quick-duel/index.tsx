import React from 'react';
import { useIntl } from 'react-intl';
import { HeadTagsHandler, Layout, QuickDuel2 } from '../../components';

export default function QuickDuel() {
  const intl = useIntl();

  return (
    <>
      <HeadTagsHandler title={`${intl.formatMessage({ defaultMessage: 'Find A Duel' })} | Gamer Arena`} />

      <Layout>
        <QuickDuel2 />
      </Layout>
    </>
  );
}
