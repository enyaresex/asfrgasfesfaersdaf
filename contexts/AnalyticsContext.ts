import { createContext } from 'react';

export type Value = {
  category: AnalyticsCategory,
};

const AnalyticsContext = createContext<Value>({} as Value);

export default AnalyticsContext;
