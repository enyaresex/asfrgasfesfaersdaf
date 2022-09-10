import classNames from 'classnames';
import React, { useMemo, useRef } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useClickAway } from 'react-use';
import BoxLabel from '../BoxLabel';
import Checkbox from '../Checkbox';
import FormGroup from '../FormGroup';
import styles from './MultiSelect.module.css';

type OptionValue = number | string;

type Option = {
  imageRadius?: boolean,
  image?: string,
  label: string,
  value: OptionValue,
};

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['details']>, {
  id: string,
  label?: React.ReactNode,
  onChange: (value: OptionValue[]) => any,
  options: Option[],
  size?: FormComponentSize,
  value: OptionValue[],
}>;

const sizeStyles: Record<FormComponentSize, string> = {
  large: styles.sizeLarge,
  medium: styles.sizeMedium,
  small: styles.sizeSmall,
};

export default function MultiSelect({ className, id, label, onChange, options, size = 'medium', value, ...props }: Props) {
  const intl = useIntl();
  const details = useRef<HTMLDetailsElement>(null);

  const valueString = useMemo<string | null>(() => {
    if (value.length === 0) return null;

    if (value.length === 1) {
      const selectedOption = options.find((o) => o.value === value[0]);

      return selectedOption?.label || '1 item selected';
    }

    return intl.formatMessage({
      defaultMessage: '{lengthOfValue} selected',
    }, {
      lengthOfValue: value.length,
    });
  }, [value]);

  useClickAway(details, () => {
    if (details.current === null) return;

    if (details.current.hasAttribute('open')) {
      details.current.removeAttribute('open');
    }
  });

  return (
    <details
      className={classNames(
        styles.multiSelect,
        sizeStyles[size],
        details.current?.hasAttribute('open') && styles.open,
        className,
      )}
      ref={details}
      {...props}
    >
      <summary className={styles.summary}>
        <div className={styles.input}>
          {label !== undefined && (
            <BoxLabel onTop={valueString !== null} size={size}>
              {label}
            </BoxLabel>
          )}

          {valueString}
        </div>
      </summary>

      <div className={styles.options}>
        <div className={styles.clearButtonWrapper}>
          <button
            className={styles.clearButton}
            onClick={() => {
              onChange([]);
            }}
            type="button"
          >
            <FormattedMessage defaultMessage="Clear" />
          </button>
        </div>

        {options.map((o) => (
          <FormGroup className={styles.formGroup} key={o.value}>
            <Checkbox
              checked={value.includes(o.value)}
              className={styles.checkbox}
              id={`${id}-${o.value}`}
              imageRadius={o.imageRadius}
              label={o.label}
              labelImage={o.image}
              onChange={(event) => {
                const valueSet = new Set([...value]);

                if (event.target.checked) {
                  valueSet.add(o.value);
                } else {
                  valueSet.delete(o.value);
                }

                onChange(Array.from(valueSet));
              }}
            />
          </FormGroup>
        ))}
      </div>
    </details>
  );
}
