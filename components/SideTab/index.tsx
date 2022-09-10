import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { SideTabsContext } from '../../contexts';
import styles from './SideTab.module.css';
import { ReactComponent as Arrow } from './arrow.svg';

export type Props = {
  children: React.ReactNode,
  icon: React.ReactNode,
  slug: string,
  title: React.ReactNode,
};

export default function SideTab({ slug, icon, title }: Props) {
  const router = useRouter();
  const { activeTabSlug, activeTabSlugQueryKey } = useContext(SideTabsContext);

  return (
    <Link href={{ pathname: router.pathname, query: { ...router.query, [activeTabSlugQueryKey]: slug } }}>
      <a className={classNames(styles.sideTab, activeTabSlug === slug && styles.active)}>
        <div className={styles.icon}>
          {icon}
        </div>

        <div className={styles.body}>
          {title}
        </div>

        <div className={styles.arrow}>
          <Arrow />
        </div>
      </a>
    </Link>
  );
}
