import { createContext, Dispatch, SetStateAction } from 'react';

export type Value = {
  dir: LanguageDirection,
  languageCode: LanguageCode,
  setLanguageCode: Dispatch<SetStateAction<LanguageCode | null>>,
};

const LocalizationContext = createContext<Value>({} as Value);

export default LocalizationContext;
