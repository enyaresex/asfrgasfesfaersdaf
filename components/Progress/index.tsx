import classNames from 'classnames';
import React from 'react';
import range from 'lodash/range';
import styles from './Progress.module.css';

type BarColor = 'green' | 'red';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, {
  barColor?: BarColor,
  height?: number,
  partitions?: number,
  progress: number
}>;

const barColorStyles: Record<BarColor, string> = {
  green: styles.barColorGreen,
  red: styles.barColorRed,
};

export default function Progress({ className, barColor = 'green', height = 14, partitions = 4, progress, ...props }: Props) {
  return (
    <div {...props} className={classNames(className, styles.progress, barColorStyles[barColor])} style={{ height: `${height}px` }}>
      {range(0, partitions - 1).map((p) => (
        <div className={styles.separator} key={p} style={{ left: `${(100 / partitions) * (p + 1)}%` }} />
      ))}

      <div className={styles.bar} style={{ width: `${progress}%` }} />
    </div>
  );
}
