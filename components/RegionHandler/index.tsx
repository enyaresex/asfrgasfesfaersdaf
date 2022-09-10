import React, { useContext, useEffect, useState } from 'react';
import useSWR from 'swr';
import { AuthAndApiContext, RegionContext } from '../../contexts';
import ActivityIndicator from '../ActivityIndicator';

type Props = {
  children: React.ReactNode,
};

export default function RegionHandler({ children }: Props) {
  const { inProgress, user } = useContext(AuthAndApiContext);
  const { data: country } = useSWR<Country>(user === null ? null : `/i18n/countries/${user.country}/`);
  const { data: userRegion } = useSWR<Region>(country === undefined ? null : `/i18n/regions/${country.region}/`);
  const { data: defaultRegion } = useSWR<Region>('/i18n/regions/1/');
  const [region, setRegion] = useState<Region | null>(null);

  useEffect(() => {
    if (inProgress) return;

    if (user !== null && userRegion !== undefined) {
      setRegion(userRegion);
    } else if (defaultRegion !== undefined) {
      setRegion(defaultRegion);
    }
  }, [inProgress, defaultRegion, user, userRegion]);

  return region === null ? (
    <ActivityIndicator takeOver />
  ) : (
    <RegionContext.Provider value={{ region, setRegion }}>
      {children}
    </RegionContext.Provider>
  );
}
