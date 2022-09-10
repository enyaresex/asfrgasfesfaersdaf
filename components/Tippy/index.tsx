import ReactTippy, { TippyProps as ReactTippyProps } from '@tippyjs/react';
import classNames from 'classnames';
import React from 'react';
import styles from './Tippy.module.css';

type Props = ReactTippyProps;

export default function Tippy({ className, ...props }: Props) {
  return (
    <ReactTippy
      hideOnClick={false}
      {...props}
      className={classNames(styles.tippy, className)}
    />
  );
}
