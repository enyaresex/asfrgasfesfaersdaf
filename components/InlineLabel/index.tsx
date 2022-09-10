import classNames from 'classnames';
import React from 'react';
import styles from './InlineLabel.module.css';

type Props = React.PropsWithoutRef<JSX.IntrinsicElements['div']> & {
  image?: string | undefined
  imageRadius?: boolean,
};

export default function InlineLabel({ children, className, image, imageRadius = true, ...props }: Props) {
  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <div
      {...props}
      className={classNames(
        styles.inlineLabel,
        image !== undefined && styles.withImage,
        className,
      )}
    >
      {image !== undefined && (
        <img
          alt={(children || '').toString()}
          className={classNames(imageRadius && styles.imageRadius)}
          loading="lazy"
          src={image}
        />
      )}

      {children}
    </div>
  );
}
