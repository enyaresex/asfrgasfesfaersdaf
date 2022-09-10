import { createContext } from 'react';

export type Value = {
  sessionId: string | null,
};

const ShieldContext = createContext<Value>({} as Value);

export default ShieldContext;
