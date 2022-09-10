import { init as initApm } from '@elastic/apm-rum';
import 'cropperjs/dist/cropper.css'; // eslint-disable-line import/no-extraneous-dependencies
import dayjs from 'dayjs';
import 'dayjs/locale/ar';
import 'dayjs/locale/tr';
import isBetween from 'dayjs/plugin/isBetween';
import dayjsLocalizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import firebase from 'firebase/app';
import 'focus-visible';
import { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import SwiperCore, { Navigation } from 'swiper';
import 'swiper/swiper-bundle.min.css';
import 'tippy.js/dist/tippy.css'; // eslint-disable-line import/no-extraneous-dependencies
import {
  AnalyticsProvider,
  AuthAndApiHandler,
  BreakpointHandler,
  IntercomHandler,
  DateTimeCheckModal,
  DuelCreationModal,
  FilterSortHandler,
  FirebaseAuthHandler,
  IntlProvider,
  MaintenanceModeHandler,
  NotificationsHandler,
  OnlineStatusHandler,
  OnlineUsersHandler,
  PhoneVerificationModal,
  PushNotificationHandler,
  RamadanCampaignHandler,
  RegionHandler,
  ShieldHandler,
  TagManagerHandler,
  ToastsHandler,
  UserPage,
} from '../components';
import '../react-datepicker.css';
import '../style.css';

dayjs.extend(isBetween);
dayjs.extend(dayjsLocalizedFormat);
dayjs.extend(isBetween);
dayjs.extend(relativeTime);

SwiperCore.use([Navigation]);

const firebaseConfig = {
  apiKey: 'AIzaSyBBUnA_iPyMZAgSGtr9oqrpESqh1lOdn8s',
  authDomain: 'gamerarena-b0218.firebaseapp.com',
  databaseURL: 'https://gamerarena-b0218.firebaseio.com',
  projectId: 'gamerarena-b0218',
  storageBucket: 'gamerarena-b0218.appspot.com',
  messagingSenderId: '140126459077',
  appId: '1:140126459077:web:5faa855d2b5704820e0cac',
  measurementId: 'G-ZXQ0HMBNNL',
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

if (process.env.NEXT_PUBLIC_GAMERARENA_APM_ENABLED === 'true') {
  initApm({
    environment: process.env.NEXT_PUBLIC_GAMERARENA_STAGE,
    serviceName: 'gamerarena-frontend',
    serverUrl: process.env.NEXT_PUBLIC_GAMERARENA_APM_SERVER,
  });
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <IntlProvider>
      <Head>
        <title>
          Gamer Arena | Competitive Esports Platform
        </title>

        <link href="/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180" />
        <link href="/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png" />
        <link href="/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png" />
        <link href="/site.webmanifest" rel="manifest" />
        <link color="#5bbad5" href="/safari-pinned-tab.svg" rel="mask-icon" />
        <meta content="width=device-width, user-scalable=no" name="viewport" />
        <meta content="#111217" name="msapplication-TileColor" />
        <meta content="#ffffff" name="theme-color" />
      </Head>

      <ShieldHandler>
        <AuthAndApiHandler>
          <TagManagerHandler />

          <BreakpointHandler>
            <ToastsHandler>
              <NotificationsHandler>
                <MaintenanceModeHandler>
                  <RegionHandler>
                    <OnlineUsersHandler>
                      <RamadanCampaignHandler>
                        <OnlineStatusHandler />
                        <FirebaseAuthHandler />
                        <PushNotificationHandler />
                        <DateTimeCheckModal />
                        <IntercomHandler />

                        <FilterSortHandler>
                          <AnalyticsProvider category="Duel Creation Modal">
                            <DuelCreationModal />
                          </AnalyticsProvider>
                          <PhoneVerificationModal />
                          <UserPage />

                          <Component {...pageProps} />
                        </FilterSortHandler>
                      </RamadanCampaignHandler>
                    </OnlineUsersHandler>
                  </RegionHandler>
                </MaintenanceModeHandler>
              </NotificationsHandler>
            </ToastsHandler>
          </BreakpointHandler>
        </AuthAndApiHandler>
      </ShieldHandler>
    </IntlProvider>
  );
}
