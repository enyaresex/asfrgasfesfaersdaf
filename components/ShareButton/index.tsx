import classNames from 'classnames';
import React, { useContext, useMemo } from 'react';
import { useIntl } from 'react-intl';
import useCopyToClipboard from 'react-use/lib/useCopyToClipboard';
import { ToastsContext } from '../../contexts';
import Tippy from '../Tippy';
import { ReactComponent as CopyLink } from './copyLink.svg';
import { ReactComponent as Facebook } from './facebook.svg';
import { ReactComponent as Share } from './share.svg';
import styles from './ShareButton.module.css';
import { ReactComponent as Twitter } from './twitter.svg';
import { ReactComponent as WhatsApp } from './whatsapp.svg';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['button']>, {
  text: string,
  url?: string,
}>;

export default function ShareButton({ className, text, url, ...props }: Props) {
  const intl = useIntl();
  const [, copyToClipboard] = useCopyToClipboard();
  const { addToast } = useContext(ToastsContext);
  const pageUrl = useMemo<string>(() => url || window.location.href, [url, window.location.href]);
  const encodedPageUrl = useMemo<string>(() => encodeURIComponent(pageUrl), [pageUrl]);

  return (
    <Tippy
      content={(
        <div className={styles.content}>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedPageUrl}`}
            rel="noreferrer"
            target="_blank"
          >
            <Facebook />
          </a>

          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodedPageUrl}`}
            rel="noreferrer"
            target="_blank"
          >
            <Twitter />
          </a>

          <a
            href={`whatsapp://send?text=${text} ${encodedPageUrl} `}
            rel="noreferrer"
            target="_blank"
          >
            <WhatsApp />
          </a>

          <button
            className={styles.copyLink}
            onClick={() => {
              copyToClipboard(pageUrl);

              addToast({
                content: intl.formatMessage({ defaultMessage: 'The link is copied to the clipboard.' }),
                kind: 'success',
              });
            }}
            type="button"
          >
            <CopyLink />
          </button>
        </div>
      )}
      delay={[0, 500]}
      interactive
    >
      <button {...props} className={classNames(styles.shareButton, className)} type="button">
        <Share />
      </button>
    </Tippy>
  );
}
