import classNames from 'classnames';
import React from 'react';
import { useIntl } from 'react-intl';
import styles from './YoutubeVideo.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, {
  videoId: string,
}>;

export default function YoutubeVideo({ className, videoId, ...props }: Props) {
  const intl = useIntl();

  return (
    <div
      {...props}
      className={classNames(styles.youtubeVideo, className)}
    >
      <iframe
        allowFullScreen
        frameBorder="0"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={intl.formatMessage({ defaultMessage: 'Video' })}
      />
    </div>
  );
}
