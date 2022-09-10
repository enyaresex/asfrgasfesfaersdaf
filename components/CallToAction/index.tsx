import classNames from 'classnames';
import Link from 'next/link';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '../Button';
import Container, { Props as ContainerProps } from '../Container';
import styles from './CallToAction.module.css';

export type Props = Overwrite<ContainerProps, {
  title: React.ReactNode,
  content: React.ReactNode,
}>;

export default function CallToAction({ className, title, content, ...props }: Props) {
  return (
    <section {...props} className={classNames(styles.callToAction, className)}>
      <Container className={styles.container}>
        <h1 className={styles.title}>{title}</h1>

        <p className={styles.content}>{content}</p>

        <Link href="/?action=sign-up" passHref>
          <Button className={styles.button} size="large">
            <FormattedMessage defaultMessage="Sign Up" />
          </Button>
        </Link>
      </Container>
    </section>
  );
}
