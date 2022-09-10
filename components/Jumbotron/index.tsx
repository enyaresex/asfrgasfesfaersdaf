import classNames from 'classnames';
import Link from 'next/link';
import React, { useContext, useMemo } from 'react';
import useSWR from 'swr';
import { AnalyticsContext } from '../../contexts';
import { createGtag } from '../../helpers';

import Button from '../Button';
import styles from './Jumbotron.module.css';

type Props = React.PropsWithoutRef<JSX.IntrinsicElements['div']>;

export default function Jumbotron({ className, ...props }: Props) {
  const { category } = useContext(AnalyticsContext);
  const { data: jumbotronItem } = useSWR<JumbotronItem | null>('/jumbotron_item/');

  const button = useMemo<React.ReactNode>(() => {
    if (jumbotronItem === undefined || jumbotronItem === null) return null;

    if (jumbotronItem.buttonTitle === null || jumbotronItem.buttonUrl === null) return null;

    return (
      <Link href={jumbotronItem.buttonUrl} passHref>
        <Button
          data-gtag={createGtag({ category, event: 'Click CTA', label: 'Jumbotron', value: jumbotronItem.buttonUrl })}
          outline
        >
          {jumbotronItem.buttonTitle}
        </Button>
      </Link>
    );
  }, [jumbotronItem]);

  return (jumbotronItem === undefined || jumbotronItem === null) ? null : (
    <section {...props} className={classNames(className, styles.jumbotron)} data-cy="jumbotron">
      <div
        className={classNames(styles.wrapper, button === null && styles.noAction)}
        style={{
          backgroundImage: jumbotronItem?.image ? `url(${jumbotronItem.image})` : 'none',
        }}
      >
        <div className={styles.overlay} />

        <div className={styles.body}>
          <div className={styles.detail}>
            <h2 className={styles.title}>{jumbotronItem.title}</h2>
            <p className={styles.content}>{jumbotronItem.content}</p>
          </div>

          {button}
        </div>
      </div>
    </section>
  );
}
