import { createContext } from 'react';

export type Value = {
  activeTabSlug: string,
  activeTabSlugQueryKey: string,
};

const TabsContext = createContext<Value>({} as Value);

export default TabsContext;
