import omit from 'lodash/omit';
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';

type FormErrors = Record<string, Array<string>>;

const useForm = <V>(
  initialValues: V,
  initialErrors: FormErrors = {},
): [
  V,
  Dispatch<SetStateAction<V>>,
  any,
  FormErrors,
  Dispatch<SetStateAction<FormErrors>>,
] => {
  const [values, setValues] = useState<V>(initialValues);
  const [errors, setErrors] = useState<FormErrors>(initialErrors);

  const updateValue = (...args: [ChangeEvent<HTMLInputElement>] | [string, string]): void => {
    let name;
    let value;

    if (args.length === 1) {
      const event = args[0];

      ({ name } = event.target);

      value = event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value;
    } else {
      [
        name,
        value,
      ] = args;
    }

    setValues({
      ...values,
      [name]: value,
    });

    setErrors(omit(errors, [
      name,
      'detail',
      'nonFieldErrors',
    ]));
  };

  return [values, setValues, updateValue, errors, setErrors];
};

export default useForm;
