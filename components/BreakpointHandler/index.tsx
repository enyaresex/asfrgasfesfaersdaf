import React, { useMemo } from 'react';
import { createBreakpoint } from 'react-use';
import { BreakpointContext, BreakpointContextBreakpoint, BreakpointContextDevice } from '../../contexts';

type Props = {
  children: React.ReactNode,
};

const useBreakpoint = createBreakpoint({
  xs: 360,
  sm: 576,
  md: 768,
  lg: 993,
  xl: 1240,
  xxl: 1440,
});

export default function BreakpointHandler({ children }: Props) {
  const breakpoint = useBreakpoint() as BreakpointContextBreakpoint;
  const device = useMemo<BreakpointContextDevice>(() => {
    if (breakpoint === 'xs' || breakpoint === 'sm') return 'mobile';

    if (breakpoint === 'md') return 'tablet';

    return 'desktop';
  }, [breakpoint]);

  return (
    <BreakpointContext.Provider value={{ breakpoint, device }}>
      {children}
    </BreakpointContext.Provider>
  );
}
