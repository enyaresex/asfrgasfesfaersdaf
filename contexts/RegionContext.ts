import { createContext } from 'react';

export type Value = {
  region: Region,
  setRegion: (r: Region) => void,
};

const RegionContext = createContext<Value>({} as Value);

export default RegionContext;
