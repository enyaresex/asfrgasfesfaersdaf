import React, { useContext } from 'react';
import { arSA, enUS, tr } from 'date-fns/locale';
import { LocalizationContext } from '../../contexts';
import DatePicker, { Props as DatePickerProps } from '../DatePicker';
import TextInput from '../TextInput';

type Props = Overwrite<DatePickerProps, {
  id: string,
  label?: React.ReactNode,
  size?: FormComponentSize,
  textInputClassName?: string,
}>;

const locales: Record<LanguageCode, Locale> = { ar: arSA, en: enUS, tr };

export default function DateInput({ id, label, size, textInputClassName, ...props }: Props) {
  const { languageCode } = useContext(LocalizationContext);

  return (
    <DatePicker
      {...props}
      customInput={(
        <TextInput
          className={textInputClassName}
          id={id}
          label={label}
          size={size}
        />
      )}
      dateFormat="P"
      dropdownMode="select"
      locale={locales[languageCode]}
    />
  );
}
