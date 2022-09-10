import classNames from 'classnames';
import React, { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { AnalyticsContext } from '../../contexts';
import { sendGAEvent } from '../../helpers';
import FormGroup from '../FormGroup';
import RadioInput from '../RadioInput';
import styles from './DepositAmountSelection.module.css';

const depositAmounts: number[] = [20, 50, 100, 200, 500, 1000];

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['section']>, {
  amount: number | null,
  error?: string[],
  setAmount: React.Dispatch<React.SetStateAction<number>>,
}>;

export default function DepositAmountSelection({ amount, className, error, setAmount, ...props }: Props) {
  const { category } = useContext(AnalyticsContext);

  return (
    <section {...props} className={classNames(styles.depositAmountSelection, className)}>
      <h3 className={styles.title}>
        <FormattedMessage defaultMessage="Choose Amount to Deposit" />
      </h3>

      <div className={styles.selectionWrapper}>
        {depositAmounts.map((depositAmount) => (
          <FormGroup className={styles.formGroup} error={error} key={depositAmount}>
            <RadioInput
              checked={amount === depositAmount}
              id={`${depositAmount}`}
              label={<FormattedMessage defaultMessage="{amount} GAU" values={{ amount: depositAmount }} />}
              onChange={(e) => {
                const value = Number(e.target.value);

                setAmount(value);

                sendGAEvent({ category, event: 'Set Amount', label: 'Deposit', value });
              }}
              value={depositAmount}
            />
          </FormGroup>
        ))}
      </div>
    </section>
  );
}
