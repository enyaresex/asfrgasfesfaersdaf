import classNames from 'classnames';
import React from 'react';
import ReactCountdown, { zeroPad } from 'react-countdown';
import styles from './Countdown.module.css';

type Color = 'orange' | 'white' | 'yellow';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, {
  color?: Color,
  date: Date | string | number,
  includeDays?: boolean,
  onComplete?: () => void,
}>;

export default function Countdown({
  className,
  color = 'white',
  date,
  includeDays = true,
  onComplete,
  ...props
}: Props) {
  return (
    <ReactCountdown
      date={date}
      intervalDelay={0}
      onComplete={onComplete}
      onMount={({ days, hours, minutes, seconds }) => {
        if (onComplete && days + hours + minutes + seconds === 0) {
          onComplete();
        }
      }}
      renderer={({ days, hours, minutes, seconds }) => (
        <div {...props} className={classNames(styles.countdown, styles[color], className)}>
          {includeDays ? (
            <>
              <span>
                {days}
              </span>

              {' : '}

              <span>
                {zeroPad(hours)}
              </span>

              {' : '}

              <span>
                {zeroPad(minutes)}
              </span>

              {' : '}

              <span>{zeroPad(seconds)}</span>
            </>
          ) : (
            <>
              <span>
                {zeroPad(hours)}
              </span>

              {' : '}

              <span>
                {zeroPad(minutes)}
              </span>

              {' : '}

              <span>{zeroPad(seconds)}</span>
            </>
          )}

        </div>
      )}
      zeroPadTime={2}
    />
  );
}
