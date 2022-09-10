import classNames from 'classnames';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { BreakpointContext } from '../../contexts';
import { ReactComponent as Back } from './back.svg';
import styles from './SettingsSectionTitle.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, {
  title: string,
}>;

export default function SettingsSectionTitle({ className, title, ...props }: Props) {
  const router = useRouter();
  const { device } = useContext(BreakpointContext);

  return (
    <div {...props} className={classNames(styles.settingsSectionTitle, className)}>
      {device !== 'desktop' && (
        <button
          className={styles.goBack}
          onClick={() => router.replace('/settings')}
          type="button"
        >
          <Back />
        </button>
      )}

      <h3>{title}</h3>
    </div>
  );
}
