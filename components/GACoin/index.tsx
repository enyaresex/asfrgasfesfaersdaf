import classNames from 'classnames';
import React from 'react';
import { ReactComponent as Coins } from './coins.svg';
import styles from './GACoin.module.css';
import { ReactComponent as ThreeCoins } from './threeCoins.svg';

type Props = React.PropsWithoutRef<JSX.IntrinsicElements['svg']> & {
  className?: string,
  grayscale?: boolean,
  triple?: true,
};

export default function GACoin({ className, grayscale, triple, ...props }: Props) {
  return (
    triple
      ? <ThreeCoins {...props} className={classNames(className, grayscale && styles.grayscale)} />
      : <Coins {...props} className={classNames(className, grayscale && styles.grayscale)} />
  );
}
