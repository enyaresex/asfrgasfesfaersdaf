import classNames from 'classnames';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import AnimateHeight from 'react-animate-height';
import { FormattedMessage } from 'react-intl';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useClickAway } from 'react-use';
import { BreakpointContext, FilterSortContext } from '../../contexts';
import { useKeyDown } from '../../hooks';
import BackgroundShade from '../BackgroundShade';
import Button from '../Button';
import FilterSortForm from '../FilterSortForm';
import { ReactComponent as Close } from './close.svg';
import { ReactComponent as Filter } from './filter.svg';
import styles from './FilterSort.module.css';
import { ReactComponent as RollUp } from './rollUp.svg';
import { ReactComponent as Sort } from './sort.svg';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['section']>, {
  isFilterSortSidebarOpen?: boolean,
  type?: 'fixedBottom' | 'fixedTop' | 'vertical',
}>;

export default function FilterSort({ className, isFilterSortSidebarOpen, type = 'fixedBottom', ...props }: Props) {
  const { breakpoint } = useContext(BreakpointContext);
  const {
    orderingOptions,
    selectedDuelFilters,
    selectedDuelStatus,
    selectedOrderingOption,
    setSelectedDuelFilters,
    setSelectedDuelStatus,
    setSelectedOrderingOption,
  } = useContext(FilterSortContext);
  const content = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const hasNoFilters = selectedDuelStatus.length === 0
    && selectedDuelFilters.game === null
    && selectedDuelFilters.gameMode === null
    && selectedDuelFilters.platform === null
    && selectedOrderingOption === null;

  const filterCount = useMemo<number | null>(() => {
    const temp = [selectedDuelFilters.game, selectedDuelFilters.gameMode, selectedDuelFilters.platform]
      .filter((f) => f !== null)
      .length + (selectedDuelStatus.length > 0 ? 1 : 0);

    return temp > 0 ? temp : null;
  }, [selectedDuelStatus, selectedDuelFilters]);

  useEffect(() => {
    const hasFilterSortClassName = 'has-filter-sort';

    if (type !== 'vertical' && isOpen) {
      document.body.classList.add(hasFilterSortClassName);
    } else {
      document.body.classList.remove(hasFilterSortClassName);
    }

    return () => {
      document.body.classList.remove(hasFilterSortClassName);
    };
  }, [isOpen, type]);

  useEffect(() => {
    if (type === 'vertical') {
      setIsOpen(true);
    }
  }, [type]);

  useClickAway(content, () => {
    if (isOpen) {
      setIsOpen(false);
    }
  });

  useKeyDown(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  }, ['escape']);

  const fixedBottom = (
    <div className={styles.wrapper}>
      <button className={styles.buttonContainer} onClick={() => setIsOpen((prev) => !prev)} type="button">
        <div className={styles.headerButton}>
          <div className={styles.icon}>
            <Filter />

            {filterCount !== null && <div className={styles.filledIndicator} />}
          </div>

          <FormattedMessage defaultMessage="Filter" />

          {filterCount !== null && ` (${filterCount})`}
        </div>

        <div
          className={classNames(
            styles.headerButton,
            (breakpoint !== 'xs' && selectedOrderingOption !== null) && styles.withDetail,
          )}
        >
          <div className={styles.icon}>
            <Sort />

            {selectedOrderingOption !== null && <div className={styles.filledIndicator} />}
          </div>

          <FormattedMessage defaultMessage="Sort" />

          {breakpoint !== 'xs' && selectedOrderingOption !== null && (
            <span className={styles.detail}>
              {orderingOptions.find((o) => o.value === selectedOrderingOption)?.label}
            </span>
          )}
        </div>
      </button>

      <div className={styles.body} ref={content}>
        <TransitionGroup component={null}>
          {isOpen && (
            <CSSTransition timeout={300}>
              <div className={styles.filterContainer}>
                <div className={styles.close}>
                  <button className={styles.closeButton} onClick={() => setIsOpen(false)} type="button">
                    <Close />
                  </button>
                </div>

                <div className={styles.filterForm}>
                  <FilterSortForm />

                  <div className={styles.actions}>
                    <Button
                      className={styles.filterButton}
                      disabled={hasNoFilters}
                      onClick={(e: React.MouseEvent) => {
                        e.preventDefault();

                        setIsOpen(false);
                      }}
                      size="large"
                      variant={hasNoFilters ? 'secondary' : 'primary'}
                    >
                      <FormattedMessage defaultMessage="Show Results" />
                    </Button>

                    {hasNoFilters
                      ? null
                      : (
                        <button
                          className={styles.clearAll}
                          onClick={(e) => {
                            e.preventDefault();

                            setSelectedDuelStatus([]);

                            setSelectedDuelFilters({
                              game: null,
                              gameMode: null,
                              platform: null,
                            });

                            setSelectedOrderingOption(null);
                          }}
                          type="button"
                        >
                          <FormattedMessage defaultMessage="Clear All" />
                        </button>
                      )}
                  </div>
                </div>
              </div>
            </CSSTransition>
          )}
        </TransitionGroup>
      </div>
    </div>
  );

  const fixedTop = (
    <div className={styles.wrapper}>
      <button className={styles.buttonContainer} onClick={() => setIsOpen((prev) => !prev)} type="button">
        <div className={styles.headerButton}>
          <div className={styles.icon}>
            <Filter />

            {filterCount !== null && <div className={styles.filledIndicator} />}
          </div>

          <FormattedMessage defaultMessage="Filter" />

          {filterCount !== null && ` (${filterCount})`}
        </div>

        <div
          className={classNames(styles.headerButton,
            (breakpoint !== 'xs' && selectedOrderingOption !== null) && styles.withDetail)}
        >
          <div className={styles.icon}>
            <Sort />

            {selectedOrderingOption !== null && <div className={styles.filledIndicator} />}
          </div>

          <FormattedMessage defaultMessage="Sort" />

          {breakpoint !== 'xs' && selectedOrderingOption !== null && (
            <span className={styles.detail}>
              {orderingOptions.find((o) => o.value === selectedOrderingOption)?.label}
            </span>
          )}
        </div>
      </button>

      <AnimateHeight duration={150} height={isOpen ? 'auto' : 0}>
        <div className={styles.dropdown} ref={content}>
          <div className={styles.filterContainer}>
            <div className={styles.filterForm}>
              <FilterSortForm />

              <div className={styles.actions}>
                {!hasNoFilters && (
                  <button
                    className={styles.clearAll}
                    onClick={(e) => {
                      e.preventDefault();

                      setSelectedDuelStatus([]);

                      setSelectedDuelFilters({
                        game: null,
                        gameMode: null,
                        platform: null,
                      });

                      setSelectedOrderingOption(null);
                    }}
                    type="button"
                  >
                    <FormattedMessage defaultMessage="Clear All" />
                  </button>
                )}

                <button
                  className={styles.rollUp}
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();

                    setIsOpen(false);
                  }}
                  type="button"
                >
                  <RollUp />
                </button>
              </div>
            </div>
          </div>
        </div>
      </AnimateHeight>
    </div>
  );

  const verticalFilterSort = (
    <div className={styles.verticalFilterSort}>
      <TransitionGroup component={null}>
        {isFilterSortSidebarOpen && (
          <CSSTransition timeout={300}>
            <div className={styles.body}>

              <FilterSortForm vertical />

              <div className={styles.actions}>
                {!hasNoFilters && (
                  <button
                    className={styles.clearAll}
                    onClick={(e) => {
                      e.preventDefault();

                      setSelectedDuelStatus([]);

                      setSelectedDuelFilters({
                        game: null,
                        gameMode: null,
                        platform: null,
                      });

                      setSelectedOrderingOption(null);
                    }}
                    type="button"
                  >
                    <FormattedMessage defaultMessage="Clear All" />
                  </button>
                )}
              </div>
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    </div>
  );

  return (
    <>
      {type !== 'vertical' && <BackgroundShade isVisible={isOpen} />}

      <section {...props} className={classNames(styles.filterSort, className)}>
        {type === 'fixedBottom' && fixedBottom}
        {type === 'fixedTop' && fixedTop}
        {type === 'vertical' && verticalFilterSort}
      </section>
    </>
  );
}
