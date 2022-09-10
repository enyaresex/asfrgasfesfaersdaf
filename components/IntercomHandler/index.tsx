import Head from 'next/head';
import React, { useContext, useEffect } from 'react';
import { AuthAndApiContext } from '../../contexts';

export default function IntercomHandler() {
  const { user } = useContext(AuthAndApiContext);

  useEffect(() => {
    if (window.Intercom === undefined) return;

    if (user === null) {
      window.Intercom('shutdown');
      window.Intercom('boot', {
        app_id: 'bycz2494',
        horizontal_padding: 70,
      });
    } else {
      window.Intercom('update', {
        avatar: {
          type: 'avatar',
          image_url: user.avatar,
        },
        email: user.email,
        fullName: user.fullName,
        name: user.username,
        user_id: user.id.toString(),
      });
    }
  }, [user]);

  return (
    <Head>
      <title>Intercom</title>
      { /* eslint-disable react/no-danger */}
      <script
        dangerouslySetInnerHTML={{
          __html: '(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic(\'reattach_activator\');ic(\'update\',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement(\'script\');s.type=\'text/javascript\';s.async=true;s.src=\'https://widget.intercom.io/widget/bycz2494\';var x=d.getElementsByTagName(\'script\')[0];x.parentNode.insertBefore(s,x);};if(document.readyState===\'complete\'){l();}else if(w.attachEvent){w.attachEvent(\'onload\',l);}else{w.addEventListener(\'load\',l,false);}}})();',
        }}
      />
      { /* eslint-enable */}
    </Head>
  );
}
