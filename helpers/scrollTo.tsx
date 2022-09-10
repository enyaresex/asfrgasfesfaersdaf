import React from 'react';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, {
  id: string,
  pixelSize: number | 0,
}>

export const scrollTo = ({ id, pixelSize }: Props) => {
  const element = document.getElementById(id);
  const offsetTop: any = element?.getBoundingClientRect().top;

  window.scrollTo({
    top: offsetTop - pixelSize,
    behavior: 'smooth',
  });
};
