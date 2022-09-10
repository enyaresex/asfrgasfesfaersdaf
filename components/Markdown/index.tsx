import classNames from 'classnames';
import MarkdownToJsx, { MarkdownToJSX } from 'markdown-to-jsx';
import React from 'react';
import styles from './Markdown.module.css';

type Props = {
  children: string,
  className?: string,
  options?: Omit<MarkdownToJSX.Options, 'forceWrapper' | 'wrapper'>,
};

export default function Markdown({ children, className, ...props }: Props) {
  return (
    <MarkdownToJsx
      {...props}
      className={classNames(styles.markdown, className)}
      options={{ forceWrapper: true, wrapper: 'div' }}
    >
      {children || ''}
    </MarkdownToJsx>
  );
}
