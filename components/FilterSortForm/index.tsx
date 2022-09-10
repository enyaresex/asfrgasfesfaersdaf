import classNames from 'classnames';
import React, { useContext, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import useSWR from 'swr';
import { AnalyticsContext, FilterSortContext, RegionContext } from '../../contexts';
import { sendGAEvent } from '../../helpers';
import MultiSelect from '../MultiSelect';
import Select from '../Select';
import { ReactComponent as Filter } from './filter.svg';
import styles from './FilterSortForm.module.css';
import { ReactComponent as Sort } from './sort.svg';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, {
  vertical?: boolean,
}>;

export default function FilterSortForm({ className, vertical = false, ...props }: Props) {
  const intl = useIntl();
  const { category } = useContext(AnalyticsContext);
  const { region } = useContext(RegionContext);
  const {
    orderingOptions,
    selectedDuelFilters,
    selectedDuelStatus,
    selectedOrderingOption,
    setSelectedDuelFilters,
    setSelectedDuelStatus,
    setSelectedOrderingOption,
  } = useContext(FilterSortContext);

  const { data: games } = useSWR<Game[]>(`/games/?is_active=true&region=${region.id}`);
  const { data: gameModes } = useSWR<GameMode[]>((selectedDuelFilters.game === null || selectedDuelFilters.platform === null) ? null
    : `/games/game_modes/?game=${selectedDuelFilters.game}&platform=${selectedDuelFilters.platform}&is_active=true&region=${region.id}`);
  const { data: platforms } = useSWR<Platform[]>(selectedDuelFilters.game === null ? null
    : `/games/platforms/?game=${selectedDuelFilters.game}&is_active=true&region=${region.id}`);

  useEffect(() => {
    if (selectedDuelFilters.game === null && games?.length === 1) {
      setSelectedDuelFilters({
        game: games[0].id,
        gameMode: null,
        platform: null,
      });
    }
  }, [games, selectedDuelFilters.game]);

  useEffect(() => {
    if (selectedDuelFilters.platform === null && platforms?.length === 1) {
      setSelectedDuelFilters({
        ...selectedDuelFilters,
        gameMode: null,
        platform: platforms[0].id,
      });
    }
  }, [platforms, selectedDuelFilters.platform]);

  useEffect(() => {
    if (selectedDuelFilters.gameMode === null && gameModes?.length === 1) {
      setSelectedDuelFilters({
        ...selectedDuelFilters,
        gameMode: gameModes[0].id,
      });
    }
  }, [gameModes, selectedDuelFilters.gameMode]);

  return (
    <div {...props} className={classNames(styles.filterSortForm, vertical && styles.vertical, className)}>
      <div className={styles.filter}>
        <div className={styles.filterTitle}>
          <Filter />

          <h3><FormattedMessage defaultMessage="Filter" /></h3>
        </div>

        <div className={styles.content}>
          {games !== undefined && (
            <Select
              id="select-filter-sort-game"
              label={intl.formatMessage({ defaultMessage: 'Game' })}
              onChange={(e) => {
                const game = Number(e.target.value);

                setSelectedDuelFilters({ game, gameMode: null, platform: null });

                sendGAEvent({
                  category,
                  event: 'Select Game',
                  label: 'Filter & Sort',
                  value: games.find((g) => g.id === game)?.name,
                });
              }}
              size="large"
              value={selectedDuelFilters.game || ''}
            >
              {selectedDuelFilters.game === null && (
                <option aria-label="game" disabled value="" />
              )}

              {games.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </Select>
          )}

          <Select
            disabled={selectedDuelFilters.game === null || platforms === undefined}
            id="select-filter-sort-platform"
            label={intl.formatMessage({ defaultMessage: 'Platform' })}
            onChange={(e) => {
              const platform = Number(e.target.value);

              setSelectedDuelFilters({ ...selectedDuelFilters, gameMode: null, platform });

              if (platforms !== undefined) {
                sendGAEvent({
                  category,
                  event: 'Select Platform',
                  label: 'Filter & Sort',
                  value: platforms.find((p) => p.id === platform)?.name,
                });
              }
            }}
            size="large"
            value={selectedDuelFilters.platform || ''}
          >
            {selectedDuelFilters.platform === null && (
              <option aria-label="platform" disabled value="" />
            )}

            {platforms !== undefined && platforms.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>

          <Select
            disabled={selectedDuelFilters.platform === null || gameModes === undefined}
            id="select-filter-sort-game-mode"
            label={intl.formatMessage({ defaultMessage: 'Game Mode' })}
            onChange={(e) => {
              const gameMode = Number(e.target.value);

              setSelectedDuelFilters({ ...selectedDuelFilters, gameMode });

              if (gameModes !== undefined) {
                sendGAEvent({
                  category,
                  event: 'Select Game Mode',
                  label: 'Filter & Sort',
                  value: gameModes.find((gm) => gm.id === gameMode)?.name,
                });
              }
            }}
            size="large"
            value={selectedDuelFilters.gameMode || ''}
          >
            {selectedDuelFilters.gameMode === null && (
              <option aria-label="gameMode" disabled value="" />
            )}

            {gameModes !== undefined && gameModes.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </Select>

          <MultiSelect
            id="multi-select-filter-sort-duel-status"
            label={intl.formatMessage({ defaultMessage: 'Duel Status' })}
            onChange={(p) => {
              setSelectedDuelStatus(p as DuelFilterSortSelectedDuelStatus);

              sendGAEvent({ category, event: 'Select Duel Status', label: 'Filter & Sort', value: p.sort().join(':') });
            }}
            options={[{
              label: intl.formatMessage({ defaultMessage: 'Open' }),
              value: 'OPEN',
            }, {
              label: intl.formatMessage({ defaultMessage: 'In Progress' }),
              value: 'IN_PROGRESS',
            }, {
              label: intl.formatMessage({ defaultMessage: 'Ended' }),
              value: 'ENDED',
            }]}
            size="large"
            value={selectedDuelStatus}
          />
        </div>
      </div>

      <div className={styles.sort}>
        <div className={styles.filterTitle}>
          <Sort />

          <h3><FormattedMessage defaultMessage="Sort" /></h3>
        </div>

        <div className={styles.content}>
          <Select
            id="sort-dropdown"
            label={intl.formatMessage({ defaultMessage: 'Sort' })}
            name="entryFee"
            onChange={(e) => {
              setSelectedOrderingOption(e.target.value as DuelFilterOrdering);

              sendGAEvent({ category, event: 'Select Sorting Method', label: 'Filter & Sort' });
            }}
            size="large"
            value={selectedOrderingOption || ''}
          >
            {selectedOrderingOption === null && (
              <option aria-label="sortBy" disabled value="" />
            )}

            {orderingOptions.map((o) => (
              <option key={o.label} value={o.value || ''}>
                {o.label}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}
