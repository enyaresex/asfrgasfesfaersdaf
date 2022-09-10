import classNames from 'classnames';
import Link from 'next/link';
import React, { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { Swiper, SwiperSlide } from 'swiper/react';
import useSWR from 'swr';
import { LocalizationContext, RegionContext } from '../../contexts';
import ActivityIndicator from '../ActivityIndicator';
import Container from '../Container';
import { ReactComponent as Arrow } from './arrow.svg';
import styles from './GameBrowser.module.css';

type Props = React.PropsWithoutRef<JSX.IntrinsicElements['div']>;

export default function GameBrowser({ className, ...props }: Props) {
  const { region } = useContext(RegionContext);
  const { dir } = useContext(LocalizationContext);
  const { data: games } = useSWR<Game[]>(`/games/?is_active=true&region=${region.id}`);

  return (
    <section {...props} className={classNames(styles.gamesBrowser, className)}>
      <Container>
        <h3>
          <FormattedMessage defaultMessage="Browse Games" />
        </h3>

        <div className={styles.content}>
          <button aria-label="previous" className={classNames(styles.navigation, styles.prev)} type="button">
            <Arrow />
          </button>

          <Swiper
            className={styles.slider}
            dir={dir}
            id="gamesBrowser"
            navigation={{
              nextEl: `.${styles.next}`,
              prevEl: `.${styles.prev}`,
              disabledClass: `${styles.disabled}`,
            }}
            slidesPerView="auto"
            spaceBetween={10}
          >
            {games === undefined ? (
              <ActivityIndicator />
            ) : (
              <>
                {games.map((g) => (
                  <SwiperSlide className={styles.slide} key={g.id}>
                    <Link href={`/duels?game=${g.id}`}>
                      <a className={styles.anchor}>
                        <img alt={g.name} loading="lazy" src={g.image} />
                      </a>
                    </Link>
                  </SwiperSlide>
                ))}
              </>
            )}
          </Swiper>

          <button aria-label="next" className={classNames(styles.navigation, styles.next)} type="button">
            <Arrow />
          </button>
        </div>
      </Container>
    </section>
  );
}
