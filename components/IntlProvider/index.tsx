import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import { IntlProvider as ReactIntlProvider } from 'react-intl';
import { LocalizationContext } from '../../contexts';
import messagesAr from '../../lang/ar.json';
import messagesEn from '../../lang/en.json';
import messagesTr from '../../lang/tr.json';
import ActivityIndicator from '../ActivityIndicator';

type LanguageMessages = Record<LanguageCode, Record<string, string>>;

const messages: LanguageMessages = {
  ar: messagesAr,
  en: messagesEn,
  tr: messagesTr,
};

const directions: Record<LanguageCode, LanguageDirection> = {
  ar: 'rtl',
  en: 'ltr',
  tr: 'ltr',
};

type Props = {
  children: React.ReactNode,
};

const defaultLanguage: LanguageCode = 'tr';
const localStorageLanguageCodeKey = process.env.NEXT_PUBLIC_GAMERARENA_LOCAL_STORAGE_LANGUAGE_CODE_KEY as string;

export default function IntlProvider({ children }: Props) {
  const [languageCode, setLanguageCode] = useState<LanguageCode | null>(null);
  const previousLanguageCode = useRef<LanguageCode | null>(null);

  useEffect(() => {
    if (languageCode === null) {
      const languageCodeFromLocalStorage = window.localStorage.getItem(localStorageLanguageCodeKey);

      if (languageCodeFromLocalStorage !== null && Object.keys(messages).includes(languageCodeFromLocalStorage)) {
        setLanguageCode(languageCodeFromLocalStorage as LanguageCode);
      } else {
        setLanguageCode(defaultLanguage);
      }
    }
  }, [languageCode]);

  useEffect(() => {
    if (languageCode !== null && languageCode !== previousLanguageCode.current) {
      window.localStorage.setItem(localStorageLanguageCodeKey, languageCode);
    }

    previousLanguageCode.current = languageCode;
  }, [languageCode]);

  useEffect(() => {
    if (languageCode !== null) {
      dayjs.locale(languageCode);
    }
  }, [languageCode]);

  return languageCode === null ? (
    <ActivityIndicator takeOver />
  ) : (
    <LocalizationContext.Provider value={{ dir: directions[languageCode], languageCode, setLanguageCode }}>
      <ReactIntlProvider key={languageCode} locale={languageCode} messages={messages[languageCode]}>
        {children}
      </ReactIntlProvider>
    </LocalizationContext.Provider>
  );
}
