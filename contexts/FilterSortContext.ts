import React, { createContext } from 'react';

export type StateKey = 'game' | 'gameMode' | 'platform';
export type StateValue = number | null;

export type State = Record<StateKey, StateValue>;

type FilterSort = {
  duelStatus: Record<DuelStatus, string>,

  selectedDuelStatus: DuelFilterSortSelectedDuelStatus,
  setSelectedDuelStatus: React.Dispatch<React.SetStateAction<DuelFilterSortSelectedDuelStatus>>,

  selectedDuelFilters: State,
  setSelectedDuelFilters: React.Dispatch<React.SetStateAction<FilterSort['selectedDuelFilters']>>,

  selectedOrderingOption: DuelFilterOrdering,
  setSelectedOrderingOption: React.Dispatch<React.SetStateAction<FilterSort['selectedOrderingOption']>>,

  orderingOptions: DuelFilterOrderingOption[],
};

const FilterSortContext = createContext<FilterSort>({} as FilterSort);

export default FilterSortContext;
