type DuelFilterSortSelectedDuelStatus = Partial<DuelStatus>[];

type DuelFilterOrdering = 'created_at' | 'rating' | null;

type DuelFilterOrderingOption = {
  label: string,
  value: Sort,
};
