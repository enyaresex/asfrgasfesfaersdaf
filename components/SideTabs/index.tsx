import classNames from 'classnames';
import { get } from 'lodash';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { BreakpointContext, SideTabsContext } from '../../contexts';
import SideTab, { Props as SideTabProps } from '../SideTab';
import styles from './SideTabs.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, {
  activeTabSlugQueryKey?: string,
  children: React.ReactNode,
}>;

export default function SideTabs({ children, className, activeTabSlugQueryKey = 'section' }: Props) {
  const router = useRouter();
  const { device } = useContext(BreakpointContext);

  let content: React.ReactNode = null;

  const routerActiveTabSlug = router.query[activeTabSlugQueryKey];
  const activeTabSlug: string | null = routerActiveTabSlug === undefined ? null : routerActiveTabSlug.toString();

  React.Children.forEach(children, (child) => {
    const childType = get(child, 'type');

    if (childType === SideTab) {
      const childTabProps: SideTabProps = get(child, 'props');

      if (childTabProps.slug === activeTabSlug) {
        content = childTabProps.children;
      }
    }
  });

  useEffect(() => {
    if (activeTabSlug === null && device === 'desktop') {
      let newActiveTabSlug: string | null = null;

      React.Children.forEach(children, (child) => {
        if (newActiveTabSlug !== null) return;

        const childType = get(child, 'type');

        if (childType === SideTab) {
          const childTabProps: SideTabProps = get(child, 'props');

          newActiveTabSlug = childTabProps.slug;
        }
      });

      if (newActiveTabSlug !== activeTabSlug) {
        router.replace({
          pathname: router.pathname,
          query: { ...router.query, [activeTabSlugQueryKey]: newActiveTabSlug },
        });
      }
    }
  }, [activeTabSlug, children, device]);

  return (
    <SideTabsContext.Provider value={{ activeTabSlug, activeTabSlugQueryKey }}>
      <div className={classNames(styles.sideTabs, className)}>
        <TransitionGroup component={null}>
          {(device === 'desktop' || content === null) && (
            <CSSTransition timeout={500}>
              <div className={styles.links}>
                {children}
              </div>
            </CSSTransition>
          )}
        </TransitionGroup>

        {(device === 'desktop' || content !== null) && (
          <div className={styles.body}>
            {content}
          </div>
        )}
      </div>
    </SideTabsContext.Provider>
  );
}
