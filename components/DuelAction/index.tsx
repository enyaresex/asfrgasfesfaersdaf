import React, { useContext, useMemo } from 'react';
import { AuthAndApiContext } from '../../contexts';
import DuelCheckIn from '../DuelCheckIn';
import DuelEnded from '../DuelEnded';
import DuelInDispute from '../DuelInDispute';
import DuelInProgress from '../DuelInProgress';
import DuelCancel from '../DuelCancel';
import DuelJoin from '../DuelJoin';
import DuelResponse from '../DuelResponse';
import DuelResultDeclaration from '../DuelResultDeclaration';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['section']>, {
  duel: HydratedDuel,
}>;

export default function DuelAction({ className, duel, ...props }: Props) {
  const { user } = useContext(AuthAndApiContext);

  const content = useMemo<React.ReactNode>(() => {
    if (duel.status === 'OPEN' && user !== null && user.id !== duel.user1 && duel.user2 === null) {
      return (
        <DuelJoin duel={duel} />
      );
    }

    if (user !== null && user.id === duel.user1 && (duel.status === 'OPEN' || duel.status === 'INVITED')) {
      return (
        <DuelCancel duel={duel} />
      );
    }

    if (user !== null && user.id === duel.user2 && duel.status === 'INVITED') {
      return (
        <DuelResponse duel={duel} />
      );
    }

    if (duel.status === 'CHECKING_IN') {
      return (
        <DuelCheckIn duel={duel} />
      );
    }

    if (duel.status === 'IN_PROGRESS') {
      return (
        <DuelInProgress duel={duel} />
      );
    }

    if (user !== null && [duel.user1, duel.user2].includes(user.id) && duel.status === 'DECLARING_RESULT') {
      return (
        <DuelResultDeclaration duel={duel} />
      );
    }

    if (duel.status === 'IN_DISPUTE') {
      return (
        <DuelInDispute duel={duel} />
      );
    }

    if (duel.status === 'ENDED') {
      return (
        <DuelEnded duel={duel} />
      );
    }

    return null;
  }, [duel, user]);

  return content === null ? null : (
    <section {...props} className={className}>
      {content}
    </section>
  );
}
