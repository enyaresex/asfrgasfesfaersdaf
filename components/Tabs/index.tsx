import classNames from 'classnames';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { TabsContext } from '../../contexts';
import { Props as TabProps } from '../Tab';
import styles from './Tabs.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, {
  activeTabSlugQueryKey?: string,
  children: (React.ReactElement<TabProps> | false | null)[],
}>;

export default function Tabs({ children, className, activeTabSlugQueryKey = 'section' }: Props) {
  const router = useRouter();

  let content: React.ReactNode = null;
  let activeTabSlug: string = (router.query[activeTabSlugQueryKey] || '').toString();

  const links = React.Children.map(children, (child, i) => {
    if (child === null || child === false) {
      return null;
    }

    if (i === 0) {
      activeTabSlug = child.props.slug;
      content = child.props.children;
    }

    if (
      router.query[activeTabSlugQueryKey] !== undefined
      && child.props.slug !== undefined
      && router.query[activeTabSlugQueryKey] === child.props.slug
    ) {
      activeTabSlug = child.props.slug;
      content = child.props.children;
    }

    return React.cloneElement(child);
  });

  useEffect(() => {
    async function syncActiveTabSlugQueryKey() {
      if (router.query[activeTabSlugQueryKey] !== activeTabSlug) {
        await router.replace({
          pathname: router.pathname,
          query: { ...router.query, [activeTabSlugQueryKey]: activeTabSlug },
        }, undefined, { scroll: false });
      }
    }

    syncActiveTabSlugQueryKey();
  }, [activeTabSlug, router.query[activeTabSlugQueryKey]]);

  return (
    <TabsContext.Provider value={{ activeTabSlug, activeTabSlugQueryKey }}>
      <div className={classNames(styles.tabs, className)}>
        <div className={styles.header}>
          <div className={styles.links}>
            {links}
          </div>
        </div>

        <div className={styles.body}>
          {content}
        </div>
      </div>
    </TabsContext.Provider>
  );
}
