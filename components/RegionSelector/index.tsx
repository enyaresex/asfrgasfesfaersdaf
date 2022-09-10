import React, { useContext } from 'react';
import { useIntl } from 'react-intl';
import useSWR from 'swr';
import { AnalyticsContext, AuthAndApiContext, RegionContext } from '../../contexts';
import { sendGAEvent } from '../../helpers';
import Select from '../Select';

export default function RegionSelector() {
  const intl = useIntl();
  const { data: regions } = useSWR<Region[]>('/i18n/regions/');
  const { user } = useContext(AuthAndApiContext);
  const { category } = useContext(AnalyticsContext);
  const { region, setRegion } = useContext(RegionContext);

  return regions === undefined || region === null || user !== null ? null : (
    <Select
      id="region-selector-select"
      label={intl.formatMessage({ defaultMessage: 'Region' })}
      name="region"
      onChange={async (event) => {
        const regionId = parseInt(event.target.value);

        const newRegion = regions.find((r) => r.id === regionId);

        if (newRegion === undefined) return;

        setRegion(newRegion);

        sendGAEvent({ category, event: 'Select Region', label: 'Region', value: newRegion.name });
      }}
      value={region.id}
    >
      {regions.map((r) => (
        <option key={r.id} value={r.id}>{r.name}</option>
      ))}
    </Select>
  );
}
