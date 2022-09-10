import classNames from 'classnames';
import React, { useState } from 'react';
import BoxLabel from '../BoxLabel';
import styles from './Textarea.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['textarea']>, {
  id: string,
  label?: React.ReactNode,
  size?: FormComponentSize,
}>;

const defaultTextareaHeight = 80;
const fontSizeCSSPropertyNames: Record<FormComponentSize, string> = {
  large: '--font-size',
  medium: '--font-size-small',
  small: '--font-size-smaller',
};

export default function Textarea({ className, id, label, size = 'medium', ...props }: Props) {
  const hasLabel = label !== undefined;
  const [textareaHeight, setTextareaHeight] = useState<number>(defaultTextareaHeight);

  function onTextareaInput(event: React.FormEvent<HTMLTextAreaElement>) {
    let newTextareaHeight: number = defaultTextareaHeight;
    const numberOfLines = event.currentTarget.value.split('\n').length;
    const fontSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue(fontSizeCSSPropertyNames[size]));

    if (numberOfLines > 2) {
      newTextareaHeight += (1.4 * numberOfLines * fontSize) - (hasLabel ? 40 : 52);
    }

    if (newTextareaHeight !== textareaHeight) {
      setTextareaHeight(newTextareaHeight);
    }
  }

  return (
    <div className={classNames(styles.textarea, hasLabel && styles.withLabel, className)}>
      {label && (
        <BoxLabel htmlFor={id} onTop size={size}>
          {label}
        </BoxLabel>
      )}

      <textarea
        {...props}
        className={styles.input}
        id={id}
        onInput={onTextareaInput}
        style={{ height: `${textareaHeight}px` }}
      />
    </div>
  );
}
