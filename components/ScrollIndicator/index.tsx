import classNames from 'classnames';
import React from 'react';
import Container from '../Container';
import { ReactComponent as Arrow } from './arrow.svg';
import { ReactComponent as Mouse } from './mouse.svg';
import styles from './ScrollIndicator.module.css';

type Icon = 'arrow' | 'mouse';

const icons: Record<Icon, React.ReactNode> = {
  arrow: <Arrow className={styles.arrow} />,
  mouse: <Mouse className={styles.mouse} />,
};

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, {
  icon: Icon,
}>;

export default function ScrollIndicator({ className, icon, ...props }: Props) {
  return (
    <div
      {...props}
      className={classNames(styles.scrollIndicator, className)}
    >
      <Container className={styles.container}>
        <section className={styles.section}>
          {icons[icon]}
        </section>
      </Container>
    </div>
  );
}
