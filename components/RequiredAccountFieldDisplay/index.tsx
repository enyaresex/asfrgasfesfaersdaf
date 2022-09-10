import React from 'react';
import { useIntl } from 'react-intl';

type Props = {
  field: UserGameAccountDisplay,
};

export default function RequiredAccountFieldDisplay({ field }: Props) {
  const intl = useIntl();

  const requiredAccountFields: Record<UserGameAccountDisplay, string> = {
    'Activision Account': intl.formatMessage({ defaultMessage: 'Activision Account' }),
    'Basketball Arena Team Name': intl.formatMessage({ defaultMessage: 'Basketball Arena Team Name' }),
    'Battle Tag': intl.formatMessage({ defaultMessage: 'Battle Tag' }),
    'CoD Mobile Username': intl.formatMessage({ defaultMessage: 'CoD Mobile Username' }),
    'EA Account': intl.formatMessage({ defaultMessage: 'EA Account' }),
    'Epic Games Username': intl.formatMessage({ defaultMessage: 'Epic Games Username' }),
    'FIFA Username': intl.formatMessage({ defaultMessage: 'FIFA Username' }),
    'Free Fire Username': intl.formatMessage({ defaultMessage: 'Free Fire Username' }),
    'Head Ball Username': intl.formatMessage({ defaultMessage: 'Head Ball Username' }),
    'Mobile Legends Username': intl.formatMessage({ defaultMessage: 'Mobile Legends Username' }),
    'PSN Username': intl.formatMessage({ defaultMessage: 'PSN Username' }),
    'PUBG Mobile Username': intl.formatMessage({ defaultMessage: 'PUBG Mobile Username' }),
    'PUBG Username': intl.formatMessage({ defaultMessage: 'PUBG Username' }),
    'Riot Id': intl.formatMessage({ defaultMessage: 'Riot Id' }),
    'Sabotage Username': intl.formatMessage({ defaultMessage: 'Sabotage Username' }),
    'Steam Profile Name': intl.formatMessage({ defaultMessage: 'Steam Profile Name' }),
    'Supercell ID': intl.formatMessage({ defaultMessage: 'Supercell ID' }),
    'Xbox Gamertag': intl.formatMessage({ defaultMessage: 'Xbox Gamertag' }),
    'Zula Username': intl.formatMessage({ defaultMessage: 'Zula Username' }),
    'Arena of Valor Username': intl.formatMessage({ defaultMessage: 'Arena of Valor Username' }),
  };

  return (
    <>
      {requiredAccountFields[field]}
    </>
  );
}
