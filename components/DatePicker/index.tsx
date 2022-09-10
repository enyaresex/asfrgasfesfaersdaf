import classNames from 'classnames';
import React from 'react';
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';
import styles from './DatePicker.module.css';

export type Props = ReactDatePickerProps;

function DatePicker({ className, ...props }: Props, ref: React.Ref<HTMLDivElement>) {
  return (
    <div
      className={classNames(styles.datePicker, className)}
      ref={ref}
    >
      <ReactDatePicker {...props} />
    </div>
  );
}

export default React.forwardRef(DatePicker);
