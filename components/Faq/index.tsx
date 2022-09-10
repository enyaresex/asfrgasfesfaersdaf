import classNames from 'classnames';
import React, { useMemo, useState } from 'react';
import AnimateHeight from 'react-animate-height';
import { FormattedMessage, useIntl } from 'react-intl';
import Container, { Props as ContainerProps } from '../Container';
import YoutubeVideo from '../YoutubeVideo';
import styles from './Faq.module.css';
import { ReactComponent as Plus } from './plus.svg';

type Item = {
  title: string,
  context: React.ReactNode,
};

export type Props = ContainerProps;

export default function Faq({ className, ...props }: Props) {
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const intl = useIntl();

  const content = useMemo<Item[]>(() => [
    {
      title: intl.formatMessage({ defaultMessage: 'What is Gamer Arena?' }),
      context: (
        <>
          <p>
            <FormattedMessage defaultMessage="Gamer Arena is an online competitive esports platform where you can match and compete with opponents and teams of your skill level across numerous gaming titles, earn money, enter and work your way through the ladder all the way to professional gaming stardom. You can watch our promotional video below." />
          </p>

          <YoutubeVideo
            className={styles.youtubeVideo}
            videoId="rztNEWIiG5k"
          />
        </>
      ),
    },
    {
      title: intl.formatMessage({ defaultMessage: 'Is it free to sign up?' }),
      context: intl.formatMessage({ defaultMessage: 'It is completely FREE to sign up! We only collect commissions from paid duels (10% of entry fees) and withdraw requests (5%) as our service fee.' }),
    },
    {
      title: intl.formatMessage({ defaultMessage: 'Can I create more than one account?' }),
      context: intl.formatMessage({ defaultMessage: 'It is strictly forbidden to create more than one Gamer Arena account. We automatically deactivate user accounts signing in from the same device, so please only use your personal devices.' }),
    },
    {
      title: intl.formatMessage({ defaultMessage: 'How old must I be?' }),
      context: intl.formatMessage({ defaultMessage: 'You have to be 13+ to sign up and participate in free duels. But to participate in paid duels and deposit/withdraw money, you need to be 18+.' }),
    },
    {
      title: intl.formatMessage({ defaultMessage: 'Is Gamer Arena legal?' }),
      context: intl.formatMessage({ defaultMessage: 'Yes, Gamer Arena is NOT a gambling company! We only host SKILL-BASED video game competitions where success is determined by the player\'s own skills, not by chance or the outcome of some other players playing.' }),
    }], []);

  return (
    <section {...props} className={classNames(className, styles.faq)} data-cy="faq">
      <Container className={styles.section}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            <FormattedMessage defaultMessage="Have Questions?" />
          </h2>

          <h6 className={styles.subTitle}>
            <FormattedMessage
              defaultMessage="You can find more help articles at <link>help.gamerarena.com</link>"
              values={{
                link: (...chunks: string[]) => (
                  <a href="https://help.gamerarena.com" rel="noreferrer" target="_blank">
                    {chunks}
                  </a>
                ),
              }}
            />
          </h6>
        </div>

        {content.map(({ title, context }, index) => (
          <div className={classNames(styles.question, activeItem === index && styles.active)} key={title}>
            <button
              className={styles.title}
              onClick={() => setActiveItem((prev) => (prev === index ? null : index))}
              type="button"
            >
              <p>{title}</p>

              <Plus />
            </button>

            <AnimateHeight
              duration={150}
              height={activeItem === index ? 'auto' : 0}
            >
              <div className={styles.content}>{activeItem === index && context}</div>
            </AnimateHeight>
          </div>
        ))}
      </Container>
    </section>
  );
}
