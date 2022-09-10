import classNames from 'classnames';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useClickAway } from 'react-use';
import useSWR from 'swr';
import Avatar from '../Avatar';
import TextInput, { Props as TextInputProps } from '../TextInput';
import { ReactComponent as Edit } from './edit.svg';
import styles from './UserInput.module.css';

type Props = Overwrite<TextInputProps, {
  idExclude?: number[],
  onChange: (userId: number | null) => any,
  regionId?: number,
  value: number | null,
}>;

type Response = {
  results: User[],
};

const sizeStyles: Record<FormComponentSize, string> = {
  large: styles.sizeLarge,
  medium: styles.sizeMedium,
  small: styles.sizeSmall,
};

export default function UserInput({
  className,
  idExclude,
  onChange,
  size = 'medium',
  regionId,
  value,
  ...props
}: Props) {
  const intl = useIntl();
  const userInput = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [isTextInputFocused, setIsTextInputFocused] = useState<boolean>(false);

  const { data: usersResponse } = useSWR<Response>(() => {
    if (inputValue === '') return null;

    const urlParams = new URLSearchParams({ username: inputValue });

    if (regionId !== undefined) {
      urlParams.append('region', regionId.toString());
    }

    if (idExclude !== undefined) {
      idExclude.forEach((id) => {
        urlParams.append('id_exclude', id.toString());
      });
    }

    return `/users/?${urlParams.toString()}`;
  });
  const { data: user } = useSWR<User>(value === null ? null : `/users/${value}/`);

  const users = useMemo<User[] | null>(() => {
    if (usersResponse === undefined) return null;

    return usersResponse.results;
  }, [usersResponse]);

  useClickAway(userInput, () => {
    if (isTextInputFocused) {
      setInputValue('');
      setIsTextInputFocused(false);
    }
  });

  useEffect(() => {
    if (value !== null && inputValue !== '') {
      setInputValue('');
    }
  }, [value]);

  return (
    <div className={classNames(styles.userInput, sizeStyles[size])} ref={userInput}>
      {user === undefined ? (
        <>
          <TextInput
            {...props}
            autoComplete="off"
            className={classNames(className)}
            onChange={(event) => {
              onChange(null);
              setInputValue(event.target.value);
            }}
            onFocus={(event) => {
              setIsTextInputFocused(true);

              props.onFocus && props.onFocus(event);
            }}
            size={size}
            value={inputValue}
          />

          {(users !== null && isTextInputFocused) && (
            <div className={styles.choices}>
              {users.map((u) => (
                <button
                  className={styles.choiceButton}
                  key={u.id}
                  onClick={() => {
                    onChange(u.id);

                    setIsTextInputFocused(false);
                  }}
                  type="button"
                >
                  <Avatar image={u.avatar} size={24} />

                  <p className={styles.username}>
                    {u.username}
                  </p>
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className={styles.value}>
          <Avatar alt={user.username} image={user.avatar} size={30} />

          <div className={styles.valueUsername}>
            {user.username}
          </div>

          <div className={styles.valueActions}>
            <button
              className={styles.valueEditButton}
              onClick={() => onChange(null)}
              title={intl.formatMessage({ defaultMessage: 'Edit' })}
              type="button"
            >
              <Edit />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
