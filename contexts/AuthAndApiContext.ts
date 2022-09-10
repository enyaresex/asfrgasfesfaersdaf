import { createContext } from 'react';

type Value = {
  api: {
    destroy(endpoint: string, payload?: object, config?: Omit<RequestInit, 'body' | 'method'>): Promise<Response>,
    get: (endpoint: string, init?: RequestInit) => Promise<Response>,
    patch(endpoint: string, payload: object, config?: Omit<RequestInit, 'body' | 'method'>): Promise<Response>,
    post(endpoint: string, payload: object, config?: Omit<RequestInit, 'body' | 'method'>): Promise<Response>,
  },
  inProgress: boolean,
  setUserAccessToken: (userAccessToken: UserAccessToken | null) => void,
  user: AuthUser | null,
  userAccessToken: UserAccessToken | null,
};

const AuthAndApiContext = createContext<Value>({} as Value);

export default AuthAndApiContext;
