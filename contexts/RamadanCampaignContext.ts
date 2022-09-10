import { createContext } from 'react';

type RamadanCampaignContextValue = {
  isRamadan: boolean,
};

const RamadanCampaignContext = createContext<RamadanCampaignContextValue>({} as RamadanCampaignContextValue);

export default RamadanCampaignContext;
