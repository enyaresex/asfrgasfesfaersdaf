import React from 'react';
import { ReactComponent as LogoSvg } from './logo.svg';
import { ReactComponent as MobileLogoSvg } from './mobileLogo.svg';

type Props = React.PropsWithoutRef<JSX.IntrinsicElements['svg']> & {
  shrink?: boolean,
};

export default function Logo({ shrink = false, ...props }: Props) {
  return shrink ? <MobileLogoSvg {...props} /> : <LogoSvg {...props} />;
}
