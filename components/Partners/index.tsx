import classNames from 'classnames';
import React from 'react';
import Container from '../Container';
import styles from './Partners.module.css';
// import { ReactComponent as Ininal } from './ininal.svg';
// import n11Logo from './n11.png';
import { ReactComponent as Papara } from './papara.svg';
import { ReactComponent as Vodafone } from './vodafone.svg';

type Props = React.PropsWithoutRef<JSX.IntrinsicElements['section']>;

export default function Partners({ className, ...props }: Props) {
  return (
    <section {...props} className={classNames(styles.partners, className)} data-cy="partners">
      <Container>
        <div className={styles.wrapper}>
          <div className={styles.partner}>
            <a
              aria-label="Vodafone"
              href="https://www.vodafone.com.tr/freezone/avantajlar/gamer-arena-kampanyasi/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Vodafone className={styles.icon} />
            </a>
          </div>
          <div className={styles.partner}>
            <a
              aria-label="Papara"
              href="https://www.papara.com/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Papara className={styles.icon} />
            </a>
          </div>
          {/* <div className={styles.partner}> */}
          {/*  <a */}
          {/*    aria-label="Ininal" */}
          {/*    href="https://www.ininal.com/" */}
          {/*    rel="noopener noreferrer" */}
          {/*    target="_blank" */}
          {/*  > */}
          {/*    <Ininal className={styles.icon} /> */}
          {/*  </a> */}
          {/* </div> */}
          {/* <div className={styles.partner}> */}
          {/*  <a */}
          {/*    aria-label="N11" */}
          {/*    href="https://www.n11.com/" */}
          {/*    rel="noopener noreferrer" */}
          {/*    target="_blank" */}
          {/*  > */}
          {/*    <img loading="lazy" src={n11Logo} alt="n11" /> */}
          {/*  </a> */}
          {/* </div> */}
        </div>
      </Container>
    </section>
  );
}
