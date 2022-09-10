import classNames from 'classnames';
import React, { useContext, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { BreakpointContext } from '../../contexts';
import AnalyticsProvider from '../AnalyticsProvider';
import FilterSort from '../FilterSort';
import styles from './FilterSortLayout.module.css';
import { ReactComponent as Toggle } from './toggle.svg';

type Props = {
  children: React.ReactNode,
};

export default function FilterSortLayout({ children }: Props) {
  const { breakpoint } = useContext(BreakpointContext);
  const isBigScreen = useMemo<boolean>(() => ['xl', 'xxl'].includes(breakpoint), [breakpoint]);
  const [isFilterSortSidebarOpen, setIsFilterSortSidebarOpen] = useState<boolean>(true);

  return (
    <div className={styles.filterSortLayout}>
      <AnalyticsProvider category="Duels">
        {isBigScreen && (
          <>
            <button className={classNames(styles.toggle, isFilterSortSidebarOpen && styles.open)} onClick={() => setIsFilterSortSidebarOpen((prev) => !prev)} type="button">
              {isFilterSortSidebarOpen ? <Toggle className={styles.opened} /> : (
                <>
                  <Toggle className={styles.closed} />

                  <FormattedMessage defaultMessage="Filter" />
                </>
              )}
            </button>

            <FilterSort
              className={classNames(styles.verticalFilterSort, !isFilterSortSidebarOpen && styles.closed)}
              isFilterSortSidebarOpen={isFilterSortSidebarOpen}
              type="vertical"
            />
          </>
        )}

        <div className={classNames(styles.main, isBigScreen && styles.shrink)}>
          {!isBigScreen && <FilterSort type="fixedTop" />}
        </div>
      </AnalyticsProvider>

      {children}
    </div>
  );
}
