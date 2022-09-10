import classNames from 'classnames';
import React, { useContext, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { AnalyticsContext, AuthAndApiContext, RegionContext } from '../../contexts';
import { sendGAEvent } from '../../helpers';
import FormGroup from '../FormGroup';
import TextInput from '../TextInput';
import { ReactComponent as Add } from './add.svg';
import { ReactComponent as Extract } from './extract.svg';
import styles from './WithdrawAmountSelection.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['section']>, {
  amount: number | null,
  error?: Array<string>,
  setAmount: (amount: Props['amount']) => void,
}>;

export default function WithdrawAmountSelection({ amount, className, error, setAmount, ...props }: Props) {
  const intl = useIntl();
  const { category } = useContext(AnalyticsContext);
  const { user } = useContext(AuthAndApiContext);

  const { region } = useContext(RegionContext);
  const base = useMemo<number | null>(() => {
    if (region === undefined) return null;

    return 50;
  }, [region]);

  return base === null ? null : (
    <section {...props} className={classNames(styles.withdrawAmountSelection, className)}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <FormattedMessage defaultMessage="Choose Amount to Withdraw" />
        </h3>

        <p className={styles.muted}>
          <FormattedMessage defaultMessage="Enter the amount of GAU Token you want to withdraw." />
        </p>
      </div>

      <div className={styles.input}>
        <button
          className={styles.button}
          onClick={() => {
            if (amount === null) return;

            if (amount <= base) {
              setAmount(base);

              sendGAEvent({ category, event: 'Set Amount', label: 'Withdraw', value: base });
            } else {
              const modulo = amount % base === 0 ? base : amount % base;
              const value = amount - modulo;

              setAmount(value);

              sendGAEvent({ category, event: 'Set Amount', label: 'Withdraw', value });
            }
          }}
          type="button"
        >
          <Extract />
        </button>

        <FormGroup error={error}>
          <TextInput
            className={styles.amountInput}
            id="withdraw-amount-selection"
            min={base}
            name="amount"
            onChange={(e) => {
              const value = Number(e.target.value);

              setAmount(value);

              sendGAEvent({ category, event: 'Set Amount', label: 'Withdraw', value });
            }}
            placeholder={intl.formatMessage({ defaultMessage: 'Enter Here' })}
            required
            type="number"
            value={(amount === null || amount <= 0) ? '' : amount.toString()}
          />
        </FormGroup>

        <button
          className={styles.button}
          onClick={() => {
            if (amount === null) {
              setAmount(base);

              return;
            }

            const value = amount + (base - (amount % base));

            setAmount(value);

            sendGAEvent({ category, event: 'Set Amount', label: 'Withdraw', value });
          }}
          type="button"
        >
          <Add />
        </button>
      </div>

      {user !== null && (
        <button
          className={styles.maxButton}
          onClick={() => {
            if (user.balance <= base) {
              setAmount(0);

              sendGAEvent({ category, event: 'Set Amount', label: 'Withdraw', value: 0 });
            } else {
              const modulo = user.balance % base;
              const value = user.balance - modulo;

              setAmount(value);

              sendGAEvent({ category, event: 'Set Amount', label: 'Withdraw', value });
            }
          }}
          type="button"
        >
          <FormattedMessage defaultMessage="or withdraw max balance" />
        </button>
      )}
    </section>
  );
}
