import { createContext } from 'react';

export type Value = {
  error?: string[],
};

const FormGroupContext = createContext<Value>({} as Value);

export default FormGroupContext;
