import React from 'react';
import styles from './ToggleSwitch.module.css';

export type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['input']>, {
  id: string,
  name: string,
  label?: React.ReactNode,
  checked?: boolean,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
}>;

function ToggleSwitch({
  id,
  name,
  label,
  checked,
  onChange,
}: Props) {
  return (
    <div className={styles.toggle}>
      <label className={styles.toggleSwitch} htmlFor={id}>
        <input checked={checked} id={id} name={name} onChange={onChange} type="checkbox" />
        <span className={styles.switch} />
        <span className={styles.labelText}>{label}</span>
      </label>
    </div>
  );
}

export default React.forwardRef(ToggleSwitch);
