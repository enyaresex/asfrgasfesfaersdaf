import classNames from 'classnames';
import React, { useContext, useEffect, useRef, useState } from 'react';
import AnimateHeight from 'react-animate-height';
import { FormattedMessage } from 'react-intl';
import { useClickAway } from 'react-use';
import useSWR from 'swr';
import { RegionContext } from '../../contexts';
import { useKeyDown } from '../../hooks';
import Avatar from '../Avatar';
import BackgroundShade from '../BackgroundShade';
import Container from '../Container';
import Progress from '../Progress';
import { ReactComponent as BronzeMedal } from './bronzeMedal.svg';
import { ReactComponent as Carat } from './carat.svg';
import { ReactComponent as GoldMedal } from './goldMedal.svg';
import { ReactComponent as PlatinumMedal } from './platinumMedal.svg';
import styles from './Rank.module.css';
import { ReactComponent as SilverMedal } from './silverMedal.svg';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['section']>, {
  userRank?: number
  gameId?: number,
}>;

type RankObj = {
  icon: React.ReactNode,
  max: number | null,
  min: number,
  name: string,
  next: Rank | null,
};

const ranks: Record<Rank, RankObj> = {
  bronze: {
    icon: <BronzeMedal />,
    max: 1199,
    min: 0,
    name: 'Bronze',
    next: 'silver',
  },
  silver: {
    icon: <SilverMedal />,
    max: 2249,
    min: 1200,
    name: 'Silver',
    next: 'gold',
  },
  gold: {
    icon: <GoldMedal />,
    max: 2999,
    min: 2250,
    name: 'Gold',
    next: 'platinum',
  },
  platinum: {
    icon: <PlatinumMedal />,
    max: null,
    min: 3000,
    name: 'Platinum',
    next: null,
  },
};

export default function Rank({ className, userRank = 768, gameId = 10, ...props }: Props) {
  const { region } = useContext(RegionContext);
  const section = useRef<HTMLElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [userStatus, setUserStatus] = useState<{
    currentRank: Rank,
    nextRank: Rank | null,
  }>({
    currentRank: 'bronze',
    nextRank: 'silver',
  });
  const { data: games } = useSWR(`/games/?is_active=true&region=${region.id}`);
  const game = games === undefined ? null : games.find((g: Game) => g.id === gameId);

  useEffect(() => {
    const current = (Object.keys(ranks) as Rank[])
      .filter((rank) => ranks[rank].min <= userRank)
      .slice(-1)[0];

    setUserStatus({
      currentRank: current,
      nextRank: ranks[current].next,
    });
  }, [userRank]);

  useClickAway(section, () => {
    if (isOpen) {
      setIsOpen(false);
    }
  });

  useKeyDown(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  }, ['escape']);

  return game === null ? null : (
    <>
      <BackgroundShade isVisible={isOpen} />

      <section {...props} className={classNames(className, styles.rank)} ref={section}>
        <Container className={styles.header} fluid>
          <div className={styles.details}>
            <p className={styles.from}>
              {`${ranks[userStatus.currentRank].name}:`}
              <span className={styles.userRank}>
                {' '}
                {userRank}
                {userStatus.nextRank !== null && `/ ${ranks[userStatus.nextRank].min}`}
              </span>
            </p>

            <p className={styles.game}>{game.name}</p>

            {userStatus.nextRank !== null && (
              <p className={styles.to}>{ranks[userStatus.nextRank].name}</p>
            )}
          </div>
          {userStatus.nextRank !== null && (
            <div className={styles.progress}>
              {ranks[userStatus.currentRank].icon}

              <Progress
                progress={(
                  (userRank - ranks[userStatus.currentRank].min)
                  / (ranks[userStatus.nextRank].min - ranks[userStatus.currentRank].min))
                * 100}
              />

              {ranks[userStatus.nextRank].icon}
            </div>
          )}
        </Container>

        <AnimateHeight duration={150} height={isOpen ? 'auto' : 0}>
          <div className={styles.content}>
            <div className={styles.wrapper}>
              <div className={styles.gameStats}>
                <div className={styles.avatar}>
                  <Avatar className={styles.gameImage} image={game.image} size={50} />
                </div>

                <p className={styles.gameInfo}>
                  45th
                  <span>
                    <FormattedMessage defaultMessage="Ranking" />
                  </span>
                </p>

                <p className={styles.gameInfo}>
                  12
                  <span>
                    <FormattedMessage defaultMessage="Wins" />
                  </span>
                </p>

                <p className={styles.gameInfo}>
                  5
                  <span>
                    <FormattedMessage defaultMessage="Loses" />
                  </span>
                </p>

                <p className={styles.gameInfo}>
                  75%
                  <span>
                    <FormattedMessage defaultMessage="Win Rate" />
                  </span>
                </p>
              </div>

              <div className={styles.rankingLevels}>
                <p className={styles.title}>
                  <FormattedMessage defaultMessage="Ranking Levels" />
                </p>

                {(Object.keys(ranks) as Rank[]).map<JSX.Element>((rank) => (
                  <div className={styles.rankInfo} key={rank}>
                    {ranks[rank].icon}
                    <p className={styles.info}>
                      <span className={styles[rank]}>
                        {ranks[rank].name}
                        {': '}
                      </span>
                      <span>
                        {ranks[rank].max !== null
                          ? `${ranks[rank].min} - ${ranks[rank].max}`
                          : `${ranks[rank].min} +`}
                        {' MMR'}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimateHeight>

        <button
          className={classNames(styles.toggle, isOpen && styles.toggled)}
          onClick={() => setIsOpen((previousIsOpen) => !previousIsOpen)}
          type="button"
        >
          <Carat />
        </button>
      </section>
    </>
  );
}
