import classNames from 'classnames';
import React, { useContext, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Swiper, SwiperSlide } from 'swiper/react';
import { LocalizationContext } from '../../contexts';
import Container from '../Container';
import { ReactComponent as Arrow } from './arrow.svg';
import cenkImageSource from './cenk.png';
import muhammetImageSource from './muhammet.png';
import { ReactComponent as Quotes } from './quotes.svg';
import styles from './Testimonials.module.css';
import yigitImageSource from './yigit.png';

type Props = React.PropsWithoutRef<JSX.IntrinsicElements['div']>;

type Item = {
  content: React.ReactNode,
  details: React.ReactNode,
  header: React.ReactNode,
  name: string,
  imageSource: string,
}

export default function Testimonials({ className, ...props }: Props) {
  const { dir } = useContext(LocalizationContext);
  const [isSliding, setIsSliding] = useState<boolean>(false);
  const intl = useIntl();

  const testimonials = useMemo<Item[]>(() => [
    {
      content: (
        <p>
          {intl.formatMessage({ defaultMessage: '"Gamer Arena, bizzat espor ve oyun platformları için kurulmuş. Ülkemiz adına böyle organizasyonların olması beni çok mutlu ediyor. Bu site sayesinde birçok gamer hem kendi arasında hem de sitenin düzenlediği düellolar sayesinde pek çok kazanç elde edebilir ve espor kariyerleri için kendini bu sitede kanıtlayabilir. "Herkesi yenerim" diyecek güçte olan birisinin kesinlikle bu sitede yer alması gerekiyor."' })}
        </p>
      ),
      details: intl.formatMessage({ defaultMessage: 'Bursa Espor Profesyonel Zula Oyuncusu - YouTuber' }),
      header: 'C4rboN',
      name: 'Yiğit "C4rboN" Dolu',
      imageSource: yigitImageSource.src,
    },
    {
      content: (
        <>
          <p>
            {intl.formatMessage({ defaultMessage: '"Kendini göstermek isteyen, yeteneklerini kanıtlamak isteyen oyuncular için harika bir fırsat. Bu arenada çok iyi istatistiklere sahip oyuncular kendilerini espor takımlarına gösterebilir. Halihazırda herhangi bir organizasyonda yer almayan takımlar hazırlık turnuvası gibi takımlı turnuvalara katılabilir. Hem bireysel hem takımsal olarak kendini gösterebileceğin, bunu yaparken gelir de elde edebildiğin harika bir platform."' })}
          </p>
        </>
      ),
      details: intl.formatMessage({ defaultMessage: 'Digital Athletics Profesyonel Zula Oyuncusu - YouTuber' }),
      header: 'Lewu',
      name: 'Muhammet "Lewu" Biroğlu',
      imageSource: muhammetImageSource.src,
    },
    {
      content: (
        <>
          <p>
            {intl.formatMessage({ defaultMessage: '"Gamer Arena genel olarak düzenlediği, yapmış olduğu etkinlikler bakımından oldukça iyi şekilde ilerliyor. Bu etkinlikleri, turnuvaları bol bol yapmalarının da buna etkisi var, sadece etkinlikleri yapılan oyunların detayları, olması gereken kuralları ve düzeni açısından daha ele alınıp, dikkat edilip yürütülmesi tercih ve ilerleme bakımından daha etkili olacaktır."' })}
          </p>
        </>
      ),
      details: intl.formatMessage({ defaultMessage: 'Profesyonel VALORANT Oyuncusu - YouTuber' }),
      header: 'CombatStaR',
      name: 'Cenk "CombatStaR" Erşahin',
      imageSource: cenkImageSource.src,
    },
  ], []);

  return (
    <div
      {...props}
      className={classNames(className, styles.testimonials)}
    >
      <Container>
        <div className={styles.title}>
          <p className={styles.main}>
            <FormattedMessage defaultMessage="Gamers Saying About Us..." />
          </p>

          <p className={styles.subTitle}>
            <FormattedMessage
              defaultMessage="Hear about what it is like to compete in the arena from our users."
            />
          </p>
        </div>
        <div>
          <Swiper
            className={styles.slider}
            dir={dir}
            id="testimonials"
            initialSlide={0}
            navigation={{
              nextEl: `.${styles.next}`,
              prevEl: `.${styles.prev}`,
              disabledClass: `${styles.disabled}`,
            }}
            onSlideChangeTransitionEnd={() => setIsSliding(false)}
            onSlideChangeTransitionStart={() => setIsSliding(true)}
            slidesPerView={1}
            tag="section"
          >
            {testimonials.map(({ content, details, header, name, imageSource }) => (
              <SwiperSlide className={styles.slide} key={name}>
                <div className={styles.col}>
                  <img alt="person" src={imageSource} />
                </div>

                <div className={classNames(styles.col, styles.alignEnd)}>
                  <h2 className={styles.header}>
                    {header}

                    <Quotes className={styles.quotes} />
                  </h2>
                  <div className={styles.content}>{content}</div>
                  <div className={styles.sub}>
                    <p className={styles.name}>{name}</p>
                    <p className={styles.details}>{details}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}

            <div className={classNames(styles.arrows, isSliding && styles.hide)} slot="container-end">
              <button aria-label="previous" className={classNames(styles.navigation, styles.prev)} type="button">
                <Arrow />
              </button>
              <button aria-label="next" className={classNames(styles.navigation, styles.next)} type="button">
                <Arrow />
              </button>
            </div>
          </Swiper>
        </div>
      </Container>
    </div>
  );
}
