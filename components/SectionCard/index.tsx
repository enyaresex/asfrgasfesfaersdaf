import classNames from 'classnames';
import React, { useState } from 'react';
import AnimateHeight from 'react-animate-height';
import { ReactComponent as Plus } from './plus.svg';
import styles from './SectionCard.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['section']>, {
  collapsed?: boolean,
  collapsible?: boolean,
  header?: React.ReactNode,
  title?: string,
}>;

export default function SectionCard({
  className,
  children,
  collapsed = false,
  collapsible,
  header,
  title,
  ...props
}: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(!collapsed);

  return collapsible ? (
    <section
      {...props}
      className={classNames(
        styles.sectionCard,
        styles.collapsible,
        isOpen && styles.open,
        className,
      )}
    >
      <button className={styles.header} onClick={() => setIsOpen((prev) => (!prev))} type="button">
        <h4>{title}</h4>

        <Plus />
      </button>

      <AnimateHeight duration={150} height={isOpen ? 'auto' : 0}>
        <div className={styles.wrapper}>
          {children}
        </div>
      </AnimateHeight>
    </section>
  ) : (
    <section {...props} className={classNames(styles.sectionCard, !title && styles.noTitle, className)}>
      {(title || header) && (
        <div className={styles.header}>
          {header || <h4>{title}</h4>}
        </div>
      )}

      <div className={styles.wrapper}>
        {children}
      </div>
    </section>
  );
}
