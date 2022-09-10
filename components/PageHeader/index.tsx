import classNames from 'classnames';
import React from 'react';
import styles from './PageHeader.module.css';

type StaticBackground =
  'couponRedemption'
  | 'duelsListing'
  | 'passwordRecovery'
  | 'passwordReset'
  | 'settings'
  | 'wallet';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, {
  background: StaticBackground | string,
  description?: React.ReactNode,
  title?: React.ReactNode,
}>;

const staticBackgroundStyles: Record<StaticBackground, string> = {
  couponRedemption: styles.backgroundCouponRedemption,
  duelsListing: styles.backgroundDuelsListing,
  passwordRecovery: styles.backgroundPasswordRecovery,
  passwordReset: styles.backgroundPasswordReset,
  settings: styles.backgroundSettings,
  wallet: styles.backgroundWallet,
};

const staticBackgroundStylesKeys = Object.keys(staticBackgroundStyles);

export default function PageHeader({ background, className, description, style, title, ...props }: Props) {
  const pageHeaderStyle: React.CSSProperties = style || {};

  if (!staticBackgroundStylesKeys.includes(background)) {
    pageHeaderStyle.backgroundImage = `url("${background}")`;
  }

  return (
    <div
      {...props}
      className={classNames(
        styles.pageHeader,
        staticBackgroundStylesKeys.includes(background) && styles.backgroundStatic,
        staticBackgroundStylesKeys.includes(background) && staticBackgroundStyles[background as StaticBackground],
        className,
      )}
      style={pageHeaderStyle}
    >
      <div className={styles.body}>
        {title !== undefined && (
          <h1 className={styles.title}>{title}</h1>
        )}

        {description !== undefined && (
          <div className={styles.description}>
            {description}
          </div>
        )}
      </div>
    </div>
  );
}
