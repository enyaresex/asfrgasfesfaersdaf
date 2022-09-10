import React from 'react';
import { AnalyticsContext } from '../../contexts';

type Props = {
  children: React.ReactNode,
  category: AnalyticsCategory,
};

export default function AnalyticsProvider({ category, children }: Props) {
  return (
    <AnalyticsContext.Provider value={{ category }}>
      {children}
    </AnalyticsContext.Provider>
  );
}
