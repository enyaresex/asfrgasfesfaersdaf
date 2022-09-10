import { createContext } from 'react';

export type Breakpoint = 'lg' | 'md' | 'sm' | 'xl' | 'xs' | 'xxl';

export type Device = 'mobile' | 'tablet' | 'desktop';

type Value = {
  breakpoint: Breakpoint,
  device: Device,
};

const BreakpointContext = createContext({} as Value);

export default BreakpointContext;
