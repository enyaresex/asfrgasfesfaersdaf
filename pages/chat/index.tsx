import WidgetBot from '@widgetbot/react-embed';
import React from 'react';
import { useIntl } from 'react-intl';
import { useMeasure } from 'react-use';
import { HeadTagsHandler, Layout } from '../../components';
import styles from './Chat.module.css';

export default function Chat() {
  const intl = useIntl();
  const [ref, { height }] = useMeasure<HTMLDivElement>();

  return (
    <>
      <HeadTagsHandler
        title={intl.formatMessage({ defaultMessage: 'Chat' })}
      />

      <Layout className={styles.chat}>
        <div className={styles.wrapper} ref={ref}>
          <div className={styles.innerWrapper}>
            <WidgetBot
              channel="725116942809038929"
              height={height}
              server="652064236083871745"
              shard="https://widgetbot.gamerarena.com"
            />
          </div>
        </div>
      </Layout>
    </>
  );
}
