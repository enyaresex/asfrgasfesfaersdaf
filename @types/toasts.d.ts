type KeyedToast = Overwrite<Toast, {
  key: string,
}>;

type Toast = {
  content: React.ReactNode,
  isPersistent?: boolean,
  kind: 'success' | 'warning',
};
