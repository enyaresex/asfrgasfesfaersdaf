import classNames from 'classnames';
import React from 'react';
import styles from './Avatar.module.css';
import { ReactComponent as Banned } from './banned.svg';
import { ReactComponent as Blocked } from './blocked.svg';

type BorderColor = 'gray' | 'green' | 'orange' | 'red' | 'yellow';

type RankBorderColor = 'bronze' | 'gold' | 'red' | 'silver';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, {
  alt?: string,
  borderColor?: BorderColor,
  borderType?: DuelStatus,
  duelCount?: number,
  flag?: string,
  image: string,
  isBanned?: boolean,
  isBlocked?: boolean,
  isOnline?: boolean,
  rank?: number,
  rankBorderColor?: RankBorderColor,
  size?: number,
}>;

const borderColorStyles: Record<BorderColor, string> = {
  gray: styles.borderGray,
  green: styles.borderGreen,
  orange: styles.borderOrange,
  red: styles.borderRed,
  yellow: styles.borderYellow,
};

const rankBorderStyles: Record<RankBorderColor, string> = {
  bronze: styles.rankBorderBronze,
  gold: styles.rankBorderGold,
  red: styles.rankBorderRed,
  silver: styles.rankBorderSilver,
};

export default function Avatar({
  alt = 'avatar',
  borderColor,
  borderType,
  className,
  duelCount,
  flag,
  image,
  isBanned = false,
  isBlocked = false,
  isOnline = false,
  rank,
  rankBorderColor = 'red',
  size = 50,
  ...props
}: Props) {
  return (
    <div
      {...props}
      className={classNames(styles.avatar, flag && styles.withFlag, isBanned && styles.banned, className)}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <img
        alt={alt}
        className={classNames(
          styles.image,
          borderType && styles[borderType.toLowerCase()],
          borderColor && borderColorStyles[borderColor],
        )}
        loading="lazy"
        src={image}
      />

      {duelCount !== undefined && (
        <div
          className={styles.duelCount}
          style={{ width: `${(size * 0.5).toFixed()}px`, height: `${(size * 0.5).toFixed()}px` }}
        >
          <p>
            <span className={styles.muted}>x</span>
            {duelCount}
          </p>
        </div>
      )}

      {(!isBanned && flag !== undefined) && (
        <img
          alt="flag"
          className={styles.flag}
          loading="lazy"
          src={flag}
        />
      )}

      {isBanned && (
        <Banned className={classNames(styles.banned, rank !== undefined && styles.withRank)} />
      )}

      {(!isBanned && isBlocked) && (
        <Blocked className={styles.blocked} />
      )}

      {rank !== undefined && (
        <p className={classNames(styles.rank, rankBorderStyles[rankBorderColor])}>{`#${rank}`}</p>
      )}

      {(!isBanned && isOnline) && (
        <div
          className={styles.onlineIndicator}
          style={{ width: `${(size * 0.16).toFixed()}px`, height: `${(size * 0.16).toFixed()}px` }}
        />
      )}
    </div>
  );
}
