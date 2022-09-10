import fp from 'fingerprintjs2';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import useSWR, { SWRConfig } from 'swr';
import { AuthAndApiContext, LocalizationContext, ShieldContext } from '../../contexts';

type Props = {
  children: React.ReactNode,
};

type State = {
  isLocalStorageChecked: boolean,
  userAccessToken: UserAccessToken | null,
};

const localStorageAccessTokenKey = process.env.NEXT_PUBLIC_GAMERARENA_LOCAL_STORAGE_ACCESS_TOKEN_KEY as string;

export default function AuthAndApiHandler({ children }: Props) {
  const { sessionId } = useContext(ShieldContext);
  const { languageCode } = useContext(LocalizationContext);
  const [state, setState] = useState<State>({
    isLocalStorageChecked: false,
    userAccessToken: null,
  });
  const [browserId, setBrowserId] = useState<string | null>(null);

  const swrConfig = {
    fetcher: async (endpoint: string, init?: RequestInit) => {
      let response: Response;

      try {
        response = await apiCall(endpoint, init);
      } catch (e) {
        const error: SWRError = {
          message: 'An error occurred while fetching the data.',
        };

        throw error;
      }

      if (!response.ok) {
        if (response.status === 401) {
          setUserAccessTokenHandler(null);
        } else {
          const error: SWRError = {
            json: await response.json(),
            message: 'An error occurred while fetching the data.',
            status: response.status,
          };

          throw error;
        }
      }

      return response.json();
    },
    refreshInterval: 60000,
  };

  const { data: user, error, mutate: mutateUser } = useSWR<AuthUser>(state.userAccessToken === null ? null : '/users/me/', swrConfig);
  const { data: languages } = useSWR<Language[]>(user === undefined ? null : '/i18n/languages/', swrConfig);
  const contextUser = useMemo<AuthUser | null>(() => user || null, [user]);

  const inProgress = !state.isLocalStorageChecked
    || (state.userAccessToken !== null && contextUser === null)
    || (state.userAccessToken === null && contextUser !== null);

  function setUserAccessTokenHandler(userAccessToken: UserAccessToken | null) {
    if (userAccessToken === null) {
      window.localStorage.removeItem(localStorageAccessTokenKey);
    } else {
      window.localStorage.setItem(localStorageAccessTokenKey, userAccessToken);
    }
    setState({ ...state, userAccessToken });
  }

  function apiCall(endpoint: string, init?: RequestInit): Promise<Response> {
    const headers: HeadersInit = {
      Accept: 'application/json',
      'Accept-Language': languageCode,
      'Content-Type': 'application/json',
      ...browserId === null ? {} : { 'x-gamerarena-browser-id': browserId },
      ...sessionId === null ? {} : { 'x-gamerarena-shield-session-id': sessionId },
      ...state.userAccessToken === null ? {} : { Authorization: `Token ${state.userAccessToken}` },
      ...init?.headers,
    };

    return fetch(`${process.env.NEXT_PUBLIC_GAMERARENA_API_URL}${endpoint}`, { ...init, headers });
  }

  const api = {
    destroy(endpoint: string, payload?: object, config?: Omit<RequestInit, 'body' | 'method'>) {
      return apiCall(
        endpoint,
        {
          ...config,
          body: payload ? JSON.stringify(payload) : undefined,
          method: 'DELETE',
        },
      );
    },
    get: apiCall,
    patch(endpoint: string, payload: object, config?: Omit<RequestInit, 'body' | 'method'>) {
      return apiCall(
        endpoint,
        {
          ...config,
          body: JSON.stringify(payload),
          method: 'PATCH',
        },
      );
    },
    post(endpoint: string, payload: object, config?: Omit<RequestInit, 'body' | 'method'>) {
      return apiCall(
        endpoint,
        {
          ...config,
          body: JSON.stringify(payload),
          method: 'POST',
        },
      );
    },
  };

  useEffect(() => {
    fp.getV18({ fonts: { extendedJsFonts: true } }, (b: string) => {
      setBrowserId(b);
    });
  }, []);

  useEffect(() => {
    const userAccessTokenFromLocalStorage = window.localStorage.getItem(localStorageAccessTokenKey);
    setState({
      ...state,
      isLocalStorageChecked: true,
      userAccessToken: userAccessTokenFromLocalStorage,
    });
  }, []);

  useEffect(() => {
    if (error !== undefined) {
      // TODO: Sign out user on some cases.
    }
  }, [error]);

  useEffect(() => {
    async function updateUserLanguage(language: number) {
      const response = await api.patch('/users/me/', { language });

      if (response.ok) {
        const responseJson = await response.json();

        await mutateUser(responseJson);
      }
    }

    if (contextUser !== null && languages !== undefined) {
      const userLanguage = languages.find((l) => l.code === languageCode);

      if (userLanguage === undefined) return;

      if (contextUser.language !== userLanguage.id) {
        updateUserLanguage(userLanguage.id);
      }
    }
  }, [contextUser, languageCode, languages]);

  return (
    <AuthAndApiContext.Provider
      value={{
        api,
        inProgress,
        setUserAccessToken: setUserAccessTokenHandler,
        user: contextUser,
        userAccessToken: state.userAccessToken,
      }}
    >
      <SWRConfig value={swrConfig}>
        {children}
      </SWRConfig>
    </AuthAndApiContext.Provider>
  );
}
