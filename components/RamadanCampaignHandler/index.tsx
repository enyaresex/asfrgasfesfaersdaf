import dayjs from 'dayjs';
import React from 'react';
import { RamadanCampaignContext } from '../../contexts';

type Props = {
  children: React.ReactNode,
};

export default function RamadanCampaignHandler({ children }: Props) {
  return (
    <RamadanCampaignContext.Provider value={{ isRamadan: dayjs().isBetween('2021-12-25', '2022-01-11', null, '[]') }}>
      {children}
    </RamadanCampaignContext.Provider>
  );
}
