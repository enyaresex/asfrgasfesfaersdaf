import React, { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { DuelFiltersPreferencesState, FilterSortContext } from '../../contexts';

type Props = {
  children?: React.ReactNode,
};

const localStorageKey = 'gamerarenaFilterPreferences';

export default function FilterSortHandler({ children }: Props) {
  const intl = useIntl();

  const [selectedDuelFilters, setSelectedDuelFilters] = useState<DuelFiltersPreferencesState>({
    game: null,
    gameMode: null,
    platform: null,
  });
  const [selectedDuelStatus, setSelectedDuelStatus] = useState<DuelFilterSortSelectedDuelStatus>(['OPEN']);
  const [selectedOrderingOption, setSelectedOrderingOption] = useState<DuelFilterOrdering>(null);

  const duelStatus = useMemo<Record<DuelStatus, string>>(() => ({
    CANCELED: intl.formatMessage({ defaultMessage: 'Canceled' }),
    CHECKING_IN: intl.formatMessage({ defaultMessage: 'Checking In' }),
    DECLARING_RESULT: intl.formatMessage({ defaultMessage: 'Declaring Result' }),
    DECLINED: intl.formatMessage({ defaultMessage: 'Declined' }),
    ENDED: intl.formatMessage({ defaultMessage: 'Ended' }),
    EXPIRED: intl.formatMessage({ defaultMessage: 'Expired' }),
    INVITED: intl.formatMessage({ defaultMessage: 'Open' }),
    IN_DISPUTE: intl.formatMessage({ defaultMessage: 'In Dispute' }),
    IN_PROGRESS: intl.formatMessage({ defaultMessage: 'In Progress' }),
    OPEN: intl.formatMessage({ defaultMessage: 'Open' }),
  }), []);

  const orderingOptions: DuelFilterOrderingOption[] = useMemo(() => [{
    label: intl.formatMessage({ defaultMessage: 'By date created' }),
    value: 'created_at',
  }, {
    label: intl.formatMessage({ defaultMessage: 'By nearest ranking level' }),
    value: 'rating_diff',
  }], []);

  useEffect(() => {
    const localStorageRawData = window.localStorage[localStorageKey];

    if (localStorageRawData !== undefined) {
      setSelectedDuelFilters(JSON.parse(localStorageRawData));
    }
  }, []);

  useEffect(() => {
    window.localStorage[localStorageKey] = JSON.stringify(selectedDuelFilters);
  }, [selectedDuelFilters]);

  return (
    <FilterSortContext.Provider
      value={{
        duelStatus,

        selectedDuelFilters,
        setSelectedDuelFilters,

        selectedDuelStatus,
        setSelectedDuelStatus,

        selectedOrderingOption,
        setSelectedOrderingOption,

        orderingOptions,
      }}
    >
      {children}
    </FilterSortContext.Provider>
  );
}
