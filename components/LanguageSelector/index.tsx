import classNames from 'classnames';
import React, { useContext } from 'react';
import { useIntl } from 'react-intl';
import { AnalyticsContext, LocalizationContext } from '../../contexts';
import { sendGAEvent } from '../../helpers';
import Select from '../Select';

type Props = {
  className?: string,
};

export default function LanguageSelector({ className }: Props) {
  const intl = useIntl();
  const { category } = useContext(AnalyticsContext);
  const { languageCode, setLanguageCode } = useContext(LocalizationContext);

  return (
    <Select
      className={classNames(className)}
      id="select-language-selector-select"
      label={intl.formatMessage({ defaultMessage: 'Language' })}
      onChange={(event) => {
        setLanguageCode(event.target.value as LanguageCode);

        sendGAEvent({ category, event: 'Select Language', label: 'Language', value: event.target.value });
      }}
      size="small"
      value={languageCode}
    >
      <option value="ar">العربي</option>
      <option value="tr">Türkçe</option>
      <option value="en">English</option>
    </Select>
  );
}
