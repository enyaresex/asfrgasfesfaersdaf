import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import React, { useContext } from 'react';
import { useIntl } from 'react-intl';
import { HeadTagsHandler, LegalPage } from '../../components';
import { LocalizationContext } from '../../contexts';

type Contents = Record<LanguageCode, string>;

type Props = {
  contents: Contents,
};

export default function PrivacyPolicy({ contents }: Props) {
  const intl = useIntl();
  const { languageCode } = useContext(LocalizationContext);

  return (
    <>
      <HeadTagsHandler title={`${intl.formatMessage({ defaultMessage: 'Privacy Policy' })} | Gamer Arena`} />

      <LegalPage
        content={contents[languageCode]}
        description={intl.formatMessage({ defaultMessage: 'v1.1 - Last updated on {lastUpdatedOn}.' }, {
          lastUpdatedOn: intl.formatDate('2019-12-31'),
        })}
        title={intl.formatMessage({ defaultMessage: 'Privacy Policy' })}
      />
    </>
  );
}

type StaticProps = {
  props: Props,
};

export function getStaticProps(): StaticProps {
  const markdownPathAr = path.join(process.cwd(), 'pages', 'privacy-policy', 'privacy-policy-ar.md');
  const markdownPathEn = path.join(process.cwd(), 'pages', 'privacy-policy', 'privacy-policy-en.md');
  const markdownPathTr = path.join(process.cwd(), 'pages', 'privacy-policy', 'privacy-policy-tr.md');

  const markdownFileContentAr = fs.readFileSync(markdownPathAr);
  const markdownFileContentEn = fs.readFileSync(markdownPathEn);
  const markdownFileContentTr = fs.readFileSync(markdownPathTr);

  const markdownAr = matter(markdownFileContentAr);
  const markdownEn = matter(markdownFileContentEn);
  const markdownTr = matter(markdownFileContentTr);

  return {
    props: {
      contents: {
        ar: markdownAr.content,
        en: markdownEn.content,
        tr: markdownTr.content,
      },
    },
  };
}
