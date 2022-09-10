import Head from 'next/head';
import React, { useContext, useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { LocalizationContext } from '../../contexts';
import bg from './bg.jpg';

type Props = {
  children?: React.ReactNode,
  description?: string,
  imageUrl?: string,
  title: string,
};

const languageCodes: Record<LanguageCode, string> = {
  ar: 'ar_SA',
  en: 'en_US',
  tr: 'tr_TR',
};

export default function HeadTagsHandler({ children, description, imageUrl = bg.src, title }: Props) {
  const intl = useIntl();

  const { dir, languageCode } = useContext(LocalizationContext);

  const url = useMemo<string>(() => window.location.href, []);

  useEffect(() => {
    document.documentElement.lang = languageCode;
    document.documentElement.dir = dir;
  }, [languageCode]);

  return (
    <Head>
      <title>{title}</title>

      <meta content={url} key="url" property="og:url" />

      <meta content="website" key="og:type" property="og:type" />

      <meta
        content={intl.formatMessage({ defaultMessage: 'Gamer Arena | Competitive Esports Platform' })}
        key="og:title"
        property="og:site_name"
      />

      <meta content={title} key="og:title" property="og:title" />

      {description !== undefined && (
        <meta
          content={description}
          key="og:description"
          property="og:description"
        />
      )}

      <meta content={languageCodes[languageCode]} key="og:locale" property="og:locale" />

      {(Object.keys(languageCodes) as LanguageCode[]).filter((l) => l !== languageCode).map((l) => (
        <meta content={languageCodes[l]} key="og:locale:alternate" property="og:locale:alternate" />
      ))}

      <meta content={imageUrl} itemProp="image" key="og:image" property="og:image" />

      <meta content="1200" key="og:image:width" property="og:image:width" />

      <meta content="630" key="og:image:height" property="og:image:height" />

      <meta content={Date.now().toString()} key="updated_time" property="og:updated_time" />

      <meta content="summary" key="twitter:card" name="twitter:card" />

      <meta content="@gamerarena_com" key="twitter:site" name="twitter:site" />

      <meta content="@gamerarena_com" key="twitter:creator" name="twitter:creator" />

      {children}
    </Head>
  );
}
