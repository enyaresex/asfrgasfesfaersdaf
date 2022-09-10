import classNames from 'classnames';
import Markdown from 'markdown-to-jsx';
import Head from 'next/head';
import React from 'react';
import Container from '../Container';
import Layout from '../Layout';
import styles from './LegalPage.module.css';

type Props = {
  className?: string,
  content: string,
  description?: string,
  title: string,
};

export default function LegalPage({ className, content, description, title }: Props) {
  return (
    <>
      <Head>
        <title>{`${title} - Gamer Arena`}</title>

        <meta
          content={`Gamer Arena - ${title}`}
          name="description"
        />
      </Head>

      <Layout className={classNames(styles.legalPage, className)}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>{title}</h1>

            {description && (
              <p className={styles.description}>{description}</p>
            )}
          </div>
        </div>

        <section className={styles.body}>
          <Container className={styles.container}>
            <Markdown className={styles.content}>
              {content}
            </Markdown>
          </Container>
        </section>
      </Layout>
    </>
  );
}
