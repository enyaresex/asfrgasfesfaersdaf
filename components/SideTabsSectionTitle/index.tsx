import classNames from 'classnames';
import React from 'react';
import styles from './SideTabsSectionTitle.module.css';

type Props = React.PropsWithoutRef<JSX.IntrinsicElements['p']>;

export default function SideTabsSectionTitle({ className, ...props }: Props) {
  return (
    <p {...props} className={classNames(styles.sideTabsSectionTitle, className)} />
  );
}
