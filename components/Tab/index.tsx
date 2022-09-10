import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { TabsContext } from '../../contexts';
import styles from './Tab.module.css';

export type Props = {
  children: React.ReactNode,
  slug: string,
  title: React.ReactNode,
};

export default function Tab({ slug, title }: Props) {
  const router = useRouter();
  const { activeTabSlug, activeTabSlugQueryKey } = useContext(TabsContext);

  return (
    <Link href={{ pathname: router.pathname, query: { ...router.query, [activeTabSlugQueryKey]: slug } }}>
      <a className={classNames(styles.tab, activeTabSlug === slug && styles.active)}>{title}</a>
    </Link>
  );
}
