import { createContext } from 'react';

export type Value = {
  activeTabSlug: string | null,
  activeTabSlugQueryKey: string,
};

const SideTabsContext = createContext<Value>({} as Value);

export default SideTabsContext;
