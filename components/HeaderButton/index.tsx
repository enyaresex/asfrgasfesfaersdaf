import classNames from 'classnames';
import React from 'react';
import styles from './HeaderButton.module.css';

type Props = React.PropsWithoutRef<JSX.IntrinsicElements['button']>;

export default function HeaderButton({ className, children, onClick: onClickFromProps, ...props }: Props) {
  function onClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    event.currentTarget.blur();

    onClickFromProps && onClickFromProps(event);
  }

  return (
    <button {...props} className={classNames(styles.wrapper, className)} onClick={onClick} type="button">
      {children}
    </button>
  );
}
