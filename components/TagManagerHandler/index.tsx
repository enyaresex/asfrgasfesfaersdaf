import Head from 'next/head';
import React, { useContext, useEffect, useRef } from 'react';
import { AuthAndApiContext } from '../../contexts';
import { listenGtmEvents } from '../../helpers';

export default function TagManagerHandler() {
  const { user } = useContext(AuthAndApiContext);
  const previousUser = useRef<AuthUser | null>(null);

  useEffect(() => {
    window.addEventListener('click', listenGtmEvents, false);

    return () => window.removeEventListener('click', listenGtmEvents);
  }, []);

  useEffect(() => {
    if (user !== null && previousUser.current?.id !== null) {
      window.dataLayer.push({
        event: 'auth',
        userId: user.id,
        userUsername: user.username,
      });
    }

    previousUser.current = user;
  }, [user]);

  return (
    <Head>
      <script
        /* eslint-disable-next-line react/no-danger */
        dangerouslySetInnerHTML={{
          __html: ` 
            window.dataLayer = window.dataLayer || [];
          `,
        }}
      />

      <script
        /* eslint-disable-next-line react/no-danger */
        dangerouslySetInnerHTML={{
          __html: ` 
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': 
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], 
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src= 
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f); 
            })(window,document,'script','dataLayer','GTM-W27J8W6'); 
          `,
        }}
      />
    </Head>
  );
}
