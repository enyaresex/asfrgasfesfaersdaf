import classNames from 'classnames';
import React from 'react';
import styles from './Container.module.css';

export type Props = React.PropsWithoutRef<JSX.IntrinsicElements['div']> & {
  fluid?: boolean,
};

export default function Container({ className, fluid = false, ...props }: Props) {
  return (
    <div {...props} className={classNames(styles.container, fluid && styles.fluid, className)} />
  );
}
