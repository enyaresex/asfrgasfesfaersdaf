import classNames from 'classnames';
import React from 'react';
import styles from './Button.module.css';
import { ReactComponent as Send } from './send.svg';
import { ReactComponent as Swords } from './swords.svg';
import { ReactComponent as Go } from './go.svg';

type Icon = 'go' | 'send' | 'swords';
type Variant = 'green' | 'primary' | 'secondary';

type CommonProps = {
  children?: React.ReactNode,
  fullWidth?: boolean,
  icon?: Icon,
  withIcon?: boolean,
  outline?: boolean,
  size?: FormComponentSize,
  variant?: Variant,
};

type ButtonElementProps = React.PropsWithoutRef<JSX.IntrinsicElements['button']>;

type AnchorElementProps = React.PropsWithoutRef<JSX.IntrinsicElements['a']>;

export type Props = CommonProps & (ButtonElementProps | AnchorElementProps);

const icons: Record<Icon, React.ReactNode> = {
  go: <Go />,
  send: <Send />,
  swords: <Swords />,
};

const sizeStyles: Record<FormComponentSize, string> = {
  large: styles.sizeLarge,
  medium: styles.sizeMedium,
  small: styles.sizeSmall,
};

const variantStyles: Record<Variant, string> = {
  green: styles.variantGreen,
  primary: styles.variantPrimary,
  secondary: styles.variantSecondary,
};

function Button({
  children,
  className,
  fullWidth = false,
  icon,
  outline = false,
  size = 'medium',
  variant = 'primary',
  withIcon = false,
  ...props
}: Props, ref: React.Ref<HTMLAnchorElement | HTMLButtonElement>) {
  const commonProps = {
    ...props,
    className: classNames(
      styles.button,
      fullWidth && styles.fullWidth,
      (icon !== undefined && children === undefined) && styles.iconOnly,
      sizeStyles[size],
      variantStyles[variant],
      outline && styles.outline,
      withIcon && styles.withIcon,
      !children && styles.noChildren,
      className,
    ),
    ref,
  };

  const newChildren = (
    <>
      {icon !== undefined && icons[icon]}

      {children}
    </>
  );

  if ('href' in props) {
    return (
      <a
        {...commonProps as AnchorElementProps}
        href={props.href}
      >
        {newChildren}
      </a>
    );
  }

  return (
    <button
      {...commonProps as ButtonElementProps}
      type={(props as ButtonElementProps).type} /* eslint-disable-line react/button-has-type */
    >
      {newChildren}
    </button>
  );
}

export default React.forwardRef(Button);
